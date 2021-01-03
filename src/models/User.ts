import { User as _User } from "@prisma/client";
import * as D from "io-ts/lib/Decoder";

export type User = _User;

export const decodeUser: D.Decoder<unknown, User> = D.type({
  id: D.string,
  email: D.string,
  password: D.string,
  display_name: D.string,
  current_refresh_token: D.nullable(D.string)
});

export interface PublicUser {
  id: string;
  email: string;
  display_name: string;
}

export const decodePublicUser: D.Decoder<unknown, PublicUser> = D.type({
  id: D.string,
  email: D.string,
  display_name: D.string
});

export interface CreateUser {
  email: string;
  password: string;
  display_name: string;
}

export const decodeCreateUser: D.Decoder<unknown, CreateUser> = D.type({
  email: D.string,
  password: D.string,
  display_name: D.string
});

export interface UpdateUser {
  email: string;
  display_name: string;
  current_refresh_token: string | null;
}

export const decodeUpdateUser: D.Decoder<unknown, UpdateUser> = D.type({
  email: D.string,
  display_name: D.string,
  current_refresh_token: D.nullable(D.string)
});

export interface UserJWT {
  email: string;
  sub: string;
  display_name: string;
}

export const decodeUserJWT: D.Decoder<unknown, UserJWT> = D.type({
  email: D.string,
  sub: D.string,
  display_name: D.string
});
