import { Router } from "express";
import {
  getCards,
  createCard,
  deleteCardId,
  likeCard,
  dislikeCard,
} from "../controllers/cards";
import {
  createCardValid,
  parameterIdValid,
} from "../middlewares/validationJoi";
import auth from "../middlewares/auth";

const router = Router();

router.get("/", auth, getCards);
router.post("/", auth, createCardValid, createCard);
router.delete("/:cardId", auth, parameterIdValid("cardId"), deleteCardId);
router.put("/:cardId/likes", auth, parameterIdValid("cardId"), likeCard);
router.delete("/:cardId/likes", auth, parameterIdValid("cardId"), dislikeCard);

export default router;
