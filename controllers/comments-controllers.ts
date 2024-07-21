import { validationResult } from "express-validator";
import HttpError from "../models/http-error";
import { Comment, IComment } from "../models/comment";
import { RequestHandler } from "express";
import { handleHttpError } from "../middleware/error-handling";
import { User } from "../models/user";

const getCommentById: RequestHandler = async (req, res, next) => {
  const commentId = req.params.commentId;

  try {
    const comment = await Comment.findById(commentId);

    if (!comment) {
      throw new HttpError(`Comment with ${commentId} does not exist`, 404);
    }
    res.json({ comment: comment.toObject({ getters: true }) });
  } catch (err) {
    handleHttpError(err, next, "Unknown error. Could not find comment");
  }
};

const getCommentsByLaureateId: RequestHandler = async (req, res, next) => {
  const laureateId = req.params.laureateId;

  try {
    const comments = await Comment.find({ laureateId: laureateId });

    if (!comments) {
      throw new HttpError("Could not find comments", 404);
    }

    res.status(200).json({
      comments: comments.map((comment) => comment.toObject({ getters: true })),
    });
  } catch (err) {
    handleHttpError(err, next, "Unknown error. Could not find comment");
  }
};

const postComment: RequestHandler = async (req, res, next) => {
  // Userid is set in res.local by checkAuth middleware
  const {userId} = res.locals
  const { laureateId, content } = req.body as IComment;

  try {
    const user = await User.findById(userId);
    console.log(user)

    if (!user) {
      throw new HttpError(
        `User with ${userId} cannot be found. Unable to create comment`,
        404
      );
    }

    const newComment = new Comment({
      userId,
      username: user.name,
      laureateId,
      content,
    });

    await newComment.save();
    res.status(201).json(newComment.toObject({ getters: true }));
  } catch (err) {
    return handleHttpError(
      err,
      next,
      "Unable to create comment. Please try again"
    );
  }
};

export { getCommentById, postComment, getCommentsByLaureateId };
