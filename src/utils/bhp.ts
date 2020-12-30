import { Request, Response, NextFunction } from "express";
import { pipe, flow } from "fp-ts/lib/function";
import * as E from "fp-ts/lib/Either";
import * as TE from "fp-ts/lib/TaskEither";
import * as D from "io-ts/lib/Decoder";
import * as DE from "io-ts/lib/DecodeError";
import { FreeSemigroup } from "io-ts/FreeSemigroup";
import * as KN from "utils/knowledge";
import * as M from "utils/messages";

interface _B<B> {
  body: B;
}

interface _H<H> {
  headers: H;
}

interface _P<P> {
  params: P;
}

type BHP<B, H, P> = _B<B> & _H<H> & _P<P>;

export const decodeBody = <B, E>(
  db: D.Decoder<unknown, B>,
  onDecodeError: (e: FreeSemigroup<DE.DecodeError<string>>) => E
) => <H, P>({
  body,
  headers,
  params
}: BHP<KN.Knowledge<B>, H, P>): E.Either<E, BHP<KN.Known<B>, H, P>> =>
  pipe(
    body,
    KN.fold(E.right, db.decode),
    E.bimap(onDecodeError, b => ({
      body: KN.known(b),
      headers,
      params
    }))
  );

export const decodeHeaders = <H, E>(
  dh: D.Decoder<unknown, H>,
  onDecodeError: (e: FreeSemigroup<DE.DecodeError<string>>) => E
) => <B, P>({
  body,
  headers,
  params
}: BHP<B, KN.Knowledge<H>, P>): E.Either<E, BHP<B, KN.Known<H>, P>> =>
  pipe(
    headers,
    KN.fold(E.right, dh.decode),
    E.bimap(onDecodeError, h => ({
      body,
      headers: KN.known(h),
      params
    }))
  );

export const decodeParams = <P, E>(
  dp: D.Decoder<unknown, P>,
  onDecodeError: (e: FreeSemigroup<DE.DecodeError<string>>) => E
) => <B, H>({
  body,
  headers,
  params
}: BHP<B, H, KN.Knowledge<P>>): E.Either<E, BHP<B, H, KN.Known<P>>> =>
  pipe(
    params,
    KN.fold(E.right, dp.decode),
    E.bimap(onDecodeError, p => ({
      body,
      headers,
      params: KN.known(p)
    }))
  );

export const liftResponseBHP = <B, H, P, R>(
  f: (body: B, headers: H, params: P) => TE.TaskEither<M.JAError, R>,
  db: D.Decoder<unknown, B>,
  dh: D.Decoder<unknown, H>,
  dp: D.Decoder<unknown, P>
) => (
  bhp: BHP<KN.Knowledge<B>, KN.Knowledge<H>, KN.Knowledge<P>>
): TE.TaskEither<M.JAError, R> =>
  pipe(
    bhp,
    decodeBody(db, flow(D.draw, M.malformedInputError("Unexpected body"))),
    E.chain(decodeParams(dp, flow(D.draw, M.malformedInputError("Unexpected params")))),
    E.chain(decodeHeaders(dh, flow(D.draw, M.malformedInputError("Unexpected headers")))),
    TE.fromEither,
    TE.chain(({ body, headers, params }) =>
      f(body.processed, headers.processed, params.processed)
    )
  );

export const liftResponseBP = <B, P, R>(
  f: (body: B, params: P) => TE.TaskEither<M.JAError, R>,
  db: D.Decoder<unknown, B>,
  dp: D.Decoder<unknown, P>
) => (
  bhp: BHP<KN.Knowledge<B>, KN.Knowledge<unknown>, KN.Knowledge<P>>
): TE.TaskEither<M.JAError, R> =>
  pipe(
    bhp,
    decodeBody(db, flow(D.draw, M.malformedInputError("Malformed request body"))),
    E.chain(
      decodeParams(dp, flow(D.draw, M.malformedInputError("Unexpected parameters")))
    ),
    TE.fromEither,
    TE.chain(({ body, params }) => f(body.processed, params.processed))
  );

export const liftResponseB = <B, R>(
  f: (body: B) => TE.TaskEither<M.JAError, R>,
  db: D.Decoder<unknown, B>
) => (
  bhp: BHP<KN.Knowledge<B>, KN.Knowledge<unknown>, KN.Knowledge<unknown>>
): TE.TaskEither<M.JAError, R> =>
  pipe(
    bhp,
    decodeBody(db, flow(D.draw, M.malformedInputError("Malformed request body"))),
    TE.fromEither,
    TE.chain(({ body }) => f(body.processed))
  );

export const liftResponseP = <P, R>(
  f: (params: P) => TE.TaskEither<M.JAError, R>,
  dp: D.Decoder<unknown, P>
) => (
  bhp: BHP<KN.Knowledge<unknown>, KN.Knowledge<unknown>, KN.Knowledge<P>>
): TE.TaskEither<M.JAError, R> =>
  pipe(
    bhp,
    decodeParams(dp, flow(D.draw, M.malformedInputError("Malformed request body"))),
    TE.fromEither,
    TE.chain(({ params }) => f(params.processed))
  );

export const liftResponseH = <H, R>(
  f: (headers: H) => TE.TaskEither<M.JAError, R>,
  dh: D.Decoder<unknown, H>
) => (
  bhp: BHP<KN.Knowledge<unknown>, KN.Knowledge<H>, KN.Knowledge<unknown>>
): TE.TaskEither<M.JAError, R> =>
  pipe(
    bhp,
    decodeHeaders(dh, flow(D.draw, M.malformedInputError("Malformed request body"))),
    TE.fromEither,
    TE.chain(({ headers }) => f(headers.processed))
  );

export const bhpFromRequest = <B, H, P>(
  req: Request
): BHP<KN.Knowledge<B>, KN.Knowledge<H>, KN.Knowledge<P>> => ({
  body: KN.unknown(req.body as unknown),
  headers: KN.unknown(req.headers as unknown),
  params: KN.unknown(req.params)
});

export const toRequestHandler = <A, B = unknown, H = unknown, P = unknown>(
  handler: (
    bhp: BHP<KN.Knowledge<B>, KN.Knowledge<H>, KN.Knowledge<P>>
  ) => TE.TaskEither<M.JAError, M.JASuccess<A>>
) => async (req: Request, res: Response, next: NextFunction): Promise<void> =>
  pipe(
    await pipe(bhpFromRequest<B, H, P>(req), handler)(),
    E.fold(
      err => next(err),
      data => {
        res.status(data.status_number);
        res.send(data);
        next();
      }
    )
  );
