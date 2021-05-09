const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/User");
const Token = require("../model/Token");
const validator = require("../config/validator");

exports.signup = async (req, res) => {
  try {
    const { firstname, lastname, email, password, confirmPassword } = req.body;
    if (!firstname || !lastname || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Fill all the fields" });
    }

    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide a valid email" });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password length should be at least 6",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password should be match",
      });
    }

    let user = await User.findOne({ email: email });

    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "Email has already taken" });
    }
    const newUser = {
      name: firstname + " " + lastname,
      email,
      password,
    };

    user = await new User(newUser).save();
    const accessToken = await user.createAccessToken();
    const refreshToken = await user.createRefreshToken();

    res.status(201).json({
      success: true,
      accessToken,
      refreshToken,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error(error);
    res.satus(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Fill all the fields" });
    }

    let user = await User.findOne({ email: email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "No user found with this email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    const accessToken = await user.createAccessToken();
    const refreshToken = await user.createRefreshToken();

    res.status(200).json({
      success: true,
      accessToken,
      refreshToken,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.generateRefreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res
        .status(403)
        .json({ success: false, message: "Access denied, Login Again" });
    }
    const tokenDoc = await Token.findOne({ token: refreshToken });

    if (!tokenDoc) {
      return res.status(401).json({ success: false, message: "Tokne Expired" });
    }
    const payload = jwt.verify(
      tokenDoc.token,
      process.env.REFRESH_TOKEN_SECRET
    );
    const accessToken = jwt.sign(
      { user: payload.user },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "10m" }
    );

    res.status(200).json({ success: true, accessToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.params;
    await Token.findOneAndDelete({ token: refreshToken });
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
