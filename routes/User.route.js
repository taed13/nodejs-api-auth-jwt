const express = require("express");
const route = express.Router();
const { verifyAccessToken } = require("../helpers/jwt_service");
const {
  register,
  refreshToken,
  login,
  logout,
  getlists,
  getAllUsers,
} = require("../controllers/User.controller");

route.post("/register", register);
route.get("/getAllUsers", getAllUsers);
route.post("/refresh-token", refreshToken);
route.post("/login", login);
route.delete("/logout", logout);
route.get("/getlists", verifyAccessToken, getlists);

module.exports = route;
