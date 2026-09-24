require("dotenv/config");
const express = require("express");
const { signUp, logIn, logOut } = require("../controllers/auth.controller");
// const { verifyUser } = require("../middleware/verify-user.middleware");
const passwordRules = require("../config/password-rules.config");
const { validateSignUp } = require("../middleware/validate-signup.middleware.js");
const router = express.Router();

// NOTE - I didn't need to go from "route ➡ controller ➡ service ➡ database" here, rather just "route ➡ config ➡ json", it's just a tiny static configuration endpoint...
router.get("/password-rules", (req, res) => {
  res.json(passwordRules);
});

// Auth Routes
router.post("/signup", validateSignUp, signUp);
router.post("/login", logIn);
router.post("/logout", logOut);

module.exports = router;
