const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const router = Router();
const Admin = require('../db').Admin;
const Course = require('../db').Course;
const jwt = require('jsonwebtoken');
require('dotenv').config();
const jwtPassword = process.env.JWT_PASSWORD;



// Admin Routes
router.post('/signup',  async (req, res) => {
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
    const { id, title, description, price } = req.body;
    const newCourse = new Course({
        id: id,
        title: title,
        description: description,
        price: price,
    });
    newCourse.save();
    return res.json({
        msg: "Course created successfully",
        courseId: newCourse._id,
    });
});

router.get('/courses', adminMiddleware, (req, res) => {
    // Implement fetching all courses logic
    Course.find({}, (err, courses) => {
        if (err) {
            return res.status(500).json({
                msg: "Error fetching courses",
            });
        }
        return res.json({
            courses: courses,
        });
    });
});

module.exports = router;