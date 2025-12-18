const express = require("express");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const jwtPassword = process.env.JWT_PASSWORD || "123456";

const app = express();

const ALL_USERS = [
  {
    username: "harkirat@gmail.com",
    password: "123",
    name: "harkirat singh",
  },
  {
    username: "raman@gmail.com",
    password: "123321",
    name: "Raman singh",
  },
  {
    username: "priya@gmail.com",
    password: "123321",
    name: "Priya kumari",
  },
];

app.use(express.json());


const userExists = (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  const user = ALL_USERS.find(
    (user) => user.username === username && user.password === password
  );

  if (!user) {
    return res.status(403).json({
      msg: "User doesn't exist in our in memory db",
    });
  }
  req.user = user;
  return next();
}

app.post("/signin", userExists, (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  var token = jwt.sign({ username: username }, jwtPassword);
  return res.json({
    token,
  });
});
   
app.get("/users", function (req, res) {
  const token = req.headers.authorization;
  try {
    const decoded = jwt.verify(token, jwtPassword);
    const username = decoded.username;
    const user = ALL_USERS.find((user) => user.username === username);
    return res.json({
      name: user.name,
      username: user.username,
      
    }); 
  } catch (err) {
    return res.status(403).json({
      msg: "Invalid token",
    });
  }
});

app.listen(3000)