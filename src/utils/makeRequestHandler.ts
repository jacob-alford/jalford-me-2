import { Request, Response, NextFunction } from "express";
import * as TE from "fp-ts/lib/TaskEither";
import * as E from "fp-ts/lib/Either";
import { BHPT } from "utils/BHPT";
import * as M from "utils/messages";
import * as Kn from "utils/knowledge";

export type BHPTKn = BHPT<Kn.Unknown, Kn.Unknown, Kn.Unknown, Kn.Unknown>;

export const makeRequestHandler = <A>(
  handler: (bhptkn: BHPTKn) => TE.TaskEither<M.JAError, M.JASuccess<A>>
) => async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const bhptkn: BHPTKn = {
    body: Kn.unknown(req.body),
    headers: Kn.unknown(req.headers),
    params: Kn.unknown(req.params),
    token: Kn.unknown({})
  };
  const result = await handler(bhptkn)();
  if (E.isLeft(result)) {
    next(result.left);
    return;
  }
  res.status(result.right.status_number);
  res.send(result.right);
};
