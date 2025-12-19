const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL);

// Define schemas
const AdminSchema = new mongoose.Schema({
    // Schema definition here
    name: String,
    email: String,
    password: String
});

const PurchasedCourses = new mongoose.Schema({
    // Schema definition here
    courseId: String,
    purchaseDate: Date
});

const UserSchema = new mongoose.Schema({
    // Schema definition here
    name: String,
    email: String,
    password: String,
    purchasedCourses: [PurchasedCourses]
});

const CourseSchema = new mongoose.Schema({
    // Schema definition here
    id: String,
    title: String,
    description: String,
    price: Number
});

const Admin = mongoose.model('Admin', AdminSchema);
const User = mongoose.model('User', UserSchema);
const Course = mongoose.model('Course', CourseSchema);

module.exports = {
    Admin,
    User,
    Course
}