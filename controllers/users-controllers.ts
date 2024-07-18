import { RequestHandler } from "express";
import bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import HttpError from "../models/http-error";
import { IUser, User } from "../models/user";
import { handleHttpError } from "../middleware/error-handling";
import { randomBytes } from "crypto";

const signup: RequestHandler = async (req, res, next) => {
  const { name, email, password } = req.body as IUser;

  try {
    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      throw new HttpError("User already exists", 422);
    }

    // Hashing password
    const hashedPassword = await bcrypt.hash(password, 12);

    const createdUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await createdUser.save();
    const token = generateJWT(createdUser.id, createdUser.email);

    res
      .status(201)
      .json({ userId: createdUser.id, email: createdUser.email, token: token });
  } catch (err) {
    return handleHttpError(err, next, "Sign up failed. Please try again");
  }
};

const login: RequestHandler = async (req, res, next) => {
  const { email, password } = req.body as IUser;

  try {
    const existingUser = await User.findOne({ email: email });

    if (!existingUser) {
      throw new HttpError("Unknown user email", 401);
    }

    const match = await bcrypt.compare(password, existingUser.password);
    if (!match) {
      throw new HttpError("Invalid password", 401);
    }

    const token = generateJWT(existingUser.id, existingUser.email);
    res.json({
      userId: existingUser.id,
      email: existingUser.email,
      token: token,
    });
  } catch (err) {
    return handleHttpError(err, next, "Login failed. Please try again later");
  }
};

const generateJWT = (userId: string, email: string) => {
  return jwt.sign(
    {
      userId,
      email,
    },
    process.env.TOKEN_SECRET as string,
    { expiresIn: "1800s" }
  );
};

export { signup, login };
