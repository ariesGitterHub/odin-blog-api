const express = require("express");

const { createNewBlogComment, editBlogComment, deleteBlogComment } = require("../controllers/comment.controller");

const { verifyUser } = require("../middleware/verify-user.middleware");
const {
  // requireAdmin,
  requireWriter,
} = require("../middleware/require-role.middleware");
const router = express.Router();

router.post("/:postId", verifyUser, requireWriter, createNewBlogComment);

// router.put("/:postId/:commentId", verifyUser, editBlogComment);
router.put("/:commentId", verifyUser, requireWriter, editBlogComment);

// router.delete("/:postId/:commentId", verifyUser, deleteBlogComment);
router.delete("/:commentId", verifyUser, requireWriter, deleteBlogComment);

module.exports = router;
