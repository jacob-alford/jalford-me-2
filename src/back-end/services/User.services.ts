import * as TE from "fp-ts/lib/TaskEither";
import * as E from "fp-ts/lib/Either";
import { flow, pipe } from "fp-ts/lib/function";
import { prisma } from "back-end";
import * as M from "utils/messages";
import { CreateUser, UpdateUser, User } from "models/User";

export const create = (user: CreateUser): TE.TaskEither<M.JAError, M.JASuccess<User>> =>
  pipe(
    user,
    TE.tryCatchK(
      data => prisma.user.create({ data }),
      flow(String, M.internalError(`Successfully created user with email: ${user.email}`))
    ),
    TE.map(M.successfulCreate(`Successfully created user with email: ${user.email}`))
  );

export const getByID = (user_id: string): TE.TaskEither<M.JAError, M.JASuccess<User>> =>
  pipe(
    user_id,
    TE.tryCatchK(
      id => prisma.user.findUnique({ where: { id } }),
      flow(String, M.internalError(`Unable to find user by id: ${user_id}`))
    ),
    TE.chain(
      flow(
        E.fromNullable(
          pipe(
            `Unknown user_id: ${user_id}`,
            M.notFoundError(`User with id: ${user_id} does not exist!`)
          )
        ),
        TE.fromEither
      )
    ),
    TE.map(M.successfulRead(`Successfully retrieved user with id: ${user_id}`))
  );

export const updateById = (
  user_id: string,
  data: UpdateUser
): TE.TaskEither<M.JAError, M.JASuccess<User>> =>
  pipe(
    user_id,
    TE.tryCatchK(
      id => prisma.user.update({ where: { id }, data }),
      flow(String, M.malformedInputError(`Unable to find user with id: ${user_id}`))
    ),
    TE.map(M.successfulUpdate(`Successfully updated user with id: ${user_id}`))
  );

export const deleteById = (
  user_id: string
): TE.TaskEither<M.JAError, M.JASuccess<User>> =>
  pipe(
    user_id,
    TE.tryCatchK(
      id => prisma.user.delete({ where: { id } }),
      flow(String, M.malformedInputError(`Unable to find user with id: ${user_id}`))
    ),
    TE.map(M.successfulDelete(`Successfully deleted user with id: ${user_id}`))
  );
