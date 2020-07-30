const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const jwt = require("jsonwebtoken");
const config = require("config");

router.post("/signup", async (req, res) => {
  const { name, email, password, pic } = req.body;
  if (!email || !password || !name) {
    return res.status(422).json({ error: "Please add all fields" });
  }
  if (
    !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      email
    )
  ) {
    return res.status(422).json({ error: "Please enter a valid Email!" });
  }
  try {
    var user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists!" });
    user = new User({
      email,
      name,
      password,
      pic
    });
    user.password = await bcrypt.hash(password, 12);

    await user.save(err => console.log);
    res.status(200).json({ msg: "Successfully signed up!" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(422).json({ error: "Please add all fields" });
  try {
    //Check for the user
    user = await User.findOne({ email });
    if (!user) return res.status(422).json({ error: "Invalid Credentials" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(422).json({ error: "Invalid Credentials" });

    const { _id, name, pic, following, followers } = user;
    //Generate a token
    const payload = {
      user: {
        id: _id
      }
    };

    jwt.sign(payload, config.get("jwtSecret"), (err, token) => {
      if (err) return console.log("Error while generating token");
      res
        .status(200)
        .json({ token, user: { _id, name, email, pic, following, followers } });
    });
  } catch (err) {
    console.log(`Server Error ${err}`);
  }
});
module.exports = router;
