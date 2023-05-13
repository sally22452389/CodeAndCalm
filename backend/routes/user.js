const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");

// Register
router.post("/register", async (req, res) => {
  try {
    const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser) {
      return res.status(400).send("Username already exists");
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10); // 10 is the saltRounds
    const user = new User({ ...req.body, password: hashedPassword });
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
      return res.status(401).send("Invalid username or password");
    }
    // If everything's okay, respond with some user data
    res.send({ username: user.username, email: user.email });
  } catch (error) {
    res.status(500).send(error);
  }
});
