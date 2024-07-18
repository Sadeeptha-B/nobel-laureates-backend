import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import HttpError from "../models/http-error";
import { IUser } from "../models/user";
import { randomUUID } from "crypto";

const DUMMY_USERS = [
  {
    id: "u1",
    name: "Sadeeptha",
    email: "sadeeptha.bandara@gmail.com",
    password: "tester2",
  },
];

const signup: RequestHandler = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new HttpError(
      `${errors
        .array()
        .map((e) => e.msg)
        .join(",")}`,
      422
    );
  }

  const { name, email, password } = req.body as IUser;

  const hasUser = DUMMY_USERS.find((u) => u.email === email);
  if (hasUser) {
    throw new HttpError("User already exists", 422);
  }

  const createdUser = {
    id: randomUUID(),
    name,
    email,
    password,
  };

  DUMMY_USERS.push(createdUser);
  res.status(201).json(createdUser);
};

const login: RequestHandler = (req, res) => {
  const { email, password } = req.body as IUser;
  console.log(DUMMY_USERS);
  const knownUser = DUMMY_USERS.find((u) => u.email === email);

  // No password hashing for now
  if (!knownUser || knownUser.password !== password) {
    throw new HttpError("Either email or password is incorrect", 401);
  }

  res.json({ message: "Logged in" });
};

export { signup, login };
