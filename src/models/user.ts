import mongoose, { Model, Document } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import Unauthorized from "../errors/Unauthorized";

export interface IUser {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
}

interface UserModel extends Model<IUser> {
  findUserByCredentials(
    email: string,
    password: string
  ): Promise<Document<unknown, any, IUser>>;
}

const userSchema = new mongoose.Schema<IUser, UserModel>(
  {
    name: {
      type: String,
      minlength: [2, "Минимальная длина поля 'name' - 2"],
      maxlength: [30, "Максимальная длина поля 'name' - 30"],
      required: [true, "Поле 'name' должно быть заполнено"],
      default: "Жак-Ив Кусто",
    },
    about: {
      type: String,
      minlength: [2, "Минимальная длина поля 'about' - 2"],
      maxlength: [200, "Максимальная длина поля 'about' - 200"],
      required: [true, "Поле 'about' должно быть заполнено"],
      default: "Исследователь",
    },
    avatar: {
      type: String,
      required: [true, "Поле 'avatar' должно быть заполнено"],
      validate: {
        validator: (v: string) => validator.isURL(v, { require_protocol: true }),
        message: "Поле 'avatar' не соответствует формату URL",
      },
      default:
        "https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png",
    },
    email: {
      type: String,
      validate: {
        validator: (v: string) => validator.isEmail(v),
        message: "Неправильный формат почты",
      },
      required: [true, "Поле 'email' должно быть заполнено"],
      unique: true,
    },
    password: {
      type: String,
      select: false,
      required: true,
    },
  },
  { versionKey: false }
);

userSchema.statics.findUserByCredentials = function (email: string, password: string) {
  return this.findOne({ email }).select("+password").then((user) => {
    if (!user) {
      throw new Unauthorized("Указан некорректный Email или пароль.");
    }

    return bcrypt.compare(password, user.password).then((matched) => {
      if (!matched) {
        throw new Unauthorized("Указан некорректный Email или пароль.");
      }

      return user;
    });
  });
};

export default mongoose.model<IUser, UserModel>("user", userSchema);
