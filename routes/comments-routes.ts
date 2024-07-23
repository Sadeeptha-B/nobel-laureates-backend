import { Router } from "express";
import * as commentsController from "../controllers/comments-controllers";
import { check } from "express-validator";
import { handleValidationErrors } from "../middleware/error-handling";
import { checkAuth } from "../middleware/auth";

const commentsRouter = Router();

// User must be authenticated to access comments routes
commentsRouter.use(checkAuth);

commentsRouter.get("/", commentsController.getCommentsByLaureateId);
commentsRouter.get("/:commentId", commentsController.getCommentById);
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
