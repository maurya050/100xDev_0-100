import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
const {Admin} = require('../db');
dotenv.config();

const jwtPassword = process.env.JWT_PASSWORD;
// Middleware for handling auth
function adminMiddleware(req, res, next) {
    // Implement admin auth logic
    // You need to check the headers and validate the admin from the admin DB. Check readme for the exact headers to be expected
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ msg: "No token provided" });
    }

    let decoded;
    try {
        decoded = jwt.verify(token, jwtPassword);
    } catch (err) {
        return res.status(401).json({ msg: "Invalid token" });
    }

    const adminEmail = decoded.email;
    const admin = Admin.findOne({ email: adminEmail });
    if (!admin) {
        return res.status(403).json({ msg: "Admin not found" });
    }

    req.admin = admin;
    next();

}

module.exports = adminMiddleware;