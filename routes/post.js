const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Post = require("../models/post");

router.post("/upload", auth, async (req, res) => {
  const { caption, image } = req.body;
  const newPost = new Post({
    caption,
    image,
    postedBy: req.user._id,
  });

  try {
    const post = await newPost.save();
    res.status(200).json(post);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/all-post", async (req, res) => {
  const posts = await Post.find()
    .populate("postedBy", "_id pic fullname username")
    .populate("comments.postedBy", "_id pic fullname username");
  res.status(200).json(posts);
});

router.get("/my-post", auth, async (req, res) => {
  const posts = await Post.find({ postedBy: req.user._id }).populate(
    "postedBy",
    "_id fullname username email pic"
  );
  try {
    res.status(200).json(posts);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/remove-post", auth, (req, res) => {
  Post.findByIdAndDelete(req.body.postId, {
    new: true,
  }).exec((err, result) => {
    if (err) {
      return res.status(422).json({ error: err });
    } else {
      res.json(result);
    }
  });
});


router.put("/comment", auth, (req, res) => {
  const comment = {
    text: req.body.text,
    postedBy: req.user._id,
  };
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { comments: comment },
    },
    {
      new: true,
    }
  )
    .populate("comments.postedBy", "_id username")
    .populate("postedBy", "_id username")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        res.json(result);
      }
    });
});


router.put("/like", auth, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { likes: req.user._id },
    },
    {
      new: true,
    }
  ).exec((err, result) => {
    if (err) {
      return res.status(422).json({ error: err });
    } else {
      res.json(result);
    }
  });
});

router.put("/unlike", auth, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $pull: { likes: req.user._id },
    },
    {
      new: true,
    }
  ).exec((err, result) => {
    if (err) {
      return res.status(422).json({ error: err });
    } else {
      res.json(result);
    }
  });
});


module.exports = router;
