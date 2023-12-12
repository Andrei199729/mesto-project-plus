import { Router } from "express";
import userRoute from "./users";
import cardsRoute from "./cards";
import ErrorNotFound from "../errors/ErrorNotFound";

const router = Router();

router.use("/users", userRoute);
router.use("/cards", cardsRoute);

router.use((req, res, next) => {
  next(new ErrorNotFound({ message: "Данный путь не найден" }));
});

export default router;
