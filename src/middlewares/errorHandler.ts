import { ErrorRequestHandler } from "express";
import { Error } from "mongoose";

const errorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  next
) => {
  console.log(err.stack || err);
  const status = err.statusCode || 500;

  res.status(status).send({ err });
  next();
};

export default errorHandler;
