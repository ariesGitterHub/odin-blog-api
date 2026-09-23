// const bcrypt = require("bcryptjs");
require("dotenv/config");
const { validationResult } = require("express-validator");
const { formatValidationErrors } = require("../utils/formatValidationErrors");
const { verifyLogin } = require("../services/auth.service.js");
const {
  createUser,
  checkIfEmailExistsForSignUp,
} = require("../services/user.service.js");
const jwt = require("jsonwebtoken");

// NOTE - Because I'm using Express 5, I don't need the try/catch merely to forward rejected async operations to your error middleware. However, keeping the try/catch for now is fine.

async function signUp(req, res, next) {
  try {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      const errors = formatValidationErrors(validationErrors);
      return res.status(400).json({
        errors,
      });
    }

    const { first_name, last_name, email, password } = req.body;

    // NOTE - checking the frontend first is useful for giving the frontend a nice, dedicated 409 response, but the database constraint remains the real protection.
    const existingUser = await checkIfEmailExistsForSignUp(
      email.trim().toLowerCase(),
    );

    if (existingUser) {
      return res.status(409).json({
        error: {
          message: "An account with that email already exists.",
        },
      });
    }

    const user = await createUser({
      firstName: first_name,
      lastName: last_name,
      email: email.trim().toLowerCase(),
      password,
    });

    return res.status(201).json({
      user,
    });
  } catch (err) {
    next(err);
  }
}

async function logIn(req, res, next) {
  try {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      const errors = formatValidationErrors(validationErrors);

      return res.status(400).json({
        errors,
      });
    }

    const { email, password } = req.body;

    const normalizedEmail = email.trim().toLowerCase();

    const user = await verifyLogin(normalizedEmail, password);

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const accessToken = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 3600000,
    });

    return res.status(200).json({
      success: true,
      user: user,
    });
  } catch (err) {
    console.error("Login controller error:", err);
    return res.status(500).json({ message: "Internal server error." });
    // next(err);
  }
}

// Work on logIn next
async function logOut(req, res, next) {
  try {
    console.log();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  signUp,
  logIn,
  logOut,
};
