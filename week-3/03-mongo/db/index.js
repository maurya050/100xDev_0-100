const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

// Define schemas
const AdminSchema = new mongoose.Schema({
    // Schema definition here
    name : {type : String, required : true},
    email : {type : String, required : true, unique : true},
    password : {type : String, required : true}
});

const PurchasedCourses = new mongoose.Schema({
    // Schema definition here
    courseId: {type : mongoose.Schema.Types.ObjectId, ref : 'Course'},
    purchaseDate: {type : Date, default : Date.now}
});

const UserSchema = new mongoose.Schema({
    // Schema definition here
    name : {type : String, required : true},
    email : {type : String, required : true, unique : true},
    password : {type : String, required : true},
    purchasedCourses : [PurchasedCourses]
});

const CourseSchema = new mongoose.Schema({
    // Schema definition here
    title : {type : String, required : true},
    description : {type : String, required : true},
    price : {type : Number, required : true},
});

const Admin = mongoose.model('Admin', AdminSchema);
const User = mongoose.model('User', UserSchema);
const Course = mongoose.model('Course', CourseSchema);

module.exports = {
    Admin,
    User,
    Course
}