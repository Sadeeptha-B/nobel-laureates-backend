import { RequestHandler } from "express";
import HttpError from "../models/http-error";
import { handleHttpError } from "./error-handling";
import { RECAPTCHA_SECRET_KEY, TOKEN_SECRET } from "../constants";
import { verifyToken } from "../utils/jwt-helper";

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
