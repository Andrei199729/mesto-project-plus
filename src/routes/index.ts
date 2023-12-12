import { Router } from "express";
import userRoute from "./users";
import cardsRoute from "./cards";
import ErrorNotFound from "../errors/ErrorNotFound";
import { registerValid, loginValid } from "../middlewares/validationJoi";
import { createUser, login } from "../controllers/users";
import auth from "../middlewares/auth";

const router = Router();

router.post("/signup", registerValid, createUser);
router.post("/signin", loginValid, login);

router.use(auth);

router.use("/users", userRoute);
router.use("/cards", cardsRoute);

router.use((req, res, next) => {
  next(new ErrorNotFound({ message: "Данный путь не найден" }));
});

export default router;
