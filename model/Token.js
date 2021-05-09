const mongoose = require("mongoose");

const tokenSchema = mongoose.Schema({
  token: String,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Token", tokenSchema);
