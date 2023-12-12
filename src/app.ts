import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import helmet from "helmet";
import { requestLogger, errorLoger } from "./middlewares/logger";
import usersRouter from "./routes/users";
import cardsRouter from "./routes/cards";
import routerErrorWay from "./routes/errorsway";
import { createUser, login } from "./controllers/users";
import auth from "./middlewares/auth";
import errorHandler from "./middlewares/errorHandler";
import { registerValid, loginValid } from "./middlewares/validationJoi";

const { PORT = 3000, DB_URL = "mongodb://127.0.0.1:27017/mestodb" } =
  process.env;

const app = express();

app.use(requestLogger);

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(DB_URL);

app.post("/signup", registerValid, createUser);
app.post("/signin", loginValid, login);

app.use("/users", usersRouter);
app.use("/cards", cardsRouter);

app.use(errorLoger);

app.disable("x-powered-by");

app.use(auth);

app.use(routerErrorWay);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
