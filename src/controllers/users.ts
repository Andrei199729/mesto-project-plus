import { NextFunction, Request, Response } from "express";
import { Error } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/user";
import BadRequestError from "../errors/BadRequestError";
import ErrorNotFound from "../errors/ErrorNotFound";
import Unauthorized from "../errors/Unauthorized";
import ErrorConflict from "../errors/ErrorConflict";

export function getUsers(req: Request, res: Response, next: NextFunction) {
  return User.find({})
    .then((users) => res.send(users))
    .catch((err) => next(err));
}

export function getUserMe(req: Request, res: Response, next: NextFunction) {
  return User.findById(req.user._id)
    .then((user) => {
      if (!user?._id) {
        return next(
          new ErrorNotFound({
            message: "Запрашиваемый пользователь не найден",
          })
        );
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(
          new BadRequestError({ message: "Переданы некорректные данные" })
        );
      }
      return next(err);
    });
}

export function getUserId(req: Request, res: Response, next: NextFunction) {
  return User.findById(req.params.userId)
    .then((users) => {
      if (!users?._id) {
        return next(
          new ErrorNotFound({
            message: "Запрашиваемый пользователь не найден",
          })
        );
      }
      return res.send({ data: users });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(
          new BadRequestError({ message: "Переданы некорректные данные" })
        );
      }
      return next(err);
    });
}

export function createUser(req: Request, res: Response, next: NextFunction) {
  const {
    name, about, avatar, email, password,
  } = req.body;

  return bcrypt
    .hash(password, 10)
    .then((hash: string) => User.create({
      email,
      password: hash,
    }))
    .then((user) => {
      res.status(201).send(user);
    })
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => User.findOne({ _id: user._id }))
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Переданы некорректные данные."));
      }
      if (err.code === 11000) {
        return next(new ErrorConflict({ message: err.errorMessage }));
      }
      return next(err);
    });
}

export function updateProfile(req: Request, res: Response, next: NextFunction) {
  const { name, about } = req.body;
  return User.findByIdAndUpdate(
    req.user?._id,
    { name, about },
    { new: true, runValidators: true }
  )
    .then((users) => {
      if (!users) {
        return next(
          new BadRequestError({ message: "Переданы некорректные данные" })
        );
      }
      return res.send({ data: users });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(
          new BadRequestError({ message: "Переданы некорректные данные" })
        );
      }
      return next(err);
    });
}

export function updateAvatar(req: Request, res: Response, next: NextFunction) {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        return next(
          new BadRequestError({ message: "Переданы некорректные данные" })
        );
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(
          new BadRequestError({ message: "Переданы некорректные данные" })
        );
      }
      return next(err);
    });
}

export function login(req: Request, res: Response, next: NextFunction) {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, "some-secret-key", {
        expiresIn: "7d",
      });
      res.cookie("jwt", token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      });
      res.status(200).send({ message: "Авторизация успешна", token });
    })
    .catch((err: Error) => {
      if (err.name === "IncorrectEmail") {
        return next(
          new Unauthorized({ message: "Не правильный логин или пароль" })
        );
      }
      return next(err);
    });
}
