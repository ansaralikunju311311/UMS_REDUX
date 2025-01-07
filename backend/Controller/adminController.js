import adminModel from "../Model/adminModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import createToken from "../utils/createToken.js";
import userModel from "../Model/userModel.js";
export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await adminModel.findOne({ email });
        if (!admin) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = createToken({ userid: admin._id });
        res.status(200).json({ admin, token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
export const verifyToken = async (req, res) => {
    try {
        const admin = await adminModel.findById(req.user.userid).select('-password');
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }
        res.json({ admin });
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
export const displayUsers = async (req, res) => {
    try {
        const users = await userModel.find();
        res.json({ users });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};