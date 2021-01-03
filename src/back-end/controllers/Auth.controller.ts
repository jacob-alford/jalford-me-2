import * as TE from "fp-ts/lib/TaskEither";
import { flow } from "fp-ts/lib/function";
import * as D from "io-ts/lib/Decoder";
import { makeRequestHandler } from "utils/makeRequestHandler";
import * as RA from "utils/ReqArgs";
import * as AS from "back-end/services/Auth.services";
import * as M from "utils/messages";

export const AUTH_LOGIN_POST = makeRequestHandler(
  flow(
    RA.decodeEmailPasswordBody,
    TE.chain(({ body }) =>
      AS.VALIDATE_EMAIL_PASSWORD(body.value.email, body.value.password)
    ),
    TE.chain(user =>
      AS.GET_TOKENS(AS.ID_TOKEN_EXPIRATION, AS.REFRESH_TOKEN_EXPIRATION, user)
    ),
    TE.map(M.generalSuccess("Successfully logged in"))
  )
);

export const AUTH_REFRESH_TOKEN_POST = makeRequestHandler(
  flow(
    RA.decodeBody(D.type({ refresh_token: D.string })),
    TE.chain(RA.decodeParams(D.type({ user_id: D.string }))),
    TE.chain(({ params, body }) =>
      AS.REFRESH_ID_TOKEN(params.value.user_id, body.value.refresh_token)
    ),
    TE.map(M.generalSuccess("Successfully refreshed user tokens with refresh_token"))
  )
);
