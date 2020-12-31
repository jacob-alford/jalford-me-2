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
    TE.chain(({ body }) => US.create(body.processed))
  )
);

export const USER_PUT = makeRequestHandler(
  flow(
    RA.decodeBody(U.decodeUpdateUser),
    TE.chain(RA.decodeParams(D.type({ user_id: D.string }))),
    TE.chain(({ body, params }) =>
      US.updateById(params.processed.user_id, body.processed)
    )
  )
);

export const USER_DELETE = makeRequestHandler(
  flow(
    RA.decodeParams(D.type({ user_id: D.string })),
    TE.chain(({ params }) => US.deleteById(params.processed.user_id))
  )
);
