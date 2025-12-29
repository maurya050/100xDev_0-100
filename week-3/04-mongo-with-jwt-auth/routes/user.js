const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const { User, Course } = require("../db");
const jwt = require("jsonwebtoken");
const { use } = require("react");
require("dotenv").config();
const jwtPassword = process.env.JWT_PASSWORD;

// User Routes
router.post('/signup', async (req, res) => {
    // Implement user signup logic
    const { name, email, password } = req.body;

    const userAlreadyExists = await User.exists({ email: email });
    if (userAlreadyExists) {
        return res.status(403).json({
            msg: "User already exists",
        });
    }

    const user = new User({ name, email, password });
    await user.save();
    return res.json({
        msg: "User created successfully",
    });
});

router.post('/signin', userMiddleware, async (req, res) => {
    // Implement admin signup logic
    const { email, password } = req.body;
    const user = await User.findOne({ email: email, password: password });
    if (!user) {
        return res.status(403).json({
            msg: "User authentication failed",
        });
    }
    const token = jwt.sign({ email: email }, jwtPassword);
    return res.json({
        token,
    });
    
});

router.get('/courses', userMiddleware, async (req, res) => {
    // Implement listing all courses logic
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

router.post('/courses/:courseId', userMiddleware, async (req, res) => {
    // Implement course purchase logic
    const courseId = req.params.courseId;
    const userEmail = req.user.email;

    try {
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                msg: "Course not found",
            });
        }

        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({
                msg: "User not found",
            });
        }

        user.purchasedCourses.push(course);
        await user.save();

        return res.json({
            msg: "Course purchased successfully",
        });
    } catch (err) {
        return res.status(500).json({
            msg: "Internal server error",
        });
    }
});

router.get('/purchasedCourses', userMiddleware, async (req, res) => {
    // Implement fetching purchased courses logic
    const userEmail = req.user.email;

    try {
        const user = await User.findOne({ email: userEmail }).populate('purchasedCourses');
        if (!user) {
            return res.status(404).json({
                msg: "User not found",
            });
        }

        return res.json({
            purchasedCourses: user.purchasedCourses,
        });
    } catch (err) {
        return res.status(500).json({
            msg: "Internal server error",
        });
    }   
});

module.exports = router