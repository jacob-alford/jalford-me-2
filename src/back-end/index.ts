import express from "express";
import * as H from "hyper-ts";
import { failure } from "io-ts/lib/PathReporter";
import { fromRequestHandler, toRequestHandler } from "hyper-ts/lib/express";
import * as D from "io-ts/lib/Decoder";
import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/pipeable";
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

const app = express();
