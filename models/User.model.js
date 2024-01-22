const mongoose = require("mongoose");
const schema = mongoose.Schema();

const userSchema = new schema({
  username: {
    type: String,
    lowercase: true,
    unique: true,
    required: [true, "Username is required"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
});

module.exports = mongoose.model("User", userSchema);
