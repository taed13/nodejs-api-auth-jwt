const express = require("express");
const route = express.Router();
const createError = require("http-errors");

const User = require("../models/User.model");

route.post("/register", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw createError.BadRequest();
    }

    const isExists = await User.findOne({
      username: email,
    });

    if (isExists) {
      throw createError.Conflict(`${email} is already been registered`);
    }

    const isCreate = await User.create({
      username: email,
      password,
    });

    return res.json({
      status: "success",
      message: "User created successfully",
      data: isCreate,
    });
  } catch (error) {
    next(error);
  }
});

route.get("/getAllUsers", async (req, res, next) => {
  try {
    const users = await User.find({});

    return res.json({
      status: "success",
      message: "Users retrieved successfully",
      data: users,
    });
  } catch (error) {
    next(error);
  }
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
