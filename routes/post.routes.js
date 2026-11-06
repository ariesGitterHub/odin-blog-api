const express = require("express");

const {
  getBlogPosts,
  getPublishedBlogPosts,
  createNewBlogPost,
  editBlogPost,
  togglePublished,
  deleteBlogPost,
} = require("../controllers/post.controller")

const { verifyUser } = require("../middleware/verify-user.middleware");
const { requireWriter } = require("../middleware/require-role.middleware");
const { validateTogglePublished } = require("../middleware/validate-toggle-published.middleware");

const router = express.Router();

// Get all published blog posts - anyone can read these, they are public
router.get("/public", getPublishedBlogPosts);

// Get all blog posts, published or unpublished
router.get("/", verifyUser, requireWriter, getBlogPosts);

router.post("/", verifyUser, requireWriter, createNewBlogPost);

router.put("/:postId", verifyUser, requireWriter, editBlogPost);

router.put(
  "/publish/:postId",
  verifyUser,
  requireWriter,
  validateTogglePublished, 
  togglePublished,
);

router.delete("/:postId", verifyUser, requireWriter, deleteBlogPost);

module.exports = router;
