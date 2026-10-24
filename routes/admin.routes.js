const express = require("express");

const {
  getUsersForAdmin,
  deleteUserByAdmin,
} = require("../controllers/admin.controller.js");

const { verifyUser } = require("../middleware/verify-user.middleware.js");
const {
  requireAdmin,
  // requireWriter,
} = require("../middleware/require-role.middleware");
const router = express.Router();

router.get(
  "/",
  //  verifyUser,
  //   requireAdmin,
     getUsersForAdmin);

// router.put("/", verifyUser, requireAdmin, createxxx);

// router.put("/:userId", verifyUser, requireAdmin, editxxx);

router.delete(
  "/:userId",
  //  verifyUser,
  //   requireAdmin,
     deleteUserByAdmin);

module.exports = router;
