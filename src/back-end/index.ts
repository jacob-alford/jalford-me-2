import express from "express";
import { PrismaClient } from "@prisma/client";
import { router } from "back-end/router";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import * as H from "back-end/handlers";

export const prisma = new PrismaClient();

export const app = express()
  .use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100
    })
  )
  .use(helmet())
  .use(cors())
  .use(H.loggerMiddleware())
  .use("/health", H.healthHandler())
  .use(router)
  .use(H.errorHandler());

app.listen(3000, () => console.log("App listening on port 3000"));
