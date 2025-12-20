const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const {Admin, Course} = require('../db');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const jwtPassword = process.env.JWT_PASSWORD;

const router = Router();


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

// Admin Signin Route
router.post('/signin', async (req, res) => {
    // Implement admin signin logic
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email: email, password: password });
    if (!admin) {
        return res.status(403).json({
            msg: "Admin authentication failed",
        });
    }
    var token = jwt.sign({email : email}, jwtPassword);
    return res.json({
        token,
    });
})

router.post('/courses', adminMiddleware, async (req, res) => {
    // Implement course creation logic
    const { title, description, price } = req.body;
    const newCourse = new Course({
        title: title,
        description: description,
        price: price,
    });
    await newCourse.save();
    return res.json({
        msg: "Course created successfully",
        courseId: newCourse._id,
    });
});

router.get('/courses', adminMiddleware, async (req, res) => {
    // Implement fetching all courses logic
    try{
        const courses = await Course.find({});
        return res.json({
            courses: courses
        });
    } catch(err) {
        return res.status(500).json({
            msg: "Error fetching courses"   
        }); 
    }
});

module.exports = router;