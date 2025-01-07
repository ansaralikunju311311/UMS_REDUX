import jwt from "jsonwebtoken";

const createToken = ({ userid }) => {
    return jwt.sign({ userid }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

export default createToken;