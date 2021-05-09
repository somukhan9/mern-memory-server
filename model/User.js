const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Token = require("./Token");
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

userSchema.methods = {
  createAccessToken: async function () {
    try {
      const { _id, email, name } = this;
      const accessToken = jwt.sign(
        { user: { _id, name, email } },
        ACCESS_TOKEN_SECRET,
        { expiresIn: "10m" }
      );
      return accessToken;
    } catch (error) {
      console.error(error);
      return;
    }
  },
  createRefreshToken: async function () {
    try {
      const { _id, name, email } = this;
      const refreshToken = jwt.sign(
        { user: { _id, name, email } },
        REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
      );
      await new Token({ token: refreshToken }).save();
      return refreshToken;
    } catch (error) {
      console.error(error);
      return;
    }
  },
};

userSchema.pre("save", async function (next) {
  try {
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    console.error(error);
  }
});

module.exports = mongoose.model("User", userSchema);
