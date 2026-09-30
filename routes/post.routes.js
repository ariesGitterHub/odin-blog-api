const express = require("express");

const {
  getBlogPosts,
  getPublishedBlogPosts,
  createNewBlogPost,
  editBlogPost,
  deleteBlogPost,
} = require("../controllers/post.controller")

const { verifyUser } = require("../middleware/verify-user.middleware");
const { requireAdmin } = require("../middleware/require-admin.middleware");

const router = express.Router();

// Get all published blog posts - anyone can read these, they are public
router.get("/public", getPublishedBlogPosts);

// Get all blog posts, published or unpublished
router.get("/", verifyUser, requireAdmin, getBlogPosts);

router.post("/", verifyUser, requireAdmin, createNewBlogPost);

router.put("/:postId", verifyUser, requireAdmin, editBlogPost);

router.delete("/:postId", verifyUser, requireAdmin, deleteBlogPost);

module.exports = router;
