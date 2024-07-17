import { Router } from "express";
import * as commentsController from '../controllers/comments-controllers';

const commentsRouter = Router()

commentsRouter.get('/:commentId', commentsController.getCommentById)


export default commentsRouter;
