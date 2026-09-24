const express = require("express");

const { verifyUser } = require("../middleware/verify-user.middleware");

const router = express.Router();

// TODO - add verifyUser to all protected routes

// Comments Routes
// router.post("/comments", verifyUser, createComment);
// router.put("/comments/:id", verifyUser, updateComment);
// router.delete("/comments/:id", verifyUser, deleteComment);

module.exports = router;
