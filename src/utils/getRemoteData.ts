import { QueryStatus } from "react-query";
import * as De from "@nll/datum/DatumEither";
import * as E from "fp-ts/lib/Either";
import * as O from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/function";

export const getRemoteData = <E, A>(
  data: undefined | E.Either<E, A>,
  error: unknown,
  status: QueryStatus,
  onUnknownError: (ue: unknown) => E
): De.DatumEither<E, A> =>
  ((data, error, status) =>
    status === "idle"
      ? pipe(
          data,
          O.fold(
            () => De.initial,
            data =>
              pipe(
                De.fromEither(() => data),
                De.toReplete
              )
          )
        )
      : status === "loading"
      ? pipe(
          data,
          O.fold(
            () => De.pending,
            data =>
              pipe(
                De.fromEither(() => data),
                De.toRefresh
              )
          )
        )
      : status === "error"
      ? pipe(
          data,
          O.fold(
            () => pipe(De.failure(onUnknownError(error)), De.toReplete),
            data =>
              pipe(
                De.fromEither(() => data),
                De.toReplete
              )
          )
        )
      : pipe(
          data,
          O.fold(
            () => De.initial,
            E.fold(
              err => pipe(De.failure(err), De.toReplete) as De.DatumEither<E, A>,
              data => pipe(De.success(data), De.toReplete) as De.DatumEither<E, A>
            )
          )
        ))(O.fromNullable(data), error, status);
