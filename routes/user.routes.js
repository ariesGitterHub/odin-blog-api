const express = require("express");
const {
  updateProfile,
  deleteProfile,
} = require("../controllers/user.controller");
const {
  validateProfileUpdate,
} = require("../middleware/validate-profile-update.middleware.js")

const { verifyUser } = require("../middleware/verify-user.middleware.js");

const router = express.Router();

router.put("/profile", verifyUser, validateProfileUpdate, updateProfile);

router.delete("/profile", verifyUser, deleteProfile);

module.exports = router;