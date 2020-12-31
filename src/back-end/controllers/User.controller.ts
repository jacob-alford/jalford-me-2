import * as TE from "fp-ts/lib/TaskEither";
import { flow } from "fp-ts/lib/function";
import * as U from "models/User";
import * as US from "back-end/services/User.services";
import { makeRequestHandler } from "utils/makeRequestHandler";
import { decodeBody } from "utils/ReqArgs";

export const USER_POST = makeRequestHandler(
  flow(
    decodeBody(U.decodeCreateUser),
    TE.chain(({ body }) => US.create(body.processed))
  )
);
