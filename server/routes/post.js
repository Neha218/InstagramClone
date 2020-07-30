const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const authUser = require("../middleware/authUser");
const Post = mongoose.model("Post");

router.get("/allposts", authUser, async (req, res) => {
  try {
    posts = await Post.find()
      .populate("postedBy", "id name pic")
      .populate("comments.postedBy", "_id name");
    res.status(200).json({ posts });
  } catch (err) {
    res.status(500).json(err);
  }
});
router.get("/getfollowingposts", authUser, async (req, res) => {
  try {
    posts = await Post.find({ postedBy: { $in: req.user.following } })
      .populate("postedBy", "id name pic")
      .populate("comments.postedBy", "_id name");
    res.status(200).json({ posts });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/createpost", authUser, async (req, res) => {
  const { title, body, pic } = req.body;
  if (!title || !body || !pic) {
    return res.status(422).json({ error: "Please add all fields!" });
  }

  try {
    const post = new Post({
      title,
      body,
      photo: pic,
      postedBy: req.user
    });

    await post.save((err, result) => {
      if (err) return res.status(400).json(err);
      res.status(200).json(result);
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/myposts", authUser, async (req, res) => {
  try {
    myPosts = await Post.find({ postedBy: req.user._id }).populate(
      "postedBy",
      "_id name"
    );
    res.status(200).json({ myPosts });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/like", authUser, async (req, res) => {
  try {
    await Post.findByIdAndUpdate(
      req.body.postId,
      {
        $push: { likes: req.user._id }
      },
      {
        new: true
      }
    ).exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        return res.status(200).json(result);
      }
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/unlike", authUser, async (req, res) => {
  try {
    await Post.findByIdAndUpdate(
      req.body.postId,
      {
        $pull: { likes: req.user._id }
      },
      {
        new: true
      }
    ).exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        return res.status(200).json(result);
      }
    });
  } catch (err) {
    res.status(500).json(err);
  }
});
router.put("/comment", authUser, async (req, res) => {
  const comment = {
    text: req.body.text,
    postedBy: req.user._id
  };
  try {
    await Post.findByIdAndUpdate(
      req.body.postId,
      {
        $push: { comments: comment }
      },
      {
        new: true
      }
    )
      .populate("comments.postedBy", "_id name")
      .populate("postedBy", "_id name")
      .exec((err, result) => {
        if (err) {
          return res.status(422).json({ error: err });
        } else {
          return res.status(200).json(result);
        }
      });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/deletepost/:id", authUser, async (req, res) => {
  try {
    await Post.findOne({ _id: req.params.id })
      .populate("postedBy", "_id")
      .exec((err, post) => {
        if (err || !post) {
          return res.status(422).json(err);
        }
        if (post.postedBy._id.toString() === req.user._id.toString()) {
          const result = post.remove();
          res.json(result);
        }
      });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
