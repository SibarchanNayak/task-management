import express from "express";
import {
  registerUser,
  loginUser,
  refresh,
  logout,
} from "../controllers/authController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/refresh", refresh);
router.get("/logout", auth, logout);

export default router;
