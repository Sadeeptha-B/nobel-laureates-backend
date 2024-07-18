import { RequestHandler } from "express";
import HttpError from "../models/http-error";
import { handleHttpError } from "./error-handling";
import * as jwt from "jsonwebtoken";

const validateAuth: RequestHandler = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new HttpError("Authentication failed", 401);
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      throw new HttpError("Token is not encoded in Authorization Header", 401);
    }

    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET as string);
    // req.user = {userId: decodedToken.userId}

    // Authentication successful. Continue
    next();
  } catch (err) {
    return handleHttpError(err, next, "Server error during authentication");
  }
};

export default validateAuth;
