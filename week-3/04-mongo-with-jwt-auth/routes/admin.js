const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const {Admin, Course} = require('../db');
const router = Router();
const { Admin } = require("../db");

// Admin Routes
router.post('/signup', async (req, res) => {
    // Implement admin signup logic
    const { name, email, password } = req.body;
    const admin = new Admin({ name, email, password });
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
    return res.json({
        msg: "Admin signed in successfully",
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