import express from "express";
import { adminLogin, verifyToken, displayUsers } from "../Controller/adminController.js";
import { verifyToken as authMiddleware } from "../middleware/authMiddleware.js";

const adminRouter = express.Router();

adminRouter.post("/login", adminLogin);
adminRouter.get("/verify", authMiddleware, verifyToken);
adminRouter.get("/users", authMiddleware, displayUsers);

export default adminRouter;