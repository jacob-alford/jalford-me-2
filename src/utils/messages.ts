import * as D from "io-ts/lib/Decoder";
import * as H from "hyper-ts";

type ErrorCodes = "INTERNAL" | "UNAUTHORIZED" | "MALFORMED_INPUT" | "NOT_FOUND";

type StatusNumbers = H.Status;

export interface JAError {
  status_code: ErrorCodes;
  status_number: StatusNumbers;
  error: string;
  message: string;
}

export const decodeJAError: D.Decoder<unknown, JAError> = D.type({
  status_code: D.literal("INTERNAL", "UNAUTHORIZED", "MALFORMED_INPUT"),
  status_number: D.literal(500, 401, 400),
  error: D.string,
  message: D.string
});

export const notFoundError = (message: string) => (error: string): JAError => ({
  status_code: "NOT_FOUND",
  status_number: 404,
  error,
  message
});

export const internalError = (message: string) => (error: string): JAError => ({
  status_code: "INTERNAL",
  status_number: 500,
  error,
  message
});

export const unauthorizedError = (message: string) => (error: string): JAError => ({
  status_code: "UNAUTHORIZED",
  status_number: 401,
  error,
  message
});

export const malformedInputError = (message: string) => (error: string): JAError => ({
  status_code: "MALFORMED_INPUT",
  status_number: 400,
  error,
  message
});

type SuccessCodes =
  | "SUCCESSFUL_CREATE"
  | "SUCCESSFUL_READ"
  | "SUCCESSFUL_UPDATE"
  | "SUCCESSFUL_DELETE";

export interface JASuccess<A> {
  status_code: SuccessCodes;
  status_number: StatusNumbers;
  message: string;
  data: A;
}

export const decodeJASuccess = <A>(
  dataDecode: D.Decoder<unknown, A>
): D.Decoder<unknown, JASuccess<A>> =>
  D.type({
    status_code: D.literal(
      "SUCCESSFUL_CREATE",
      "SUCCESSFUL_READ",
      "SUCCESSFUL_UPDATE",
      "SUCCESSFUL_DELETE"
    ),
    status_number: D.literal(200, 201),
    message: D.string,
    data: dataDecode
  });

export const successfulCreate = (message: string) => <A>(data: A): JASuccess<A> => ({
  status_code: "SUCCESSFUL_CREATE",
  status_number: 201,
  message,
  data
});

export const successfulUpdate = (message: string) => <A>(data: A): JASuccess<A> => ({
  status_code: "SUCCESSFUL_UPDATE",
  status_number: 200,
  message,
  data
});

export const successfulRead = (message: string) => <A>(data: A): JASuccess<A> => ({
  status_code: "SUCCESSFUL_READ",
  status_number: 200,
  message,
  data
});

export const successfulDelete = (message: string) => <A>(data: A): JASuccess<A> => ({
  status_code: "SUCCESSFUL_DELETE",
  status_number: 200,
  message,
  data
});
