import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import helmet from "helmet";
import { errors } from "celebrate";
import { requestLogger, errorLoger } from "./middlewares/logger";
import routerErrorWay from "./routes";
import errorHandler from "./middlewares/errorHandler";

const { PORT = 3000, DB_URL = "mongodb://127.0.0.1:27017/mestodb" } =
  process.env;

const app = express();

app.use(requestLogger);

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(DB_URL);

app.use(errorLoger);

app.disable("x-powered-by");

app.use(routerErrorWay);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
