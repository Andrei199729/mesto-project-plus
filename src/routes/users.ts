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

const router = Router();

router.get("/", getUsers);
router.get("/me", getUserMe);
router.get("/:userId", parameterIdValid("userId"), getUserId);
router.patch("/me", userValid, updateProfile);
router.patch("/me/avatar", userAvatarValid, updateAvatar);

export default router;
