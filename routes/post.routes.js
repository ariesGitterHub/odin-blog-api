const express = require("express");

const { verifyUser } = require("../middleware/verify-user.middleware");
const { requireAdmin } = require("../middleware/require-admin.middleware");

const router = express.Router();

// TODO - add verifyUser to all protected routes

// Posts Routes

// router.post("/", verifyUser, requireAdmin, createNewBlogPost);

// router.put("/:postId", verifyUser, requireAdmin, updatePost);

// router.delete("/:postId", verifyUser, requireAdmin, deleteBlogPost);

module.exports = router;
