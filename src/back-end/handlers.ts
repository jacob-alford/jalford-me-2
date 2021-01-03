import { Request, Response, NextFunction } from "express";
import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import * as M from "utils/messages";

export const loggerMiddleware = () => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = new Date();
  res.on("close", () => {
    console.info(`\n\n########### Incoming Request ###########\n
  Timestamp: ${start.toISOString()}
  Method: ${req.method}
  Path: ${req.originalUrl}
  Headers: ${JSON.stringify(req.headers)}
  Body: ${JSON.stringify(req.body)}
\n############### Response ################\n
  Status: ${res.statusCode}
  Message: ${res.statusMessage}
  Duration (ms): ${new Date().getTime() - start.getTime()}
\n#########################################\n\n`);
  });
  next();
};

export const errorHandler = () => (
  err: unknown,
  _: Request,
  res: Response,
  __: NextFunction
) =>
  pipe(
    err,
    M.decodeJAError.decode,
    E.fold(
      () => {
        console.log(err);
        res.status(500);
        res.json(M.internalError("Internal Error")(String(err)));
      },
      error => {
        res.status(error.status_number);
        res.json(error);
      }
    )
  );

export const healthHandler = () => (_: Request, res: Response, __: NextFunction) => {
  res.status(200);
  res.json(M.generalSuccess("API Server is healthy")(undefined));
};

export const notFoundHandler = () => (req: Request, __: Response, next: NextFunction) =>
  next(M.notFoundError("Not Found")(`Path not found: ${req.originalUrl}`));
