const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const { User, Course } = require("../db");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const jwtPassword = process.env.JWT_PASSWORD;

// User Routes
router.post("/signup", async (req, res) => {
  // Implement user signup logic
  const { name, email, password } = req.body;

  const userAlreadyExists = await User.exists({ email: email });
  if (userAlreadyExists) {
    return res.status(403).json({
      msg: "User already exists",
    });
  }

  const newUser = new User({
    name: name,
    email: email,
    password: password,
  });
  await newUser.save();
  return res.json({
    msg: "User created successfully",
  });
});

router.post("/signin", async (req, res) => {
  // Implement user signin logic
  const { email, password } = req.body;

  const user = await User.findOne({
    email: email,
    password: password,
  });
  if (!user) {
    return res.status(403).json({
      msg: "Invalid email or password",
    });
  }
  const token = jwt.sign({ email: email }, jwtPassword);
  return res.json({
    token,
  });
});

router.get("/courses", async (req, res) => {
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

router.post("/courses/:courseId", userMiddleware, async (req, res) => {
  // Implement course purchase logic
  const courseId = req.params.courseId;

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        msg: "Course not found",
      });
    }

    // Add course to user's purchasedCourses
    await User.updateOne(
      { email: req.user.email },
      {
        $push: {
          purchasedCourses: {
            courseId: courseId,
            purchaseDate: new Date(),
          },
        },
      }
    );
    return res.json({
      msg: "Course purchased successfully",
    });
  } catch (err) {
    return res.status(500).json({
      msg: "Internal server error",
    });
  }
});

router.get("/purchasedCourses", userMiddleware, async (req, res) => {
  // Implement fetching purchased courses logic

  try {
    const user = await User.findOne({ email: req.user.email });

    const purchasedCourseIds = user.purchasedCourses.map((pc) => pc.courseId);

    const courses = await Course.find({
      _id: { $in: purchasedCourseIds },
    });

    return res.json({
      purchasedCourses: courses,
    });
  } catch (err) {
    return res.status(500).json({
      msg: "Internal server error",
    });
  }
});

module.exports = router;
