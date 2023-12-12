import { NextFunction, Request, Response } from "express";
import { Error } from "mongoose";
import Card from "../models/card";
import BadRequestError from "../errors/BadRequestError";
import ErrorNotFound from "../errors/ErrorNotFound";
import Forbidden from "../errors/Forbidden";

export function getCards(req: Request, res: Response, next: NextFunction) {
  return Card.find({})
    .then((cards) => res.send({ cards }))
    .catch((err) => next(err));
}

export function createCard(req: Request, res: Response, next: NextFunction) {
  const { name, link } = req.body;
  const ownerId = req.user._id;

  return Card.create({ name, link, owner: ownerId })
    .then((card) => {
      if (!card) {
        return next(
          new BadRequestError({ message: "Переданы некорректные данные" })
        );
      }

      return res.status(201).send({ data: card });
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

export function likeCard(req: Request, res: Response, next: NextFunction) {
  return Card.findByIdAndUpdate(
    req.params.cardId,
    {
      $addToSet: { likes: req.user._id },
    },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        return next(new ErrorNotFound("Карточка не найдена"));
      }
      return res.send({ data: card });
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

export function deleteCardId(req: Request, res: Response, next: NextFunction) {
  const { cardId } = req.params;
  return Card.findById(cardId)
    .then((card) => {
      if (!card) {
        return next(new ErrorNotFound("Карточка не найдена"));
      }

      if (card?.owner.toString() !== req.user._id) {
        return next(new Forbidden("Вы не можете удалить эту карточку"));
      }
      return Card.findByIdAndDelete(cardId);
    })
    .then((deletedCard) => {
      if (!deletedCard) {
        return next(new ErrorNotFound("Карточка не найдена"));
      }

      return res.send({ data: deletedCard, message: "Карточка удалена" });
    })
    .catch((err: Error) => {
      if (err.name === "CastError") {
        return next(
          new BadRequestError({ message: "Переданы некорректные данные" })
        );
      }
      return next(err);
    });
}

export function dislikeCard(req: Request, res: Response, next: NextFunction) {
  return Card.findByIdAndUpdate(
    req.params.cardId,
    {
      $pull: { likes: req.user._id },
    },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        return next(new ErrorNotFound("Карточка не найдена"));
      }
      return res.send({ data: card });
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
