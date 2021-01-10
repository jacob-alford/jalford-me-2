import * as O from "fp-ts/lib/Option";
import * as L from "monocle-ts/lib/Lens";
import * as A from "fp-ts/lib/Array";
import * as D from "io-ts/lib/Decoder";
import * as LS from "fp-ts-local-storage";
import { sequenceT } from "fp-ts/lib/Apply";
import cuid from "cuid";
import { pipe } from "fp-ts/lib/function";
import { LS_JA_ID_TOKEN, LS_JA_REFRESH_TOKEN } from "CONSTANTS";

const sequence = sequenceT(O.option);

export interface Action<T, P> {
  type: T;
  payload: P;
}

export interface User {
  display_name: string;
  email: string;
  id: string;
}
export const decodeUser: D.Decoder<unknown, User> = D.type({
  display_name: D.string,
  email: D.string,
  id: D.string
});
const userLens = (user: O.Option<User>) =>
  pipe(
    L.id<Store>(),
    L.prop("user"),
    L.modify(() => user)
  );
export const SET_USER = "SET_USER";
export type SetUser = Action<typeof SET_USER, User>;
export const setUser = (user: User) => ({ type: SET_USER, payload: user });

export interface Auth {
  id_token: string;
  refresh_token: string;
}
const authLens = (auth: O.Option<Auth>) =>
  pipe(
    L.id<Store>(),
    L.prop("auth"),
    L.modify(() => auth)
  );
export const SET_AUTH = "SET_AUTH";
export type SetAuth = Action<typeof SET_AUTH, Auth>;
export const setAuth = (auth: Auth) => ({ type: SET_USER, payload: auth });
const getInitialTokens = (): O.Option<Auth> =>
  pipe(
    sequence(LS.getItem(LS_JA_ID_TOKEN)(), LS.getItem(LS_JA_REFRESH_TOKEN)()),
    O.map(([id_token, refresh_token]) => ({
      id_token,
      refresh_token
    }))
  );

export const UPDATE_LOCAL_STORE = "UPDATE_LOCAL_STORE";
export type UpdateLocalStore = Action<typeof UPDATE_LOCAL_STORE, string>;
export const updateLocalStorage = (location: string): UpdateLocalStore => ({
  type: UPDATE_LOCAL_STORE,
  payload: location
});

export type Severity = "error" | "info" | "success" | "warning";

export interface Notification {
  uid: string;
  body: string;
  severity: Severity;
  timeout: number;
}

const addNotificationLens = (n: Notification) =>
  pipe(
    L.id<Store>(),
    L.prop("notifications"),
    L.modify(ns => pipe(ns, A.cons(n)))
  );
export const ADD_NOTIFICATION = "ADD_NOTIFICATION";
export type AddNotification = Action<typeof ADD_NOTIFICATION, Notification>;
export const addNotification = (
  severity: Severity,
  body: string,
  timeout: number = 6500
): AddNotification => ({
  type: ADD_NOTIFICATION,
  payload: {
    uid: cuid(),
    severity,
    body,
    timeout
  }
});

const removeNotificationLens = (uid: string) =>
  pipe(
    L.id<Store>(),
    L.prop("notifications"),
    L.modify(ns =>
      pipe(
        ns,
        A.filter(n => n.uid !== uid)
      )
    )
  );
export const REMOVE_NOTIFICATION = "REMOVE_NOTIFICATION";
export type RemoveNotification = Action<typeof REMOVE_NOTIFICATION, string>;
export const removeNotification = (uid: string): RemoveNotification => ({
  type: REMOVE_NOTIFICATION,
  payload: uid
});

export type Actions =
  | UpdateLocalStore
  | AddNotification
  | RemoveNotification
  | SetAuth
  | SetUser
  | { type: "@@INIT" };

export interface Store {
  user: O.Option<User>;
  auth: O.Option<Auth>;
  notifications: Array<Notification>;
}

const initialStore: Store = {
  user: O.none,
  auth: getInitialTokens(),
  notifications: []
};

export const reducer = (g: Store | undefined = initialStore, a: Actions): Store => {
  switch (a.type) {
    case SET_USER:
      return userLens(O.some(a.payload))(g);
    case SET_AUTH:
      return authLens(O.some(a.payload))(g);
    case ADD_NOTIFICATION:
      return addNotificationLens(a.payload)(g);
    case REMOVE_NOTIFICATION:
      return removeNotificationLens(a.payload)(g);
    default:
      return g;
  }
};
