import { Request, Response } from "express";
import Card from "../models/card";
import { ERROR_CODE, NOT_FOUND, ERROR_DEFAULT } from "../constants/constants";

export const getCards = (req: Request, res: Response) => {
  return Card.find({})
    .then((cards) => res.send({ cards }))
    .catch(() =>
      res.status(ERROR_DEFAULT).send({ message: "Произошла ошибка" }),
    );
};

export const createCard = (req: Request, res: Response) => {
  const { name, link } = req.body;
  const ownerId = req.user._id;

  return Card.create({ name, link, owner: ownerId })
    .then((card) => {
      if (!card) {
        res.status(ERROR_CODE).send("Переданы некорректные данные");
      }

      res.status(200).send({ data: card });
    })
    .catch(
      (err) =>
        err.name === "ValidationError" &&
        res.status(ERROR_DEFAULT).send({ message: err.errorMessage }),
    );
};

export const likeCard = (req: Request, res: Response) => {
  return Card.findByIdAndUpdate(
    req.params.cardId,
    {
      $addToSet: { likes: req.user._id },
    },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND).send("Карточка не найдена");
      }
      res.status(200).send({ data: card });
    })
    .catch(
      (err) =>
        err.name === "CastError" &&
        res.status(ERROR_DEFAULT).send({ message: err.errorMessage }),
    );
};

export const deleteCardId = (req: Request, res: Response) => {
  return Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND).send({ message: "Карточка не найдена" });
      }
      res.send({ data: card, message: "Карточка удалена" });
    })
    .catch(
      (err) =>
        err.name === "CastError" &&
        res
          .status(ERROR_DEFAULT)
          .send({ message: "Переданы некорректные данные" }),
    );
};

export const dislikeCard = (req: Request, res: Response) => {
  return Card.findByIdAndUpdate(
    req.params.cardId,
    {
      $pull: { likes: req.user._id },
    },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND).send("Карточка не найдена");
      }
      res.status(200).send({ data: card });
    })
    .catch(
      (err) =>
        err.name === "CastError" &&
        res
          .status(ERROR_DEFAULT)
          .send({ message: "Переданы некорректные данные" }),
    );
};
