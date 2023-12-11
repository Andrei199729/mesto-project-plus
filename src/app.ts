import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import helmet from "helmet";
import usersRouter from "./routes/users";
import cardsRouter from "./routes/cards";

const { PORT = 3000, DB_URL = "mongodb://127.0.0.1:27017/mestodb" } =
  process.env;

const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(DB_URL);

app.use((req: Request, res: Response, next: NextFunction) => {
  req.user = {
    _id: "6571c9dbcd5ab424eed06925",
  };

  next();
});

app.use("/users", usersRouter);
app.use("/cards", cardsRouter);

app.disable("x-powered-by");

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
