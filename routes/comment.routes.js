const express = require("express");

const { createNewBlogComment, editBlogComment, deleteBlogComment } = require("../controllers/comment.controller");

const { verifyUser } = require("../middleware/verify-user.middleware");

const router = express.Router();

router.post("/:postId", verifyUser, createNewBlogComment);
router.put("/:postId/:commentId", verifyUser, editBlogComment);
router.delete("/:postId/:commentId", verifyUser, deleteBlogComment);

module.exports = router;
