import mongoose from "mongoose";

import validator from "validator";

interface ICard {
  name: string;
  link: string;
  owner: mongoose.Types.ObjectId;
  likes: mongoose.Types.ObjectId[];
  createdAt: Date;
}

const cardSchema = new mongoose.Schema<ICard>(
  {
    name: {
      type: String,
      minlength: [2, "Минимальная длина поля 'name' - 2"],
      maxlength: [30, "Максимальная длина поля 'name' - 30"],
      required: [true, "Поле 'name' должно быть заполнено"],
    },
    link: {
      type: String,
      validate: {
        validator: (v: string) => validator.isURL(v),
        message: "Некорректный URL",
      },
      required: [true, "Поле 'link' должно быть заполнено"],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "Поле 'owner' должно быть заполнено"],
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Поле 'likes' должно быть заполнено"],
        default: [],
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);
export default mongoose.model<ICard>("card", cardSchema);
