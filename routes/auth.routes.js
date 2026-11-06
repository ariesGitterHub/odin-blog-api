const express = require("express");
const {
  signUp,
  logIn,
  writerLogIn,
  logOut,
  getCurrentUser,
} = require("../controllers/auth.controller");

const passwordRules = require("../config/password-rules.config");

const {
  validateSignUp,
} = require("../middleware/validate-signup.middleware.js");

const router = express.Router();

// NOTE - I didn't need to go from "route ➡ controller ➡ service ➡ database" here, rather just "route ➡ config ➡ json", it's just a tiny static configuration endpoint...
router.get("/password-rules", (req, res) => {
  res.json(passwordRules);
});

// Auth Routes
router.post("/signup", validateSignUp, signUp);

// NOTE - below is for Blog Reader app
router.post("/login", logIn);

// NOTE - below is Blog Writer app
router.post("/writer-login", writerLogIn);

router.post("/logout", logOut);

// router.get("/me", verifyUser, getCurrentUser); // NOTE - verifyUser was causing 401 and stopping flow
router.get("/me", getCurrentUser);

module.exports = router;
