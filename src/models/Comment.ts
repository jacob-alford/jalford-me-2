import * as D from "io-ts/lib/Decoder";
import { Comment as _Comment } from "back-end/prisma-client";

export type Comment = _Comment;

export const decodeComment: D.Decoder<unknown, Comment> = D.type({
  id: D.string,
  body: D.string,
  user_id: D.string,
  post_id: D.string,
  parent_id: D.nullable(D.string)
});

export interface CreateComment {
  body: string;
  user_id: string;
}

export const decodeCreateComment: D.Decoder<unknown, CreateComment> = D.type({
  body: D.string,
  user_id: D.string
});
