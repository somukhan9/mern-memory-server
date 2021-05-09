const mongoose = require("mongoose");
const Post = require("../model/Post");

exports.getAllPosts = async (req, res) => {
  try {
    const post = await Post.find();
    res.status(200).json({ success: true, post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error });
  }
};

exports.getPostById = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Post not found" });
  }
  try {
    const singlePost = await Post.findById(id);
    res.status(200).json({ success: true, post: singlePost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error });
  }
};

exports.createPost = async (req, res) => {
  try {
    const { title, message, tags, selectedFile } = req.body;
    const { name, _id } = req.user;

    if (!title || !message || !tags) {
      return res
        .status(400)
        .json({ success: false, message: "Fill all the fields" });
    }

    const newPost = await new Post({
      title,
      message,
      tags,
      selectedFile,
      creator: name,
      uid: _id,
    }).save();

    res.status(201).json({ success: true, post: newPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error });
  }
};

exports.updatePost = async (req, res) => {
  const { id } = req.params;
  const post = req.body;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Post not found" });
  }
  try {
    const upDatedPost = await Post.findByIdAndUpdate(id, post, {
      new: true,
    });
    res.status(200).json({ success: true, post: upDatedPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error });
  }
};

exports.likePost = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Post not found" });
  }
  try {
    const post = await Post.findById(id);

    const index = post.likes.findIndex((id) => id === String(req.user._id));

    if (index === -1) {
      // like Post
      post.likes.push(req.user._id);
    } else {
      // dislike Post
      post.likes = post.likes.filter((id) => id !== String(req.user._id));
    }

    const upDatedPost = await Post.findByIdAndUpdate(id, post, { new: true });

    res.status(200).json({ success: true, post: upDatedPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error });
  }
};

exports.deletePost = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Post not found" });
  }
  try {
    const deletedPost = await Post.findByIdAndDelete(id);
    res
      .status(200)
      .json({ success: true, post: deletedPost, message: "user deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error });
  }
};
