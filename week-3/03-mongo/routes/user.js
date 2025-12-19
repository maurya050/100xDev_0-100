const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const User = require('../db').User;
const jwt = require('jsonwebtoken');
require('dotenv').config();
const jwtPassword = process.env.JWT_PASSWORD;

// User Routes
router.post('/signup', async (req, res) => {
    // Implement user signup logic
    const { name, email, password } = req.body;
});

router.get('/courses', (req, res) => {
    // Implement listing all courses logic
});

router.post('/courses/:courseId', userMiddleware, (req, res) => {
    // Implement course purchase logic
});

router.get('/purchasedCourses', userMiddleware, (req, res) => {
    // Implement fetching purchased courses logic
});

module.exports = router