import { pipe, flow, identity } from "fp-ts/lib/function";
import * as TE from "fp-ts/lib/TaskEither";
import * as E from "fp-ts/lib/Either";
import * as D from "io-ts/lib/Decoder";
import * as A from "fp-ts/lib/Array";
import * as O from "fp-ts/lib/Option";
import * as jwt from "jsonwebtoken";
import * as BHPT from "utils/BHPT";
import * as M from "utils/messages";
import * as Kn from "utils/knowledge";

const SECRET_KEY = process.env.JWT_SECRET_KEY as string;

export type ReqArgs<Bd, Hd, Pm, Tk> = TE.TaskEither<M.JAError, BHPT.BHPT<Bd, Hd, Pm, Tk>>;

export const decodeBody = <Nv, Hd = Kn.Unknown, Pm = Kn.Unknown, Tk = Kn.Unknown>(
  db: D.Decoder<unknown, Nv>
) => ({
  body,
  headers,
  params,
  token
}: BHPT.BHPT<Kn.Unknown, Hd, Pm, Tk>): ReqArgs<Kn.Known<Nv>, Hd, Pm, Tk> =>
  pipe(
    body.__UNSAFE__unknown,
    db.decode,
    E.bimap(flow(D.draw, M.malformedInputError("Unexpected malformed body")), body => ({
      body: Kn.known(body),
      headers,
      params,
      token
    })),
    TE.fromEither
  );

export const decodeHeaders = <Nv, Bd = Kn.Unknown, Pm = Kn.Unknown, Tk = Kn.Unknown>(
  dh: D.Decoder<unknown, Nv>
) => ({
  body,
  headers,
  params,
  token
}: BHPT.BHPT<Bd, Kn.Unknown, Pm, Tk>): ReqArgs<Bd, Kn.Known<Nv>, Pm, Tk> =>
  pipe(
    headers.__UNSAFE__unknown,
    dh.decode,
    E.bimap(
      flow(D.draw, M.malformedInputError("Unexpected malformed headers")),
      headers => ({
        body,
        headers: Kn.known(headers),
        params,
        token
      })
    ),
    TE.fromEither
  );

const jwtIsValid = (jwt: string): boolean => pipe(jwt.split("."), a => a.length === 3);

const decodeHeadersWithAuthorization: D.Decoder<unknown, AuthorizedHeaders> = D.type({
  Authorization: pipe(
    D.string,
    D.refine(
      (auth): auth is BearerAuth =>
        pipe(
          auth.split(" "),
          authParts =>
            pipe(
              authParts,
              A.lookup(0),
              O.chain(bearer =>
                pipe(
                  authParts,
                  A.lookup(1),
                  O.chain(
                    O.fromPredicate(token => bearer === "Bearer" && jwtIsValid(token))
                  )
                )
              )
            ),
          O.fold(
            () => false,
            () => true
          )
        ),
      "Bearer Auth"
    )
  )
});

export const decodeAuthHeaders = decodeHeaders(decodeHeadersWithAuthorization);

export const decodeParams = <Nv, Bd = Kn.Unknown, Hd = Kn.Unknown, Tk = Kn.Unknown>(
  dp: D.Decoder<unknown, Nv>
) => ({
  body,
  headers,
  params,
  token
}: BHPT.BHPT<Bd, Hd, Kn.Unknown, Tk>): ReqArgs<Bd, Hd, Kn.Known<Nv>, Tk> =>
  pipe(
    params.__UNSAFE__unknown,
    dp.decode,
    E.bimap(
      flow(D.draw, M.malformedInputError("Unexpected malformed parameters")),
      params => ({
        body,
        headers,
        params: Kn.known(params),
        token
      })
    ),
    TE.fromEither
  );

export const decodeToken = <Nv, Bd, Hd, Pm>(
  getTokenData: (
    bhpt: BHPT.BHPT<Bd, Kn.Known<Hd>, Pm, Kn.Unknown>
  ) => TE.TaskEither<string, Kn.Knowledge<Nv>>
) => (dt: D.Decoder<unknown, Nv>) => (
  bhpt: BHPT.BHPT<Bd, Kn.Known<Hd>, Pm, Kn.Unknown>
): ReqArgs<Bd, Kn.Known<Hd>, Pm, Kn.Known<Nv>> =>
  pipe(
    getTokenData(bhpt),
    TE.mapLeft(M.unauthorizedError("Unauthorized")),
    TE.chain(
      Kn.fold(
        TE.right,
        flow(
          dt.decode,
          E.mapLeft(flow(D.draw, M.malformedInputError("Unexpected malformed token"))),
          TE.fromEither
        )
      )
    ),
    TE.map(token => ({
      body: bhpt.body,
      headers: bhpt.headers,
      params: bhpt.params,
      token: Kn.known(token)
    }))
  );

export const verifyJWT: (
  token: string,
  secretKey: string,
  options?: jwt.VerifyOptions
) => TE.TaskEither<unknown, unknown> = TE.taskify(
  jwt.verify as (
    token: string,
    secret: string,
    options?: jwt.DecodeOptions,
    cb?: (err: unknown, token: unknown) => void
  ) => void
);

type BearerAuth = string;

interface AuthorizedHeaders {
  Authorization: BearerAuth;
}

interface UserJWT {
  email: string;
  sub: string;
  display_name: string;
}

const decodeUserJWT: D.Decoder<unknown, UserJWT> = D.type({
  email: D.string,
  sub: D.string,
  display_name: D.string
});

export const validateJwt = decodeToken<
  UserJWT,
  Kn.Unknown,
  AuthorizedHeaders,
  Kn.Unknown
>(({ headers }) =>
  pipe(
    verifyJWT(
      pipe(
        headers.value.Authorization.split(" "),
        A.lookup(1),
        O.fold(() => "", identity)
      ),
      SECRET_KEY
    ),
    TE.bimap(String, Kn.unknown)
  )
)(decodeUserJWT);

export const authorizeToken = <Tk, Bd, Hd, Pm>(
  validator: (bhpt: BHPT.BHPT<Bd, Hd, Pm, Kn.Known<Tk>>) => [boolean, string]
) => (bhpt: BHPT.BHPT<Bd, Hd, Pm, Kn.Known<Tk>>): ReqArgs<Bd, Hd, Pm, Kn.Known<Tk>> =>
  pipe(
    validator(bhpt),
    TE.fromPredicate(
      ([authorized]) => authorized,
      ([, reason]) => M.unauthorizedError("Unauthorized")(reason)
    ),
    TE.map(() => bhpt)
  );
