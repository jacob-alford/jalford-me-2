import * as TE from "fp-ts/lib/TaskEither";
import * as D from "io-ts/lib/Decoder";
import { pipe, flow } from "fp-ts/lib/function";
import axios, { AxiosRequestConfig } from "axios";
import * as M from "utils/messages";

export const get = <A>(
  decoder: D.Decoder<unknown, A>,
  fetchErr: string = "Error with GET Request",
  respErr: string = "Unexpected response format with GET Request"
) => (url: string, config?: AxiosRequestConfig): TE.TaskEither<M.JAError, A> =>
  pipe(
    url,
    TE.tryCatchK(url => axios.get(url, config), flow(String, M.internalError(fetchErr))),
    TE.chain(result =>
      pipe(
        result.data,
        decoder.decode,
        TE.fromEither,
        TE.mapLeft(flow(D.draw, M.internalError(respErr)))
      )
    )
  );

export const post = <A, B>(
  decoder: D.Decoder<unknown, B>,
  fetchErr: string = "Error with POST Request",
  respErr: string = "Unexpected response format with POST Request"
) => (url: string, body?: A, config?: AxiosRequestConfig): TE.TaskEither<M.JAError, B> =>
  pipe(
    url,
    TE.tryCatchK(
      url => axios.post(url, body, config),
      flow(String, M.internalError(fetchErr))
    ),
    TE.chain(result =>
      pipe(
        result.data,
        decoder.decode,
        TE.fromEither,
        TE.mapLeft(flow(D.draw, M.internalError(respErr)))
      )
    )
  );
