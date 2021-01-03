import * as E from "fp-ts/lib/Either";
import * as TE from "fp-ts/lib/TaskEither";
import { pipe } from "fp-ts/lib/function";
import * as M from "utils/messages";

type EnvVarEither = TE.TaskEither<M.JAError, string>;

const getEnvVar = (key: string): EnvVarEither =>
  pipe(
    process.env[key],
    E.fromNullable(
      M.internalError(`Environment variables are not configured!`)(
        `Environment variable with key: ${key} is not defined!`
      )
    ),
    TE.fromEither
  );

interface EnvVar {
  DATABASE_URL: EnvVarEither;
  SIGNING_PRIVATE_KEY_PASSPHRASE: EnvVarEither;
  SIGNING_PRIVATE_KEY_URL: EnvVarEither;
  SIGNING_PUBLIC_KEY_URL: EnvVarEither;
}

export const env: EnvVar = {
  DATABASE_URL: getEnvVar("DATABASE_URL"),
  SIGNING_PRIVATE_KEY_PASSPHRASE: getEnvVar("SIGNING_PRIVATE_KEY_PASSPHRASE"),
  SIGNING_PRIVATE_KEY_URL: getEnvVar("SIGNING_PRIVATE_KEY_URL"),
  SIGNING_PUBLIC_KEY_URL: getEnvVar("SIGNING_PUBLIC_KEY_URL")
};
