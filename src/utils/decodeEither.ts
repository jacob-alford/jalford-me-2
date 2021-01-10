import * as D from "io-ts/lib/Decoder";
import * as E from "fp-ts/lib/Either";

export const decodeEither = <E, A>(
  leftDecoder: D.Decoder<unknown, E>,
  rightDecoder: D.Decoder<unknown, A>
): D.Decoder<unknown, E.Either<E, A>> =>
  D.union(
    D.type({
      _tag: D.literal("Left"),
      left: leftDecoder
    }),
    D.type({
      _tag: D.literal("Right"),
      right: rightDecoder
    })
  );
