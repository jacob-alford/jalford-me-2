import express from "express";
import * as UC from "back-end/controllers/User.controller";
import * as CC from "back-end/controllers/Comment.controller";

export const router = express
  .Router()
  /*
   * User Routes
   */
  .post("/user", UC.USER_POST)
  .put("/user/:user_id", UC.USER_PUT)
  .delete("/user/:user_id", UC.USER_DELETE)
  /*
   * Comment Routes
   */
  .post("/posts/:post_id/comments", CC.COMMENT_POST)
  .get("/post/:post_id/comments", CC.COMMENT_GET)
  .delete("/posts/:post_id/comments/:comment_id", CC.COMMENT_DELETE);
