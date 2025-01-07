import User from "../Model/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import createToken from "../utils/createToken.js";

export const registerUser = async (req, res) => {
    try {
        const { username, email, password, image } = req.body;
        
        // Validate required fields
        if (!username || !email || !password || !image) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ 
            username, 
            email, 
            password: hashedPassword,
            image 
        });
        
        await user.save();
        const token = createToken({ userid: user._id });
        
        // Send user data without password
        const userData = {
            _id: user._id,
            username: user.username,
            email: user.email,
            image: user.image
        };

        res.status(201).json({ 
            message: "User registered successfully", 
            user: userData, 
            token 
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = createToken({ userid: user._id });
        
        // Send user data without password
        const userData = {
            _id: user._id,
            username: user.username,
            email: user.email,
            image: user.image
        };
        res.status(200).json({ user: userData, token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const verifyToken = async (req, res) => {
    try {
        const user = await User.findById(req.user.userid).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ user });
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const logoutUser = async (req, res) => {
    try {
        // You can add any server-side cleanup here if needed
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export default { registerUser, loginUser, verifyToken, logoutUser };