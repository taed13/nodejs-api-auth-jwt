const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require("../helpers/jwt_service");

const { userValidate } = require("../helpers/validation");
const createError = require("http-errors");
const User = require("../models/User.model");
const client = require("../helpers/connections_redis");

module.exports = {
  register: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const { error } = userValidate(req.body);
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
  },
  refreshToken: async (req, res, next) => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        throw createError.BadRequest();
      }

      const { userId } = await verifyRefreshToken(refreshToken);

      res.json({
        status: "success",
        message: "Token refreshed successfully",
        accessToken: await signAccessToken(userId),
        refreshToken: await signRefreshToken(userId),
      });
    } catch (error) {
      next(error);
    }
  },
  login: async (req, res, next) => {
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

      const accessToken = await signAccessToken(user._id);
      const refreshToken = await signRefreshToken(user._id);

      return res.json({
        status: "success",
        message: "Login successfully",
        accessToken: accessToken,
        refreshToken: refreshToken,
      });
    } catch (error) {
      next(error);
    }
  },
  logout: async (req, res, next) => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        throw createError.BadRequest();
      }

      const { userId } = await verifyRefreshToken(refreshToken);
      client.del(userId, (err, val) => {
        if (err) {
          console.log(err.message);
          throw createError.InternalServerError();
        }
        res.json({
          status: "success",
          message: "Logout successfully",
        });
      });
    } catch (error) {
      next(error);
    }
  },
  getlists: (req, res, next) => {
    // console.log(req.headers);
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
  },
  getAllUsers: async (req, res, next) => {
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
  },
};
