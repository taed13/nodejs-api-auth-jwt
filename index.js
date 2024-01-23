const express = require("express");
const app = express();
const createError = require("http-errors");
require("dotenv").config();
const UserRoute = require("./routes/User.route");
const mongoose = require("mongoose");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const connectDatabase = require("./helpers/connections_mongodb");
const client = require("./helpers/connections_redis");

const PORT = process.env.PORT || 1338;

client.set("foo", "annoystick");
client.get("foo", (err, value) => {
  if (err) {
    console.log(err.message);
  }
  console.log(value);
});

app.get("/", (req, res, next) => {
  res.json({
    message: "JWT Authentication!!!",
  });
});

app.use("/user", UserRoute);

app.use((req, res, next) => {
  next(createError.NotFound("This route does not exist"));
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

connectDatabase();

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
