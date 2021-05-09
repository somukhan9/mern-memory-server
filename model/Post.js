const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  creator: String,
  uid: String,
  title: String,
  message: String,
  tags: [String],
  selectedFile: String,
  likes: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Post", postSchema);
