import { validationResult } from "express-validator";
import HttpError from "../models/http-error";
import { NextFunction, RequestHandler } from "express";

const handleValidationErrors: RequestHandler = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new HttpError(
      `${errors
        .array()
        .map((e) => e.msg)
        .join(",")}`,
      422
    );
    return next(error);
  }

  return next();
};

const handleHttpError = (err: any, next: NextFunction, errMsg: string) => {
  console.log(err);
  const error = err instanceof HttpError ? err : new HttpError(errMsg, 500);

  return next(error);
};

export { handleValidationErrors, handleHttpError };
