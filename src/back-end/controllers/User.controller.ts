import * as TE from "fp-ts/lib/TaskEither";
import * as D from "io-ts/lib/Decoder";
import { flow } from "fp-ts/lib/function";
import * as U from "models/User";
import * as US from "back-end/services/User.services";
import { makeRequestHandler } from "utils/makeRequestHandler";
import * as RA from "utils/ReqArgs";

export const USER_POST = makeRequestHandler(
  flow(
    RA.decodeBody(U.decodeCreateUser),
    TE.chain(({ body }) => US.create(body.value))
  )
);

export const USER_PUT = makeRequestHandler(
  flow(
    RA.decodeAuthHeaders,
    TE.chain(RA.decodeJWT),
    TE.chain(RA.decodeParams(D.type({ user_id: D.string }))),
    TE.chain(RA.decodeBody(U.decodeUpdateUser)),
    TE.chain(
      RA.authorizeToken(({ token, params }) => [
        token.value.user_id === params.value.user_id,
        "user_id found in token does not match that of request!"
      ])
    ),
    TE.chain(({ body, params }) => US.updateById(params.value.user_id, body.value))
  )
);

export const USER_DELETE = makeRequestHandler(
  flow(
    RA.decodeAuthHeaders,
    TE.chain(RA.decodeJWT),
    TE.chain(RA.decodeParams(D.type({ user_id: D.string }))),
    TE.chain(
      RA.authorizeToken(({ token, params }) => [
        token.value.user_id === params.value.user_id,
        "user_id found in token does not match that of request!"
      ])
    ),
    TE.chain(({ params }) => US.deleteById(params.value.user_id))
  )
);
