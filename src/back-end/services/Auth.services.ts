import * as TE from "fp-ts/lib/TaskEither";
import { pipe, flow, identity } from "fp-ts/lib/function";
import { sequenceT } from "fp-ts/lib/Apply";
import * as D from "io-ts/lib/Decoder";
import * as E from "fp-ts/lib/Either";
import * as jwt from "jsonwebtoken";
import * as a2 from "argon2";
import { env } from "back-end/env";
import * as U from "models/User";
import * as US from "back-end/services/User.services";
import * as M from "utils/messages";

const sequence = sequenceT(TE.taskEither);

export interface Tokens {
  id_token: string;
  refresh_token: string;
}

export const verifyJWT: (
  token: string,
  publicKey: string,
  options?: jwt.VerifyOptions
) => TE.TaskEither<unknown, unknown> = TE.taskify(
  jwt.verify as (
    token: string,
    publicKey: string,
    options?: jwt.DecodeOptions,
    cb?: (err: unknown, token: unknown) => void
  ) => void
);

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

export const PUBLIC_KEY =
  "ecdsa-sha2-nistp521 AAAAE2VjZHNhLXNoYTItbmlzdHA1MjEAAAAIbmlzdHA1MjEAAACFBAEIBEqq2tKC6Ghdu5SPs2bPY6nHuoDj+XFl9zzCxUr03+LY2YE7Bcouv2hDZg9S/Q9u4WRGa8KxxtYYOUeiy0PZRQAuN9pqZVqUCyDcN7DAh/798A91eTAc4o6JUTFOrDWGny/7xd4UcH+aySWkP6BBTK44WJQzaEVfNUVJk7UY+X03UQ== jacob@fl-69-69-0-198.dhcp.embarqhsd.net";

export const ID_TOKEN_EXPIRATION = "1h";
export const REFRESH_TOKEN_EXPIRATION = "7d";

export const VALIDATE_EMAIL_PASSWORD = (
  email: string,
  password: string
): TE.TaskEither<M.JAError, U.PublicUser> =>
  pipe(
    US.findByEmail(email),
    TE.mapLeft(() =>
      M.unauthorizedError("Unauthorized")("Email or password doesn't match")
    ),
    TE.chain(user =>
      pipe(
        user,
        TE.tryCatchK(
          user => a2.verify(user.password, password, { type: a2.argon2id }),
          flow(String, M.internalError("Error verifying password hash"))
        ),
        TE.chain(
          TE.fromPredicate(identity, () =>
            M.unauthorizedError("Unauthorized")("Email or password doesn't match")
          )
        ),
        TE.map(() => user)
      )
    )
  );

export const VALIDATE_TOKEN = (token: string): TE.TaskEither<M.JAError, U.UserJWT> =>
  pipe(
    verifyJWT(token, PUBLIC_KEY),
    TE.mapLeft(flow(String, M.unauthorizedError("Unauthorized"))),
    TE.chain(
      flow(
        U.decodeUserJWT.decode,
        E.mapLeft(flow(D.draw, M.unauthorizedError("Unexpected malformed token"))),
        TE.fromEither
      )
    )
  );

export const REFRESH_ID_TOKEN = (
  user_id: string,
  refresh_token: string
): TE.TaskEither<M.JAError, Tokens> =>
  pipe(
    US.getByID(user_id),
    TE.map(({ data }) => data),
    TE.chain(user =>
      pipe(
        user.current_refresh_token,
        E.fromNullable(
          M.unauthorizedError("Unauthorized")("refresh_token does not match!")
        ),
        TE.fromEither,
        TE.map(refresh_token => ({ ...user, current_refresh_token: refresh_token }))
      )
    ),
    TE.chain(user =>
      pipe(
        user,
        TE.tryCatchK(
          ({ current_refresh_token }) => a2.verify(current_refresh_token, refresh_token),
          flow(String, M.internalError("Unable to verify refresh_token"))
        ),
        TE.chain(
          TE.fromPredicate(identity, () =>
            M.unauthorizedError("Unauthorized")("refresh_token does not match!")
          )
        ),
        TE.map(() => user)
      )
    ),
    TE.chain(user =>
      pipe(
        VALIDATE_TOKEN(refresh_token),
        TE.map(() => user)
      )
    ),
    TE.chain(user => GET_TOKENS(ID_TOKEN_EXPIRATION, REFRESH_TOKEN_EXPIRATION, user))
  );

export const GET_TOKENS = (
  idTokenExpiresIn: string,
  refreshTokenExpiresIn: string,
  { email, display_name, id }: U.PublicUser
): TE.TaskEither<M.JAError, Tokens> =>
  pipe(
    sequence(env.SIGNING_PRIVATE_KEY, env.SIGNING_PRIVATE_KEY_PASSPHRASE),
    TE.chain(([key, passphrase]) =>
      pipe(
        signJWT(
          { email, display_name },
          { key, passphrase },
          { algorithm: "ES512", expiresIn: idTokenExpiresIn, subject: id }
        ),
        TE.mapLeft(
          flow(
            String,
            M.internalError("Unable to sign id_token with private-key/passphrase!")
          )
        ),
        TE.chain(id_token =>
          pipe(
            signJWT(
              { email, display_name },
              { key, passphrase },
              { algorithm: "ES512", expiresIn: refreshTokenExpiresIn, subject: id }
            ),
            TE.bimap(
              flow(
                String,
                M.internalError(
                  "Unable to sign refresh_token with private-key/passphrase!"
                )
              ),
              refresh_token => ({ id_token, refresh_token })
            )
          )
        ),
        TE.chain(tokens =>
          pipe(
            US.updateById(id, {
              display_name,
              email,
              current_refresh_token: tokens.refresh_token
            }),
            TE.bimap(identity, () => tokens)
          )
        )
      )
    )
  );
