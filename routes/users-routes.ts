import express from "express";
import { body, check } from "express-validator";
import * as usersController from "../controllers/users-controllers";

const userRouter = express.Router();

const signupValidationRules = [
  body("name").not().isEmpty().withMessage("Field: name is required"),
  body("email")
    .normalizeEmail()
    .isEmail()
    .withMessage("Field: email format is incorrect"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Field: password must have at least 6 characters"),
];

userRouter.post("/signup", signupValidationRules, usersController.signup);

userRouter.post("/login", usersController.login);

export default userRouter;
