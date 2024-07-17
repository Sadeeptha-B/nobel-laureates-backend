import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import HttpError from "../models/http-error";
import { User } from "../models/user";
import { randomUUID } from "crypto";

const DUMMY_USERS = [
  {
    id: "u1",
    name: "Sadeeptha",
    email: "sadeeptha.bandara@gmail.com",
    password: "test",
  },
];

export const signup: RequestHandler = (req, res, next) => {
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

  const { name, email, password } = req.body as User;

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

export const login: RequestHandler = (req, res, next) => {};
