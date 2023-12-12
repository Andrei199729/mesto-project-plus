import { Router } from "express";
import {
  getUsers,
  getUserId,
  updateProfile,
  updateAvatar,
  getUserMe,
} from "../controllers/users";
import {
  userValid,
  parameterIdValid,
  userAvatarValid,
} from "../middlewares/validationJoi";
import auth from "../middlewares/auth";

const router = Router();

router.get("/", auth, getUsers);
router.get("/:userId", auth, parameterIdValid("userId"), getUserId);
router.get("/me", auth, getUserMe);
router.patch("/me", auth, userValid, updateProfile);
router.patch("/me/avatar", userAvatarValid, updateAvatar);

export default router;
