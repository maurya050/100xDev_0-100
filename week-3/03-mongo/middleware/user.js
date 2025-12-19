const User = require('../db').User;
const jwt = require('jsonwebtoken');
require('dotenv').config();
const jwtPassword = process.env.JWT_PASSWORD;
// Middleware for handling auth

function userMiddleware(req, res, next) {
    // Implement user auth logic
    // You need to check the headers and validate the user from the user DB. Check readme for the exact headers to be expected
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, jwtPassword);
    const email = decoded.email;
    User.findOne({email:email}, (err, user) =>{
        if(err || !user){
            return res.status(403).json({
                msg: "User authentication failed",
            });
        }
        req.user = user;
        next();
    })
}

module.exports = userMiddleware;