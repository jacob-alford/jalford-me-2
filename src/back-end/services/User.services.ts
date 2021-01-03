import * as TE from "fp-ts/lib/TaskEither";
import * as T from "fp-ts/lib/Task";
import * as E from "fp-ts/lib/Either";
import { flow, pipe } from "fp-ts/lib/function";
import * as a2 from "argon2";
import { prisma } from "back-end";
import * as M from "utils/messages";
import { CreateUser, UpdateUser, User } from "models/User";

export const create = (user: CreateUser): TE.TaskEither<M.JAError, M.JASuccess<User>> =>
  pipe(
    user,
    TE.tryCatchK(
      user => a2.hash(user.password, { type: a2.argon2id }),
      flow(String, M.internalError("Unable to hash user password!"))
    ),
    TE.chain(
      TE.tryCatchK(
        password => prisma.user.create({ data: { ...user, password } }),
        flow(String, M.internalError(`Unable to create user with email: ${user.email}`))
      )
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

export const findByEmail = (email: string): TE.TaskEither<M.JAError, User> =>
  pipe(
    T.fromTask(() => prisma.user.findFirst({ where: { email } })),
    TE.fromTask,
    TE.chain(
      flow(
        E.fromNullable(
          M.unauthorizedError(`Not Found`)(`User with email: ${email} was not found!`)
        ),
        TE.fromEither
      )
    )
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
