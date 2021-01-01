import express from "express";
import { PrismaClient } from "@prisma/client";
import { router } from "back-end/router";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

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
  .use(router);
