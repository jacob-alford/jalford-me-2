import express from "express";
import * as bodyParser from "body-parser";
import { PrismaClient } from "@prisma/client";
import { router } from "back-end/router";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import * as H from "back-end/handlers";

export const prisma = new PrismaClient();

export const app = express()
  .use(bodyParser.urlencoded({ extended: false }))
  .use(bodyParser.json())
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
  .use("*", H.notFoundHandler())
  .use(H.errorHandler());

app.listen(8080, () => console.log("App listening on port 3000"));
