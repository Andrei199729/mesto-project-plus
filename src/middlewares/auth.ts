import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import Unauthorized from "../errors/Unauthorized";

export default (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(new Unauthorized("Необходима авторизация"));
  }
  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, "some-secret-key");
  } catch (err) {
    return next(new Unauthorized("Необходима авторизация"));
  }

  req.user = { _id: (payload as JwtPayload)._id };

  return next();
};
