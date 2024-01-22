const express = require("express");
const app = express();
const createError = require("http-errors");
require("dotenv").config();
const UserRoute = require("./routes/User.route");
const mongoose = require("mongoose");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 1338;

app.get("/", (req, res, next) => {
  res.send("Hello World");
});

app.use("/user", UserRoute);

app.use((req, res, next) => {
  //   const error = new Error("Not found");
  //   error.status = 404;
  //   next(error);
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

const connectDatabase = () => {
  const mongoDbUrl = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority`;
  console.log(`Connecting to ${mongoDbUrl}`);
  mongoose.Promise = global.Promise;

  // connecting to the database
  mongoose
    .connect(mongoDbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Successfully connected to the database");
    })
    .catch((err) => {
      console.log("Could not connect to the database. Exiting now...", err);
      process.exit();
    });
};

connectDatabase();

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
