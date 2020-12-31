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

export const decodeBody = <Bd = unknown, Hd = unknown, Pm = unknown, Tk = unknown>(
  db: D.Decoder<unknown, Bd>
) => ({
  body,
  headers,
  params,
  token
}: BHPT.BHPT<Kn.Unknown, Hd, Pm, Tk>): ReqArgs<Kn.Known<Bd>, Hd, Pm, Tk> =>
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

export const decodeHeaders = <Bd = unknown, Hd = unknown, Pm = unknown, Tk = unknown>(
  dh: D.Decoder<unknown, Hd>
) => ({
  body,
  headers,
  params,
  token
}: BHPT.BHPT<Bd, Kn.Unknown, Pm, Tk>): ReqArgs<Bd, Kn.Known<Hd>, Pm, Tk> =>
  pipe(
    headers,
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
                  O.map(token => bearer === "Bearer")
                )
              )
            ),
          O.fold(() => false, identity)
        ),
      "Bearer Auth"
    )
  )
});

export const decodeAuthHeaders = decodeHeaders(decodeHeadersWithAuthorization);

export const decodeParams = <Bd = unknown, Hd = unknown, Pm = unknown, Tk = unknown>(
  dp: D.Decoder<unknown, Pm>
) => ({
  body,
  headers,
  params,
  token
}: BHPT.BHPT<Bd, Hd, Kn.Unknown, Tk>): ReqArgs<Bd, Hd, Kn.Known<Pm>, Tk> =>
  pipe(
    params,
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

export const decodeToken = <Bd = unknown, Hd = unknown, Pm = unknown, Tk = unknown>(
  getTokenData: (
    bhpt: BHPT.BHPT<Bd, Kn.Known<Hd>, Pm, Kn.Unknown>
  ) => TE.TaskEither<string, Kn.Knowledge<Tk>>
) => (dt: D.Decoder<unknown, Tk>) => (
  bhpt: BHPT.BHPT<Bd, Kn.Known<Hd>, Pm, Kn.Unknown>
): ReqArgs<Bd, Kn.Known<Hd>, Pm, Kn.Known<Tk>> =>
  pipe(
    getTokenData(bhpt),
    TE.mapLeft(M.internalError("Unable to decode user token!")),
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

export const _decodeJWT: (
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
  user_id: string;
  display_name: string;
}

const decodeUserJWT: D.Decoder<unknown, UserJWT> = D.type({
  email: D.string,
  user_id: D.string,
  display_name: D.string
});

export const decodeJWT = decodeToken<unknown, AuthorizedHeaders, unknown, UserJWT>(
  ({ headers }) =>
    pipe(
      _decodeJWT(headers.value.Authorization, SECRET_KEY),
      TE.bimap(String, Kn.unknown)
    )
)(decodeUserJWT);

export const authorizeToken = <Tk, Bd = unknown, Hd = unknown, Pm = unknown>(
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
