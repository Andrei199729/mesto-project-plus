import { Router } from "express";
import {
  getUsers,
  createUser,
  getUserId,
  updateProfile,
  updateAvatar,
} from "../controllers/users";

const router = Router();

router.get("/", getUsers);
router.get("/:userId", getUserId);
router.post("/", createUser);
router.patch("/me", updateProfile);
router.patch("/me/avatar", updateAvatar);

export default router;
