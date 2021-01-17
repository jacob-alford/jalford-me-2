import { pipe, flow, identity } from "fp-ts/lib/function";
import * as TE from "fp-ts/lib/TaskEither";
import * as D from "io-ts/lib/Decoder";
import * as E from "fp-ts/lib/Either";
import * as M from "utils/messages";

const formatAuth = (id_token?: string): {} | { authorization: string } =>
  id_token
    ? {
        authorization: `Bearer ${id_token}`
      }
    : {};

export const defaultOnFailed = (statusCode: number): string =>
  `Request failed with status_code: ${statusCode}`;

export const POST = <A>(
  decodeResponse: D.Decoder<unknown, A>,
  onUnrecognizedFailure: (status_code: number) => string = defaultOnFailed
) => <B extends {}>(path: string, json: B, id_token?: string): TE.TaskEither<string, A> =>
  pipe(
    E.stringifyJSON(json, String),
    TE.fromEither,
    TE.chain(
      TE.tryCatchK(
        body =>
          fetch(path, {
            method: "POST",
            headers: {
              ...formatAuth(id_token),
              "Content-Type": "application/json"
            },
            body
          }),
        identity
      )
    ),
    /* Case for network errors, and the like */
    TE.mapLeft(String),
    TE.chain(
      TE.fromPredicate(
        response => response.ok,
        response =>
          pipe(
            response,
            M.decodeJAError.decode,
            /* Case for not . `elem` [200..299] */
            E.fold(
              () => {
                console.error(response);
                return onUnrecognizedFailure(response.status);
              },
              jaErr => {
                console.error(jaErr);
                return jaErr.message;
              }
            )
          )
      )
    ),
    TE.chain(
      TE.tryCatchK(
        response => response.json() as Promise<unknown>,
        err => `Error parsing response json: ${String(err)}`
      )
    ),
    TE.chain(flow(decodeResponse.decode, E.mapLeft(D.draw), TE.fromEither))
  );

export const GET = <A>(
  decodeResponse: D.Decoder<unknown, A>,
  onUnrecognizedFailure: (status_code: number) => string = defaultOnFailed
) => (path: string, id_token?: string): TE.TaskEither<string, A> =>
  pipe(
    TE.tryCatchK(
      () =>
        fetch(path, {
          method: "GET",
          headers: {
            ...formatAuth(id_token),
            "Content-Type": "application/json"
          }
        }),
      identity
    )() /* Case for network errors, and the like */,
    TE.mapLeft(String),
    TE.chain(
      TE.fromPredicate(
        response => response.ok,
        response =>
          pipe(
            response,
            M.decodeJAError.decode,
            /* Case for not . `elem` [200..299] */
            E.fold(
              () => {
                console.error(response);
                return onUnrecognizedFailure(response.status);
              },
              jaErr => {
                console.error(jaErr);
                return jaErr.message;
              }
            )
          )
      )
    ),
    TE.chain(
      TE.tryCatchK(
        response => response.json() as Promise<unknown>,
        err => `Error parsing response json: ${String(err)}`
      )
    ),
    TE.chain(flow(decodeResponse.decode, E.mapLeft(D.draw), TE.fromEither))
  );
