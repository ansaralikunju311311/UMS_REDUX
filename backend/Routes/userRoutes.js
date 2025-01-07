import express from 'express';
import { registerUser, loginUser, verifyToken, logoutUser } from '../Controller/userController.js';
import { verifyToken as authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/verify', authMiddleware, verifyToken);
router.post('/logout', authMiddleware, logoutUser);

export default router;