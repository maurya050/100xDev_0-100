
const { User } = require('../db');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const jwtPassword = process.env.JWT_PASSWORD;
// Middleware for handling auth

async function userMiddleware(req, res, next) {
    // Implement user auth logic
    // You need to check the headers and validate the user from the user DB. Check readme for the exact headers to be expected
    try{
        const token = req.headers.authorization;

        if(!token){
            return res.status(403).json({
                msg: "User authentication failed",
            });
        }

        const decoded = jwt.verify(token, jwtPassword);
        const email = decoded.email;

        const user = await User.findOne({ email: email });
        if(!user){
            return res.status(403).json({
                msg: "User authentication failed",
            });
        }
        req.user = user;
        next();
    }
    catch(err){
        return res.status(403).json({
            msg: "User authentication failed",
    });
   
}
}

module.exports = userMiddleware;