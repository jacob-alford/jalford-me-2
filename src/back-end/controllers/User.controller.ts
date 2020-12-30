import express from "express";
import * as H from "hyper-ts";
import { fromRequestHandler } from "hyper-ts/lib/express";
import * as D from "io-ts/lib/Decoder";
import * as E from "fp-ts/lib/Either";
import { pipe, flow } from "fp-ts/lib/function";
import { User, decodeCreateUser, decodeUpdateUser } from "models/User";
import * as US from "back-end/services/User.services";
import * as M from "utils/messages";

export const USER_POST: H.Middleware<
  H.StatusOpen,
  H.StatusOpen,
  M.JAError,
  M.JASuccess<User>
> = pipe(
  fromRequestHandler(express.json(), () => undefined),
  H.ichain(() =>
    H.decodeBody(
      flow(
        decodeCreateUser.decode,
        E.mapLeft(flow(D.draw, M.malformedInputError("Unexpected input shape")))
      )
    )
  ),
  H.ichain(flow(US.create, H.fromTaskEither))
);

export const USER_GET: H.Middleware<
  H.StatusOpen,
  H.StatusOpen,
  M.JAError,
  M.JASuccess<User>
> = pipe(
  fromRequestHandler(express.json(), req => ({
    body: req.body as unknown,
    user_id: req.params.user_id
  })),
  H.ichain(() =>
    H.decodeBody(
      D.type({
        body: decodeUpdateUser,
        user_id: D.string
      }).decode
    )
  ),
  H.mapLeft(flow(D.draw, M.malformedInputError("Unexpected input shape"))),
  H.ichain(({ body, user_id }) => pipe(US.updateById(user_id, body), H.fromTaskEither))
);
