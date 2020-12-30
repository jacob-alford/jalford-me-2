import * as D from "io-ts/lib/Decoder";
import { pipe } from "fp-ts/lib/function";
import { decodeCreateUser } from "models/User";
import * as US from "back-end/services/User.services";
import * as BHP from "utils/bhp";

export const USER_GET = pipe(
  BHP.liftResponseP(({ user_id }) => US.getByID(user_id), D.type({ user_id: D.string })),
  BHP.toRequestHandler
);

export const USER_POST = pipe(
  BHP.liftResponseB(US.create, decodeCreateUser),
  BHP.toRequestHandler
);
