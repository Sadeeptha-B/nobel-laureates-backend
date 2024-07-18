import { Router } from "express";
import * as commentsController from "../controllers/comments-controllers";
import { check } from "express-validator";
import { handleValidationErrors } from "../middleware/error-handling";

const commentsRouter = Router();

commentsRouter.get("/:commentId", commentsController.getCommentById);
commentsRouter.get("/laureate/:laureateId", commentsController.getCommentsByLaureateId);
commentsRouter.post(
  "/",
  [
    check("content")
      .not()
      .isEmpty()
      .withMessage("Comment content cannot be empty"),
  ],
  handleValidationErrors,
  commentsController.postComment
);

export default commentsRouter;
