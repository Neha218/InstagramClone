const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const authUser = require("../middleware/authUser");
const Post = mongoose.model("Post");
const User = mongoose.model("User");

router.get("/user/:id", authUser, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (user) {
      Post.find({ postedBy: req.params.id })
        .populate("postedBy", "_id name")
        .exec((err, posts) => {
          if (err) {
            return res.status(422).json({ error: err });
          }
          res.json({ user, posts });
        });
    }
  } catch (err) {
    console.log(err);
  }
});

router.put("/follow", authUser, async (req, res) => {
  User.findByIdAndUpdate(
    req.body.followId,
    { $push: { followers: req.user._id } },
    { new: true },
    async (err, result) => {
      try {
        if (err) return res.status(422).json({ error: err });
        const user = await User.findByIdAndUpdate(
          req.user._id,
          { $push: { following: req.body.followId } },
          { new: true }
        ).select("-password");
        res.status(200).json(user);
      } catch (err) {
        console.log(err);
      }
    }
  );
});
router.put("/unfollow", authUser, async (req, res) => {
  User.findByIdAndUpdate(
    req.body.unfollowId,
    { $pull: { followers: req.user._id } },
    { new: true },
    async (err, result) => {
      try {
        if (err) return res.status(422).json({ error: err });
        const user = await User.findByIdAndUpdate(
          req.user._id,
          { $pull: { following: req.body.unfollowId } },
          { new: true }
        ).select("-password");
        res.status(200).json(user);
      } catch (err) {
        console.log(err);
      }
    }
  );
});

router.put("/updateprofile", authUser, async (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { $set: { pic: req.body.pic } },
    { new: true },
    (err, result) => {
      if (err) return res.status(422).json({ error: "Pic cannot be updated!" });
      console.log(result);
      res.json(result);
    }
  );
});

module.exports = router;
