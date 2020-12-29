import { prisma } from "back-end";
import * as TE from "fp-ts/lib/TaskEither";
import * as E from "fp-ts/lib/Either";
import * as NA from "fp-ts/lib/NonEmptyArray";
import { flow, pipe } from "fp-ts/lib/function";
import * as M from "utils/messages";
import { CreateComment, Comment } from "models/Comment";

export const CREATE = (user_id: string, post_id: string, comment: CreateComment) =>
  pipe(
    TE.tryCatchK(
      () =>
        prisma.comment.create({
          data: { ...comment, user: { connect: { id: user_id } }, post_id }
        }),
      flow(String, M.internalError("Unable to "))
    )(),
    TE.map(
      M.successfulCreate(
        `Successfully created comment on post: ${post_id}, for user: ${user_id}`
      )
    )
  );

export const READ = (
  post_id: string
): TE.TaskEither<M.JAError, M.JASuccess<NA.NonEmptyArray<Comment>>> =>
  pipe(
    post_id,
    TE.tryCatchK(
      post_id => prisma.comment.findMany({ where: { post_id } }),
      flow(String, M.internalError(`Error querying comments with post_id: ${post_id}`))
    ),
    TE.chain(
      flow(
        NA.fromArray,
        TE.fromOption(() =>
          pipe(
            `Unknown comment with post_id: ${post_id}`,
            M.malformedInputError(`There are no comments with post_id: ${post_id}!`)
          )
        )
      )
    ),
    TE.map(M.successfulCreate(`Successfully retrieved comments for post_id: ${post_id}`))
  );

export const DELETE = (
  comment_id: string
): TE.TaskEither<M.JAError, M.JASuccess<Comment>> =>
  pipe(
    comment_id,
    TE.tryCatchK(
      id => prisma.comment.delete({ where: { id } }),
      flow(String, M.malformedInputError(`Unable to find comment with id: ${comment_id}`))
    ),
    TE.map(M.successfulDelete(`Successfully deleted comment with id: ${comment_id}`))
  );
