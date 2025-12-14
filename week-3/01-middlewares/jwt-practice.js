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

function userExists(username, password) {
    return ALL_USERS.some(
        (user) => user.username === username && user.password === password  
    );
  
}

app.post("/signin", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  if (!userExists(username, password)) {
    return res.status(403).json({
      msg: "User doesnt exist in our in memory db",
    });
  }

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