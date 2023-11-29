const router = require("express").Router();
const User = require("../modals/User");
const bcrypt = require("bcrypt");

// UPDATE USER
router.put("/:id", async (req, res) => {
  if (req.body.userId == req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (error) {
        return res.status(500).json("You can update only your password");
      }
    }
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json("User updated");
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res.status(403).json("You can update only your account");
  }
});
// DELETE USER
router.delete("/:id", async (req, res) => {
  if (req.body.userId == req.params.id || req.body.isAdmin) {
    try {
      await User.findByIdAndDelete({ _id: req.params.id });
      res.status(200).json("User delete");
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res.status(403).json("You can delete only your account");
  }
});
// GET A USER
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, updatedAt, isAdmin, ...others } = user._doc;
    res.status(200).json(others);
  } catch (error) {
    return res.status(500).json(error);
  }
});
// FOLLLOW A USER
router.put("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { following: req.body.userId } });
        res.status(200).json("user has been followed");
      } else {
        res.status(403).json("You already follow this person");
      }
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    res.status(403).json("You can't follow yourself");
  }
});

// UNFOLLOW A USER

module.exports = router;
