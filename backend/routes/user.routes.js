import express from "express";
import {
  forgotPassword,
  getMe,
  login,
  logoutUser,
  registerUser,
  resetPassword,
  verifyUser,
} from "../controller/user.controller.js";
import { isLoggedIn } from "../middleware/auth.middleware.js";
import { generateNewApiKey } from "../controller/user.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const userRoutes = express.Router();

userRoutes.post("/register", registerUser);
userRoutes.get("/verify/:token", verifyUser);
userRoutes.post("/login", login);
userRoutes.get("/profile", isLoggedIn, getMe);
userRoutes.get("/logout", isLoggedIn, logoutUser);
userRoutes.get("/forgot-password", forgotPassword);
userRoutes.post("/reset-password/:token", resetPassword);
userRoutes.post("/generate-new-api-key", protect, generateNewApiKey);

export default userRoutes;
