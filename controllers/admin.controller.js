const {
  checkIfEmailAlreadyExists,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
} = require("../services/user.service.js");

const validRoles = ["USER", "WRITER", "ADMIN"];

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

    // const validRoles = ["USER", "WRITER", "ADMIN"]; // Moved to top

    const { first_name, last_name, role, email, email_verified, password } = req.body;

    const updateData = {};

    // if (first_name) {
    if (first_name !== undefined) {
      // NOTE - use this if admin wants to change a name to an empty string
      updateData.firstName = first_name.trim();
    }

    // if (last_name) {
    if (last_name !== undefined) {
      // NOTE - use this if admin wants to change a name to an empty string
      updateData.lastName = last_name.trim();
    }


    // Now include validRoles
    // if (role) {
    //   updateData.role = role;
    // }

    if (role !== undefined) {
      if (!validRoles.includes(role)) {
        return res.status(400).json({
          error: {
            message: "Invalid user role.",
          },
        });
      }

      updateData.role = role;
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

    // NOTE - do not use this anti-pattern of misusing the ternary operator
    // if (email_verified !== undefined) {
    //   email_verified === "true" ? updateData.emailVerified = true : updateData.emailVerified = false
    // }

    if (email_verified !== undefined && email_verified !== "") {
      updateData.emailVerified = email_verified === "true"; // REMINDER (again) - this naturally resolves to true or false
    }

    if (password) {
      // Reminder - If a user intentionally has a space at the beginning or end, trimming changes their password. So don't use trim below!
      updateData.password = password;
    }

    // NOTE - below handles scenarios where admin submits an update without supplying any fields
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        error: {
          message: "No valid fields provided for update.",
        },
      });
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

    // Checks if the currentUser is an admin and if that admin is trying to delete any admin role
    if (currentUserRole === "ADMIN" && userViewed.role === "ADMIN") {
      return res.status(403).json({
        error: {
          message: "Administrators cannot delete any ADMIN role.",
        },
      });
    }

    const adminDeletedUser = await deleteUser(userId);

    return res.status(200).json({
      adminDeletedUser,
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
