import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  updateUser
} from "../controllers/auth/UserController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/user", protect, getUser);
router.patch("/user", protect, updateUser);

export default router;
