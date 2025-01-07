import express from "express";
import userController from "../Controller/userController.js";
import { verifyToken as authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.post("/logout", authMiddleware, userController.logoutUser);
router.get("/verify", authMiddleware, userController.verifyToken);
router.put("/update", authMiddleware, userController.updateUser);

export default router;