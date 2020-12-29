import * as D from "io-ts/lib/Decoder";

export const decodeEmptyArray: D.Decoder<unknown, Array<never>> = {
  decode: array =>
    Array.isArray(array) && array.length === 0
      ? D.success(array as Array<never>)
      : D.failure(array, "Did not recieve empty array")
};
