import mongoose from "mongoose";

export interface IUser {
  name: string;
  about: string;
  avatar: string;
}

const userSchema = new mongoose.Schema<IUser>(
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
      default:
        "https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png",
    },
  },
  { versionKey: false }
);
export default mongoose.model<IUser>("user", userSchema);
