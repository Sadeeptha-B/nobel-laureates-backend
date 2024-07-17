import express from "express";
import check from "express-validator";
import * as usersController from '../controllers/users-controllers'

const userRouter = express.Router();

userRouter.post('/signup', usersController.signup);

export default userRouter;
