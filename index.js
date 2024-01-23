const express = require("express");
const app = express();
const createError = require("http-errors");
require("dotenv").config();
const UserRoute = require("./routes/User.route");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const connectDatabase = require("./helpers/connections_mongodb");
const client = require("./helpers/connections_redis");
const PORT = process.env.PORT || 1338;

app.get("/", (req, res, next) => {
  res.sendFile(__dirname + "/index.html");
});

app.use("/user", UserRoute);

// API
app.get("/api/login", async (req, res, next) => {
  return res.json({
    status: "success",
    elements: {
      token: "access_token",
      timeExpired: Date.now() + 60 * 1000,
    },
  });
});

app.get("/api/users", async (req, res, next) => {
  return res.json({
    status: "success",
    elements: [
      {
        id: 1,
        name: "John",
      },
      {
        id: 2,
        name: "Jane",
      },
    ],
  });
});

app.get("/api/refresh_token", async (req, res, next) => {
  return res.status(200).json({
    status: "success",
    elements: {
      token: "newAccessToken",
      timeExpired: Date.now() + 60 * 1000,
    },
  });
});

// END API

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
