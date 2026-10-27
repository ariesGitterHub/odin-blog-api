// const bcrypt = require("bcryptjs"); // TODO - should this be handled in the service? Answer is NO!
require("dotenv/config");
// const { validationResult } = require("express-validator");
// const {
//   formatValidationErrors,
// } = require("../utils/format-validation-errors.utils.js");
const {
  checkIfEmailAlreadyExists,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
} = require("../services/user.service.js");

async function getUsersForAdmin(req, res, next) {
  try {
    const users = await getAllUsers();

    return res.status(200).json({
      users,
    });
  } catch (err) {
    next(err);
  }
}

async function getOneUserForAdmin(req, res, next) {
  try {
    const userId = req.params.userId;
    const user = await getUser(userId);

    return res.status(200).json({
      user,
    });
  } catch (err) {
    next(err);
  }
}

async function updateUserByAdmin(req, res, next) {
  try {
    const userId = req.params.userId;

    const validRoles = ["USER", "WRITER", "ADMIN"];

    const { first_name, last_name, role, email, password } = req.body;

    const updateData = {};

    if (first_name) {
      updateData.firstName = first_name.trim();
    }

    if (last_name) {
      updateData.lastName = last_name.trim();
    }

    if (role) {
      // updateData.role = last_name.trim();
      updateData.role = role.trim();
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

async function deleteUserByAdmin(req, res, next) {
  try {
    const userId = req.params.userId;
    const currentUserRole = req.user.role;

    const userViewed = await getUser(userId);

    // check if the currentUser is an admin and if that admin is trying to delete any admin role

    if (currentUserRole === "ADMIN" && userViewed.role === "ADMIN") {
      return res.status(403).json({
        error: {
          message: "Administrators cannot delete any ADMIN role.",
        },
      });
    }

    const adminDeleteUser = await deleteUser(userId);

    return res.status(200).json({
      adminDeleteUser,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getUsersForAdmin,
  getOneUserForAdmin,
  updateUserByAdmin,
  deleteUserByAdmin,
};
