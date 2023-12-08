import { NextFunction, Request, Response } from "express";
import Card from "../models/card";
import BadRequestError from "../errors/BadRequestError";
import ErrorNotFound from "../errors/ErrorNotFound";

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
        next(new BadRequestError({ message: "Переданы некорректные данные" }));
      }

      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError({ message: "Переданы некорректные данные" }));
      } else {
        next(err);
      }
    });
}

export function likeCard(req: Request, res: Response, next: NextFunction) {
  return Card.findByIdAndUpdate(
    req.params.cardId,
    {
      $addToSet: { likes: req.user._id },
    },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        next(new ErrorNotFound("Карточка не найдена"));
      }
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError({ message: "Переданы некорректные данные" }));
      } else {
        next(err);
      }
    });
}

export function deleteCardId(req: Request, res: Response, next: NextFunction) {
  return Card.findOneAndDelete({ _id: req.params.cardId })
    .then((card: any) => {
      if (!card) {
        next(new ErrorNotFound("Карточка не найдена"));
      }
      res.send({ data: card, message: "Карточка удалена" });
    })
    .catch((err: any) => {
      if (err.name === "CastError") {
        next(new BadRequestError({ message: "Переданы некорректные данные" }));
      } else {
        next(err);
      }
    });
}

export function dislikeCard(req: Request, res: Response, next: NextFunction) {
  return Card.findByIdAndUpdate(
    req.params.cardId,
    {
      $pull: { likes: req.user._id },
    },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        next(new ErrorNotFound("Карточка не найдена"));
      }
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError({ message: "Переданы некорректные данные" }));
      } else {
        next(err);
      }
    });
}
