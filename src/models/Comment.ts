import { Comment as _Comment } from "@prisma/client";
import * as D from "io-ts/lib/Decoder";

export type Comment = _Comment;

export const decodeComment: D.Decoder<unknown, Comment> = D.type({
  id: D.string,
  body: D.string,
  user_id: D.string,
  post_id: D.string
});

export interface CreateComment {
  body: string;
}

export const decodeCreateComment: D.Decoder<unknown, CreateComment> = D.type({
  body: D.string
});
