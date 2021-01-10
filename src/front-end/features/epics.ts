import { of } from "rxjs";
import * as Rx from "rxjs/operators";
import { Epic } from "redux-observable";
import { pipe, flow } from "fp-ts/lib/function";
import * as D from "io-ts/lib/Decoder";
import * as E from "fp-ts/lib/Either";
import * as LS from "fp-ts-local-storage";
import {
  SetAuth,
  SET_AUTH,
  Actions,
  updateLocalStorage,
  decodeUser,
  setUser,
  addNotification
} from "front-end/features/store";
import { LS_JA_ID_TOKEN, LS_JA_REFRESH_TOKEN } from "CONSTANTS";
import * as jwt from "jsonwebtoken";

const addIdToken = (idToken: string) => LS.setItem(LS_JA_ID_TOKEN, idToken);

const addRefreshToken = (idToken: string) => LS.setItem(LS_JA_REFRESH_TOKEN, idToken);

export const UpdateIdAndRefreshTokens: Epic<Actions> = a$ =>
  a$.pipe(
    Rx.filter((a): a is SetAuth => a.type === SET_AUTH),
    Rx.tap(({ payload }) => {
      addIdToken(payload.id_token);
      addRefreshToken(payload.refresh_token);
    }),
    Rx.mapTo(updateLocalStorage(`${LS_JA_ID_TOKEN} & ${LS_JA_REFRESH_TOKEN}`))
  );

export const UdateUserDocWithTokens: Epic = a$ =>
  a$.pipe(
    Rx.filter((a): a is SetAuth => a.type === SET_AUTH),
    Rx.switchMap(({ payload: { id_token } }) =>
      pipe(
        jwt.decode(id_token),
        E.fromNullable("Unable to decode user token!"),
        E.chain(flow(decodeUser.decode, E.mapLeft(D.draw))),
        E.mapLeft(err => {
          console.error(err);
          return err;
        }),
        E.fold(
          err => of(addNotification("error", err)),
          user => of(setUser(user), addNotification("success", "Successfully signed in!"))
        )
      )
    )
  );
