const express = require("express");

const route = express.Router();

route.post("/register", (req, res, next) => {
  res.send("Register");
});

route.post("/refresh-token", (req, res, next) => {
  res.send("Refresh Token");
});

route.post("/login", (req, res, next) => {
  res.send("Login");
});

route.post("/logout", (req, res, next) => {
  res.send("Logout");
});

module.exports = route;
