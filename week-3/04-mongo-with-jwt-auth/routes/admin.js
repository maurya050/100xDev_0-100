const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const {Admin, Course} = require('../db');
const router = Router();
const { Admin } = require("../db");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const jwtPassword = process.env.JWT_PASSWORD;

// Admin Routes
router.post('/signup', async (req, res) => {
    // Implement admin signup logic
    const { name, email, password } = req.body;
    const admin = new Admin({ name, email, password });
    const adminExists = await Admin.exists({ email: email });
    if (adminExists) {
        return res.status(403).json({
            msg: "Admin already exists",
        });
    }
    await admin.save();
    return res.json({
        msg: "Admin created successfully",
    });
});

router.post('/signin', adminMiddleware, async (req, res) => {
    // Implement admin signup logic
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email: email, password: password });
    if (!admin) {
        return res.status(403).json({
            msg: "Admin authentication failed",
        });
    }
    const token = jwt.sign({ email: email }, jwtPassword);
    return res.json({
        token,
    });

});

router.post('/courses', adminMiddleware, async (req, res) => {
    // Implement course creation logic
    const { title, description, price } = req.body;
    const course = new Course({ title, description, price });
    await course.save();
    return res.json({
        msg: "Course created successfully",
        courseId: course._id,
    });
});

router.get('/courses', adminMiddleware, async (req, res) => {
    // Implement fetching all courses logic
    try {
        const courses = await Course.find({});
        return res.json({
            courses: courses,
        });
    } catch (err) {
        return res.status(500).json({
            msg: "Internal server error",
        });
    }
});

module.exports = router;