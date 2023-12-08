import { NextFunction, Request, Response } from "express";
import User from "../models/user";
import BadRequestError from "../errors/BadRequestError";
import ErrorNotFound from "../errors/ErrorNotFound";

export function getUsers(req: Request, res: Response, next: NextFunction) {
  return User.find({})
    .then((users) => res.send(users))
    .catch((err) => next(err));
}

export function getUserId(req: Request, res: Response, next: NextFunction) {
  return User.findById(req.params.userId)
    .then((users) => {
      if (!users?._id) {
        next(
          new ErrorNotFound({
            message: "Запрашиваемый пользователь не найден",
          }),
        );
      }
      res.status(200).send({ data: users });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError({ message: "Переданы некорректные данные" }));
      } else {
        next(err);
      }
    });
}

export function createUser(req: Request, res: Response, next: NextFunction) {
  const { name, about, avatar } = req.body;

  return User.create({ name, about, avatar })
    .then((users) => {
      if (!users) {
        next(new BadRequestError({ message: "Переданы некорректные данные" }));
      }
      res.send({ data: users });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError({ message: "Переданы некорректные данные" }));
      } else {
        next(err);
      }
    });
}

export function updateProfile(req: Request, res: Response, next: NextFunction) {
  const { name, about } = req.body;
  return User.findByIdAndUpdate(
    req.user?._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((users) => {
      if (!users) {
        next(new BadRequestError({ message: "Переданы некорректные данные" }));
      }
      res.status(200).send({ data: users });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError({ message: "Переданы некорректные данные" }));
      } else {
        next(err);
      }
    });
}

export function updateAvatar(req: Request, res: Response, next: NextFunction) {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        next(new BadRequestError({ message: "Переданы некорректные данные" }));
      }
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError({ message: "Переданы некорректные данные" }));
      } else {
        next(err);
      }
    });
}
