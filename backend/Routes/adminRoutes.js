import express from "express";
import { adminLogin, verifyToken } from "../Controller/adminController.js";
import { verifyToken as authMiddleware } from "../middleware/authMiddleware.js";

const adminRouter = express.Router();

adminRouter.post("/login", adminLogin);
adminRouter.get("/verify", authMiddleware, verifyToken);

export default adminRouter;