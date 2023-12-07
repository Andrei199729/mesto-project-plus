import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import usersRouter from "./routes/users";
import cardsRouter from "./routes/cards";

const { PORT = 3000 } = process.env;

const app = express();
const mongoURI = "mongodb://localhost:27017/mestodb";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(mongoURI);

app.use((req, res, next) => {
  req.user = {
    _id: "6571c9dbcd5ab424eed06925",
  };

  next();
});

app.use("/users", usersRouter);
app.use("/cards", cardsRouter);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
