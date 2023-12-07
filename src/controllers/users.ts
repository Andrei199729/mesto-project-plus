import { Request, Response } from "express";
import User from "../models/user";
import { ERROR_CODE, NOT_FOUND, ERROR_DEFAULT } from "../constants/constants";

export const getUsers = (req: Request, res: Response) => {
  return User.find({})
    .then((users) => res.send(users))
    .catch(() =>
      res.status(ERROR_DEFAULT).send({ message: "Произошла ошибка" }),
    );
};

export const getUserId = (req: Request, res: Response) => {
  return User.findById(req.params.userId)
    .then((users) => {
      if (!users?._id) {
        console.log(users);

        res
          .status(NOT_FOUND)
          .send({ message: "Запрашиваемый пользователь не найден" });
      }
      res.status(200).send({ data: users });
    })
    .catch(
      (err) =>
        err.name === "CastError" &&
        res
          .status(ERROR_DEFAULT)
          .send({ message: "Переданы некорректные данные" }),
    );
};

export const createUser = (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;

  return User.create({ name, about, avatar })
    .then((users) => {
      if (!users) {
        res.status(ERROR_CODE).send("Переданы некорректные данные");
      }
      res.send({ data: users });
    })
    .catch(
      (err) =>
        err.name === "ValidationError" &&
        res
          .status(ERROR_DEFAULT)
          .send({ message: "Переданы некорректные данные" }),
    );
};

export const updateProfile = (req: Request, res: Response) => {
  const { name, about } = req.body;
  return User.findByIdAndUpdate(
    req.user?._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((users) => {
      if (!users) {
        res.status(ERROR_CODE).send("Переданы некорректные данные");
      }
      res.status(200).send({ data: users });
    })
    .catch(
      (err) =>
        err.name === "ValidationError" &&
        res
          .status(ERROR_DEFAULT)
          .send({ message: "Переданы некорректные данные" }),
    );
};

export const updateAvatar = (req: Request, res: Response) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        res.status(ERROR_CODE).send("Переданы некорректные данные");
      }
      res.status(200).send({ data: user });
    })
    .catch(
      (err) =>
        err.name === "ValidationError" &&
        res
          .status(ERROR_DEFAULT)
          .send({ message: "Переданы некорректные данные" }),
    );
};
