import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
const {User} = require('../db');
dotenv.config();

function userMiddleware(req, res, next) {
    // Implement user auth logic
    // You need to check the headers and validate the user from the user DB. Check readme for the exact headers to be expected
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ msg: "No token provided" });
    }
    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_PASSWORD);
    } catch (err) {
        return res.status(401).json({ msg: "Invalid token" });
    }

    const userEmail = decoded.email;
    const user = User.findOne({ email:  userEmail });
    if (!user) {
        return res.status(403).json({ msg: "User not found" });
    }

    req.user = user;
    next();
}

module.exports = userMiddleware;