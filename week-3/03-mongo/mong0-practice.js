const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const jwtPassword = "123456";

mongoose.connect(
  "mongodb+srv://mauryashivam050_db_user:rySIIvAKs2dK03ht@cluster0.glnnio2.mongodb.net/user_app"
);

const User = mongoose.model("User", {
  name: String,
  username: String,
  password: String,
});

const app = express();
app.use(express.json());

function userExists(username, password) {
  // should check in the database
    return User.exists({ username: username, password: password });

}

app.post("/signup", async function (req, res) {
  const { name, username, password } = req.body;
    const userAlreadyExists = await User.exists({ username: username });    
    if (userAlreadyExists) {
        return res.status(403).json({
            msg: "User already exists",
        });
    }
    const newUser = new User({
        name: name,
        username: username, 
        password: password,
    });
    await newUser.save();
    return res.json({
        msg: "User created successfully",
    });
});

app.post("/signin", async function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  if (!await userExists(username, password)) {
    return res.status(403).json({
      msg: "User doesnt exist in our in memory db",
    });
  }

  var token = jwt.sign({ username: username }, jwtPassword);
  return res.json({
    token,
  });
});

app.get("/users", async function (req, res) {
  const token = req.headers.authorization;
  try {
    const decoded = jwt.verify(token, jwtPassword);
    const username = decoded.username;
    // return a list of the  all users name other than current username from the database
    const users = await User.find({ username: { $ne: username } }).select('name username -_id');
    return res.json(users);         
    
    
  } catch (err) {
    return res.status(403).json({
      msg: "Invalid token",
    });
  }
});

app.listen(3000);