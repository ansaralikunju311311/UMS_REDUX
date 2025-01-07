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

export const updateUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { username, email, phonenumber } = req.body;

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update user fields
        user.username = username || user.username;
        user.email = email || user.email;
        user.phonenumber = phonenumber || user.phonenumber;

        await user.save();
        res.json({ message: "User updated successfully", user });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await userModel.findByIdAndDelete(userId);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const createUser = async (req, res) => {
    try {
        const { username, email, password, phonenumber, image } = req.body;

        // Check if user with email already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User with this email already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new userModel({
            username,
            email,
            password: hashedPassword,
            phonenumber,
            image
        });

        await newUser.save();
        
        // Don't send password in response
        const userResponse = { ...newUser._doc };
        delete userResponse.password;

        res.status(201).json({ message: "User created successfully", user: userResponse });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};