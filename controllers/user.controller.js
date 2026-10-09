// const bcrypt = require("bcryptjs"); // TODO - should this be handled in the service? Answer is NO!
require("dotenv/config");
const { validationResult } = require("express-validator");
const {
  formatValidationErrors,
} = require("../utils/format-validation-errors.utils.js");
const {
  // createUser,
  checkIfEmailAlreadyExists,
  // getUser,
  // getUsers, // TODO - add to admin controller later
  updateUser,
  deleteUser,
} = require("../services/user.service.js");

// Not needed now, maybe if I make an admin page...
// NOTE - since the httpOnly cookie has the user's info, is this even needed if an admin page is not created???
// async function getUser(req, res, next) {
//   try {
//   } catch (err) {
//     next(err);
//   }
// }

// Not needed mow, maybe if I make an admin page...
// async function getUsers(req, res, next) {
//   try {
//   } catch (err) {
//     next(err);
//   }
// }

// Do I need to push req.body variables into updateData?
// MOST IMPORTANTLY: What data format is best for both frontend and backend for updateProfile? Use userId, userData, or userID with all the items delineated out?
// Remember that updateProfile and deleteProfile will need the user's id (and that deleteProfile will need a guard against role === "ADMIN" from self deleting...but that comes later)

async function updateProfile(req, res, next) {
  try {
    const userId = req.user.userId;

    const { first_name, last_name, email, password } = req.body;

    const updateData = {};

    if (first_name) {
      updateData.firstName = first_name.trim();
    }

    if (last_name) {
      updateData.lastName = last_name.trim();
    }

    if (email) {
      // NOTE - checking the frontend first is useful for giving the frontend a nice, dedicated 409 response, but the database constraint remains the real protection.
      const existingUser = await checkIfEmailAlreadyExists(
        email.trim().toLowerCase(),
        userId,
      );

      if (existingUser) {
        return res.status(409).json({
          error: {
            message: "An account with that email already exists.",
          },
        });
      }

      updateData.email = email.trim().toLowerCase();
    }

    if (password) {
      // Reminder - If a user intentionally has a space at the beginning or end, trimming changes their password. So don't use trim below!
      updateData.password = password;
    }

    const user = await updateUser(userId, updateData);

    return res.status(200).json({
      user,
    });
  } catch (err) {
    next(err);
  }
}

async function deleteProfile(req, res, next) {
  try {
    const userId = req.user.userId;
    const userRole = req.user.role;

    if (userRole === "ADMIN") {
      return res.status(403).json({
        error: {
          message: "Administrators cannot delete their own account.",
        },
      });
    }
    console.log("userId = ", userId);
    
    await deleteUser(userId);

    return res.sendStatus(204);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  // getUser, // TODO - later???
  // getUsers, // TODO - later???
  updateProfile,
  deleteProfile,
};
