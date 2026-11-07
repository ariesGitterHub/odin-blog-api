const {
  checkIfEmailAlreadyExists,
  updateUser,
  deleteUser,
} = require("../services/user.service.js");

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

    await deleteUser(userId);

    return res.sendStatus(204);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  updateProfile,
  deleteProfile,
};
