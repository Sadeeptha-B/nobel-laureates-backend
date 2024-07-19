import { RequestHandler } from "express";
import HttpError from "../models/http-error";
import { handleHttpError } from "./error-handling";
import * as jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../constants";
import { verifyToken } from "../utils/jwt-helper";

const validateAuth: RequestHandler = (req, res, next) => {
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

    const decodedToken = verifyToken(token, (err, data) => {
      if (err) throw new HttpError("Verification failed", 403);
      // req.user = user;
      next();
    });

    // Authentication successful. Continue
    next();
  } catch (err) {
    return handleHttpError(err, next, "Server error during authentication");
  }
};

export default validateAuth;
