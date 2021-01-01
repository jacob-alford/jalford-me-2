import { prisma } from "back-end";
import * as E from "fp-ts/lib/Either";
import * as TE from "fp-ts/lib/TaskEither";
import { flow, pipe } from "fp-ts/lib/function";
import * as M from "utils/messages";
import { CreateComment, Comment } from "models/Comment";

export const create = (user_id: string, post_id: string, comment: CreateComment) =>
  pipe(
    TE.tryCatchK(
      () =>
        prisma.comment.create({
          data: { ...comment, user: { connect: { id: user_id } }, post_id }
        }),
      flow(
        String,
        M.internalError(
          `Unable to create comment on post_id: ${post_id}, for user: ${user_id}`
        )
      )
    )(),
    TE.map(
      M.successfulCreate(
        `Successfully created comment on post: ${post_id}, for user: ${user_id}`
      )
    )
  );

export const getAllByPostId = (
  post_id: string
): TE.TaskEither<M.JAError, M.JASuccess<Array<Comment>>> =>
  pipe(
    post_id,
    TE.tryCatchK(
      post_id => prisma.comment.findMany({ where: { post_id } }),
      flow(String, M.internalError(`Error querying comments with post_id: ${post_id}`))
    ),
    TE.map(M.successfulCreate(`Successfully retrieved comments for post_id: ${post_id}`))
  );

export const getOneByCommentId = (
  comment_id: string
): TE.TaskEither<M.JAError, M.JASuccess<Comment>> =>
  pipe(
    comment_id,
    TE.tryCatchK(
      id => prisma.comment.findUnique({ where: { id } }),
      flow(
        String,
        M.internalError(`Error querying comments with comment_id: ${comment_id}`)
      )
    ),
    TE.chain(
      flow(
        E.fromNullable(
          M.notFoundError(`Unknown comment_id: ${comment_id}`)(
            `Comment with id: ${comment_id} does not exist!`
          )
        ),
        TE.fromEither
      )
    ),
    TE.map(M.successfulCreate(`Successfully retrieved comment by id: ${comment_id}`))
  );

export const deleteById = (
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
