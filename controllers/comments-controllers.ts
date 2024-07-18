import { validationResult } from "express-validator";
import HttpError from "../models/http-error";
import { IComment } from "../models/comment";
import { RequestHandler } from "express";
import { randomUUID } from "crypto";

const DUMMY_COMMENTS = [
  {
    id: "c1",
    userId: "u1",
    laureateId: "1",
    content: "Rontgen is great",
    timePosted: "dateString",
  },
];

const getCommentById: RequestHandler = (req, res) => {
  const commentId = req.params.commentId;

  const comment = DUMMY_COMMENTS.find((c) => c.id == commentId);

  if (!comment) {
    throw new HttpError(`Comment with ${commentId} does not exist`, 404);
  }

  res.json({ comment });
};

const getCommentsByLaureateId: RequestHandler = (req, res) => {
  const laureateId = req.params.laureateId;

  const comments = DUMMY_COMMENTS.filter((c) => c.laureateId == laureateId);
  res.json({ comments: [] });
};

const postComment: RequestHandler = (req, res, next) => {
  // TODO: DRY with usercontroller. make util. However wait till db is integrated
  // Note that if the code is async, error handling should happen with the next function
  const errors = validationResult(req);

  if (!errors.isEmpty) {
    throw new HttpError(
      `${errors
        .array()
        .map((e) => e.msg)
        .join(",")}`,
      422
    );
  }

  const {
    userId,
    laureateId,
    content,
    createdAt: timePosted,
  } = req.body as IComment;

  const newComment = {
    id: randomUUID(),
    userId,
    laureateId,
    content,
    timePosted,
  };

  DUMMY_COMMENTS.push(newComment);
  res.status(201).json({ comment: newComment });
};

export { getCommentById, postComment, getCommentsByLaureateId };
