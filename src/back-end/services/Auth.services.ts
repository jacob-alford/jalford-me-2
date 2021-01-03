import * as TE from "fp-ts/lib/TaskEither";
import { pipe, flow } from "fp-ts/lib/function";
import { sequenceT } from "fp-ts/lib/Apply";
import * as D from "io-ts/lib/Decoder";
import * as jwt from "jsonwebtoken";
import axios from "axios";
import { env } from "back-end/env";
import * as U from "models/User";
import * as M from "utils/messages";

const sequence = sequenceT(TE.taskEither);

interface KeyPassphrase {
  key: string;
  passphrase: string;
}

const signJWT: (
  payload: Omit<U.UserJWT, "sub">,
  keyPassphrase: KeyPassphrase,
  options: jwt.SignOptions
) => TE.TaskEither<unknown, string> = TE.taskify(
  jwt.sign as (
    payload: Record<string, any>,
    keyPassphrase: KeyPassphrase,
    options: jwt.SignOptions,
    cb: (err: unknown, jwt: string | undefined) => void
  ) => void
);

const getPrivateKey = (url: string): TE.TaskEither<M.JAError, string> =>
  pipe(
    url,
    TE.tryCatchK(
      axios.get,
      flow(String, M.internalError("Error retrieving private key!"))
    ),
    TE.chain(result =>
      pipe(
        result.data,
        D.string.decode,
        TE.fromEither,
        TE.mapLeft(
          flow(
            D.draw,
            M.internalError("Unexpected response format retrieving private key!")
          )
        )
      )
    )
  );

export const SIGN_TOKEN = (
  expiresIn: string,
  { email, display_name, id }: U.PublicUser
): TE.TaskEither<M.JAError, string> =>
  pipe(
    env.SIGNING_PRIVATE_KEY_URL,
    TE.chain(getPrivateKey),
    TE.chain(privateKey =>
      sequence(
        TE.right(privateKey) as TE.TaskEither<M.JAError, string>,
        env.SIGNING_PRIVATE_KEY_PASSPHRASE
      )
    ),
    TE.chain(([key, passphrase]) =>
      pipe(
        signJWT(
          { email, display_name },
          { key, passphrase },
          { algorithm: "ES512", expiresIn, subject: id }
        ),
        TE.mapLeft(
          flow(String, M.internalError("Unable to sign with private-key/passphrase!"))
        )
      )
    )
  );
