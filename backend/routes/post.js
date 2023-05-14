const express = require("express");
const router = express.Router();
const Post = require("../models/post");
const auth = require("../middleware/auth");

// Create post
router.post("/", auth, async (req, res) => {
  const post = new Post(req.body);
  try {
    await post.save();
    res.status(201).send(post);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Add comment
router.post("/:id/comments", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).send("Post not found");
    }
    post.comments.push(req.body); // Push the new comment into the comments array
    await post.save();
    res.status(201).send(post);
  } catch (error) {
    res.status(500).send(error);
  }
});
