const express = require("express");

const {
  getBlogPosts,
  createNewBlogPost,
  editBlogPost,
  deleteBlogPost,
} = require("../controllers/post.controller")

const { verifyUser } = require("../middleware/verify-user.middleware");
const { requireAdmin } = require("../middleware/require-admin.middleware");

const router = express.Router();

// TODO - add verifyUser to all protected routes

// Posts Routes

router.get("/", verifyUser, getBlogPosts);

router.post("/", verifyUser, requireAdmin, createNewBlogPost);

router.put("/:postId", verifyUser, requireAdmin, editBlogPost);

router.delete("/:postId", verifyUser, requireAdmin, deleteBlogPost);

module.exports = router;
