import express from "express";
import { adminLogin, verifyToken, displayUsers, updateUser, deleteUser, createUser } from "../Controller/adminController.js";
import { verifyToken as authMiddleware } from "../middleware/authMiddleware.js";

const adminRouter = express.Router();

adminRouter.post("/login", adminLogin);
adminRouter.get("/verify", authMiddleware, verifyToken);
adminRouter.get("/users", authMiddleware, displayUsers);
adminRouter.post("/users", authMiddleware, createUser);
adminRouter.put("/users/:userId", authMiddleware, updateUser);
adminRouter.delete("/users/:userId", authMiddleware, deleteUser);

export default adminRouter;