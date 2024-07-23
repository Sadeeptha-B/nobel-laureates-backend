import { RequestHandler } from "express";
import HttpError from "../models/http-error";
import { handleHttpError } from "./error-handling";
import {
  RECAPTCHA_SECRET_KEY,
  REFRESH_TOKEN_KEY,
  TOKEN_SECRET,
} from "../constants";
import { generateTokens, verifyToken } from "../utils/jwt-helper";
import { UserData } from "../models/jwt-encoding";

export const cookieSettings = {
  httpOnly: true,
  secure: true,
  path: "/", // If the frontend is hosted in the same domain
};

export const checkAuth: RequestHandler = (req, res, next) => {
  // Allow options request through
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new HttpError("Authentication failed", 401);
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      throw new HttpError("Token is not encoded in Authorization Header", 401);
    }

    verifyToken(token, (err, data) => {
      if (err) throw new HttpError("Access Token expired", 403);
      // extracting user id to response object
      res.locals.userId = data.userId;

      // Authentication successful. Continue
      next();
    });
  } catch (err) {
    return handleHttpError(err, next, "Server error during authentication");
  }
};

export const verifyRecaptcha: RequestHandler = async (req, res, next) => {
  const { captchaToken } = req.body;

  try {
    const verifyResponse = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET_KEY}&response=${captchaToken}`,
      { method: "POST" }
    );
    const data = await verifyResponse.json();

    if (!data.success) {
      throw new HttpError("Error verifying recaptcha", 401);
    }

    // reCaptcha verification successful. Continue
    next();
  } catch (err) {
    return handleHttpError(err, next, "Server error when verifying reCAPTCHA");
  }
};

export const executeAuthFlow: RequestHandler = async (req, res, next) => {
  try {
    const { userId, email, creation } = res.locals.userData;

    const [accessToken, refreshToken] = generateTokens({
      userId,
      email,
    } as UserData);

    res.cookie(REFRESH_TOKEN_KEY, refreshToken, cookieSettings);
    const status = creation ? 201 : 200;

    // Auth flow successful. Return response
    res.status(status).json({
      userId,
      email,
      token: accessToken,
    });
  } catch (error) {
    handleHttpError(error, next, "Server error during auth flow");
  }
};
