const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: [true, "Email is required"],
    sparse: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
});

userSchema.pre("save", async function (next) {
  try {
    // console.log("Pre Save", this.email, this.password);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.isCheckPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = mongoose.model("User", userSchema);
