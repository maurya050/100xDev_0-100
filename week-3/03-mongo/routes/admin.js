const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const router = Router();
const Admin = require('../db').Admin;
const jwt = require('jsonwebtoken');
require('dotenv').config();
const jwtPassword = process.env.JWT_PASSWORD;



// Admin Routes
router.post('/signup', async (req, res) => {
    // Implement admin signup logic
    const { name, email, password } = req.body;
    const userAlreadyExists = await Admin.exists({ email: email });
    if (userAlreadyExists) {
        return res.status(403).json({
            msg: "Admin already exists",
        });
    }
    const newAdmin = new Admin({
        name: name,
        email: email,
        password: password,
    });
    await newAdmin.save();
    return res.json({
        msg: "Admin created successfully",
    });
});

router.post('/courses', adminMiddleware, (req, res) => {
    // Implement course creation logic
    

});

router.get('/courses', adminMiddleware, (req, res) => {
    // Implement fetching all courses logic
});

module.exports = router;