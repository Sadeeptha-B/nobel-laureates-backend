import { Router } from "express";
import { body } from "express-validator";
import * as usersController from "../controllers/users-controllers";
import { handleValidationErrors } from "../middleware/error-handling";
import {
  checkAuth,
  executeAuthFlow,
  verifyRecaptcha,
} from "../middleware/auth";

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
  verifyRecaptcha,
  usersController.signup,
  executeAuthFlow
);

userRouter.post(
  "/login",
  loginValidationRules,
  handleValidationErrors,
  verifyRecaptcha,
  usersController.login,
  executeAuthFlow
);

userRouter.post("/logout", usersController.logout);

userRouter.get("/refreshToken", usersController.refreshAccessToken);

userRouter.get("/getAuthUser", checkAuth, usersController.getAuthUserDetails);

export default userRouter;
