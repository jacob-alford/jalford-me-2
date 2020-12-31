import { pipe, flow } from "fp-ts/lib/function";
import * as TE from "fp-ts/lib/TaskEither";
import * as E from "fp-ts/lib/Either";
import * as D from "io-ts/lib/Decoder";
import * as BHPT from "utils/BHPT";
import * as M from "utils/messages";
import * as Kn from "utils/knowledge";

export type ReqArgs<Bd, Hd, Pm, Tk> = TE.TaskEither<M.JAError, BHPT.BHPT<Bd, Hd, Pm, Tk>>;

export const decodeBody = <Bd, Hd, Pm, Tk>(db: D.Decoder<unknown, Bd>) => ({
  body,
  headers,
  params,
  token
}: BHPT.BHPT<Bd, Hd, Pm, Tk>): ReqArgs<Kn.Known<Bd>, Hd, Pm, Tk> =>
  pipe(
    body as unknown,
    db.decode,
    E.bimap(flow(D.draw, M.malformedInputError("Unexpected malformed body")), body => ({
      body: Kn.known(body),
      headers,
      params,
      token
    })),
    TE.fromEither
  );

export const decodeHeaders = <Bd, Hd, Pm, Tk>(dh: D.Decoder<unknown, Hd>) => ({
  body,
  headers,
  params,
  token
}: BHPT.BHPT<Bd, Hd, Pm, Tk>): ReqArgs<Bd, Kn.Known<Hd>, Pm, Tk> =>
  pipe(
    headers,
    dh.decode,
    E.bimap(
      flow(D.draw, M.malformedInputError("Unexpected malformed body")),
      headers => ({
        body,
        headers: Kn.known(headers),
        params,
        token
      })
    ),
    TE.fromEither
  );

export const decodeParams = <Bd, Hd, Pm, Tk>(dp: D.Decoder<unknown, Pm>) => ({
  body,
  headers,
  params,
  token
}: BHPT.BHPT<Bd, Hd, Pm, Tk>): ReqArgs<Bd, Hd, Kn.Known<Pm>, Tk> =>
  pipe(
    params,
    dp.decode,
    E.bimap(flow(D.draw, M.malformedInputError("Unexpected malformed body")), params => ({
      body,
      headers,
      params: Kn.known(params),
      token
    })),
    TE.fromEither
  );

export const decodeToken = <Bd, Hd, Pm, Tk>(dt: D.Decoder<unknown, Tk>) => ({
  body,
  headers,
  params,
  token
}: BHPT.BHPT<Bd, Hd, Pm, Tk>): ReqArgs<Bd, Hd, Pm, Kn.Known<Tk>> =>
  pipe(
    token,
    dt.decode,
    E.bimap(flow(D.draw, M.malformedInputError("Unexpected malformed body")), token => ({
      body,
      headers,
      params,
      token: Kn.known(token)
    })),
    TE.fromEither
  );
