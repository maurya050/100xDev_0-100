const { Admin } = require("../db");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const jwtPassword = process.env.JWT_PASSWORD;
// Middleware for handling auth
async function adminMiddleware(req, res, next) {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(403).json({
        msg: "Admin authentication failed",
      });
    }

    const decoded = jwt.verify(token, jwtPassword);
    const email = decoded.email;

    const admin = await Admin.findOne({ email: email });
    if (!admin) {
      return res.status(403).json({
        msg: "Admin authentication failed",
      });
    }
    req.admin = admin;
    next();
  } catch (err) {
    return res.status(403).json({
      msg: "Admin authentication failed",
    });
  }
}

module.exports = adminMiddleware;
