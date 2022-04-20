import { Response, NextFunction } from "express";
import { CustomRequestObject } from "../models/custom-request-object";

import HttpException from "../models/http-exception";

function errorHandler(
  err: HttpException,
  req: CustomRequestObject,
  res: Response,
  next: NextFunction
) {
  if (err.name === "UnauthorizedError") {
    // jwt authentication error
    return res.status(401).json({ message: "The User is not Authorized" });
  }

  if (err.name === "ValidationError") {
    // validation error
    return res.status(401).json({ message: err });
  }

  // defaults to 500 server error
  return res.status(500).json(err);
}

export default errorHandler;
