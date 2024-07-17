import { Router } from "express";
import * as commentsController from "../controllers/comments-controllers";
import { check } from "express-validator";

const commentsRouter = Router();

commentsRouter.get("/:commentId", commentsController.getCommentById);
commentsRouter.get("/:laureateId", commentsController.getCommentsByLaureateId);
commentsRouter.post("/", [
  check("content")
    .not()
    .isEmpty()
    .withMessage("Comment content cannot be empty"),
], commentsController.postComment);

export default commentsRouter;
