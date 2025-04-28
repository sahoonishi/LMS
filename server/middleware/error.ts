import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/ErrorHandler";

module.exports = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500; // mane status code nathile 500
  err.message = err.message || "Internal Server Error";

  // wrong mongodb id error
  if (err.name === "CastError") {
    const message = `Resource not found . Invalid ${err.path} `;
    err = new ErrorHandler(message, 400);
  }
  //? Duplicate key error
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    err = new ErrorHandler(message , 400);
  }
  //? wrong jwt error
  if (err.name === "JsonWebTokenError") {
    const message = `Json web token is invalid , try again`;
    err = new ErrorHandler(message , 400);
  }
};
