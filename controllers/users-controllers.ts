import { NextFunction, Request, RequestHandler } from "express";
import { validationResult } from "express-validator";
import HttpError from "../models/http-error";
import { IUser, User } from "../models/user";

const DUMMY_USERS = [
  {
    id: "u1",
    name: "Sadeeptha",
    email: "sadeeptha.bandara@gmail.com",
    password: "tester2",
  },
];

const signup: RequestHandler = async (req, res, next) => {
  const { name, email, password } = req.body as IUser;

  try {
    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      throw new HttpError("User already exists", 422);
    }

    const createdUser = new User({
      name,
      email,
      password,
    });

    await createdUser.save();
    res.status(201).json(createdUser);
  } catch (err) {
    const error =
      err instanceof HttpError
        ? err
        : new HttpError("Signing up failed, please try again.", 500);
    return next(error);
  }
};

const login: RequestHandler = async (req, res, next) => {
  const { email, password } = req.body as IUser;

  try {
    const existingUser = await User.findOne({ email: email });

    if (!existingUser || existingUser.password !== password) {
      throw new HttpError("Either email or password is incorrect", 401);
    }
  } catch (err) {
    const error =
      err instanceof HttpError
        ? err
        : new HttpError("Signing up failed, please try again.", 500);
    return next(error);
  }

  res.json({ message: "Login successful" });
};

export { signup, login };
