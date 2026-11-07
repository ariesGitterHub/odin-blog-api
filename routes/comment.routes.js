const express = require("express");

const {
  createNewBlogComment,
  editBlogComment,
  deleteBlogComment,
} = require("../controllers/comment.controller");

const { verifyUser } = require("../middleware/verify-user.middleware");

// const { requireWriter } = require("../middleware/require-role.middleware");

const router = express.Router();

// router.post("/:postId", verifyUser, requireWriter, createNewBlogComment);
router.post("/:postId", verifyUser, createNewBlogComment);

// router.patch("/:commentId", verifyUser, requireWriter, editBlogComment);
router.patch("/:commentId", verifyUser, editBlogComment);

// router.delete("/:commentId", verifyUser, requireWriter, deleteBlogComment);
router.delete("/:commentId", verifyUser, deleteBlogComment);

module.exports = router;
