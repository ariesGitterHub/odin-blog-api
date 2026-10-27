const express = require("express");

const {
  getUsersForAdmin,
  getOneUserForAdmin,
  updateUserByAdmin,
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
   verifyUser,
    requireAdmin,
     getUsersForAdmin);

router.get("/:userId", verifyUser, requireAdmin, getOneUserForAdmin);

router.put(
  "/:userId",
   verifyUser,
    requireAdmin,
     updateUserByAdmin);

router.delete(
  "/:userId",
   verifyUser,
    requireAdmin,
     deleteUserByAdmin);

module.exports = router;
