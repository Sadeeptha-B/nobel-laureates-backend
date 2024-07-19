import { REFRESH_TOKEN_KEY, TOKEN_SECRET } from "./../constants";
import { RequestHandler } from "express";
import bcrypt from "bcryptjs";
import HttpError from "../models/http-error";
import { IUser, User } from "../models/user";
import { handleHttpError } from "../middleware/error-handling";
import {
  generateAccessToken,
  generateTokens,
  verifyToken,
} from "../utils/jwt-helper";
import { UserData } from "../models/jwt-encoding";

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

    const [accessToken, refreshToken] = generateTokens({
      userId: createdUser.id,
      email: createdUser.email,
    } as UserData);

    res.cookie(REFRESH_TOKEN_KEY, refreshToken, {
      httpOnly: true,
      secure: true,
      path: "/", // If the frontend is hosted in the same domain
    });

    res.status(201).json({
      userId: createdUser.id,
      email: createdUser.email,
      token: accessToken,
    });
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

    const [accessToken, refreshToken] = generateTokens({
      userId: existingUser.id,
      email: existingUser.email,
    } as UserData);

    res.cookie(REFRESH_TOKEN_KEY, refreshToken, {
      httpOnly: true,
      secure: true,
      path: "/", // If the frontend is hosted in the same domain
    });

    res.status(200).json({
      userId: existingUser.id,
      email: existingUser.email,
      token: accessToken,
    });
  } catch (err) {
    return handleHttpError(err, next, "Login failed. Please try again later");
  }
};

const refreshAccessToken: RequestHandler = async (req, res, next) => {
  const { refreshToken } = req.cookies;

  try {
    if (!refreshToken) {
      throw new HttpError("Verification Error", 403);
    }

    verifyToken(refreshToken, (err, data) => {
      if (err) throw new HttpError("Verification failed", 403);
      const accessToken = generateAccessToken(data as UserData);
      res
        .status(200)
        .json({ userId: data.userId, email: data.email, token: accessToken });
    });
  } catch (error) {
    return handleHttpError(
      error,
      next,
      "Server Error. Token refresh unsuccessful"
    );
  }
};

export { signup, login, refreshAccessToken };
