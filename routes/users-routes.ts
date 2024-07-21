import { Router } from "express";
import { body, check } from "express-validator";
import * as usersController from "../controllers/users-controllers";
import { handleValidationErrors } from "../middleware/error-handling";
import checkAuth from "../middleware/check-auth";

const userRouter = Router();

const signupValidationRules = [
  body("name").not().isEmpty().withMessage("Field: name is required"),
  body("email")
    .normalizeEmail()
    .isEmail()
    .withMessage("Field: email format is incorrect/ not provided"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Field: password must have at least 6 characters"),
];

const loginValidationRules = [
  body("email")
    .normalizeEmail()
    .isEmail()
    .withMessage("Email is invalid/ not provided"),
  body("password").not().isEmpty().withMessage("Password is required"),
];

userRouter.post(
  "/signup",
  signupValidationRules,
  handleValidationErrors,
  usersController.signup
);

userRouter.post(
  "/login",
  loginValidationRules,
  handleValidationErrors,
  usersController.login
);

userRouter.get("/refreshToken", usersController.refreshAccessToken);

userRouter.get("/getAuthUser", checkAuth, usersController.getAuthUser);

export default userRouter;
