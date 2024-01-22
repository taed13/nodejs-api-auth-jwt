const express = require("express");
const route = express.Router();
const createError = require("http-errors");
const User = require("../models/User.model");
const { userValidate } = require("../helpers/validation");
const {
  signAccessToken,
  verifyAccessToken,
} = require("../helpers/jwt_service");

route.post("/register", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // if (!email || !password) {
    //   throw createError.BadRequest();
    // }
    const { error } = userValidate(req.body);
    // console.log(error);

    if (error) {
      throw createError(error.details[0].message);
    }

    const isExists = await User.findOne({
      email,
    });

    if (isExists) {
      throw createError.Conflict(`${email} is already been registered`);
    }

    const user = new User({
      email,
      password,
    });

    const savedUser = await user.save();

    return res.json({
      status: "success",
      message: "User created successfully",
      data: savedUser,
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

route.post("/login", async (req, res, next) => {
  try {
    const { error } = userValidate(req.body);
    if (error) {
      throw createError(error.details[0].message);
    }
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      throw createError.NotFound("User not registered");
    }

    const isValid = await user.isCheckPassword(password);
    if (!isValid) {
      throw createError.Unauthorized("Username/password not valid");
    }

    const token = await signAccessToken(user._id);

    return res.json({
      status: "success",
      message: "Login successfully",
      accessToken: token,
    });
  } catch (error) {
    next(error);
  }
});

route.post("/logout", (req, res, next) => {
  res.send("Logout");
});

route.get("/getlists", verifyAccessToken, (req, res, next) => {
  console.log(req.headers);
  const listUsers = [
    {
      email: "user@example.com",
    },
    {
      email: "user@example.com",
    },
  ];

  return res.json({
    status: "success",
    message: "Users retrieved successfully",
    data: listUsers,
  });
});

module.exports = route;
