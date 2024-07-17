import HttpError from "../models/http-error";
import { Comment } from "./../models/comments";
import { RequestHandler } from "express";

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

  const comment = DUMMY_COMMENTS.find(p => p.id == commentId);

  if (!comment){
    throw new HttpError(`Comment with ${commentId} does not exist`, 404)
  }

  res.json({comment})
};


export {getCommentById}
