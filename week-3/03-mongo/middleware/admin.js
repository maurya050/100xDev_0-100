const Admin = require('../db').Admin;
const jwt = require('jsonwebtoken');
require('dotenv').config();
const jwtPassword = process.env.JWT_PASSWORD;
// Middleware for handling auth
function adminMiddleware(req, res, next) {
    // Implement admin auth logic
    // You need to check the headers and validate the admin from the admin DB. Check readme for the exact headers to be expected
    const token = req.headers.authorization;

}

module.exports = adminMiddleware;