import { validationResult } from "express-validator";
import HttpError from "../models/http-error";
import { RequestHandler } from "express";

const handleValidationErrors: RequestHandler = (req, res, next) =>{
    const errors = validationResult(req);
  
    if (!errors.isEmpty()) {
      const error = new HttpError(
        `${errors
          .array()
          .map((e) => e.msg)
          .join(",")}`,
        422
      );
      return next(error)
    }
  
    return next()
}


export default handleValidationErrors;