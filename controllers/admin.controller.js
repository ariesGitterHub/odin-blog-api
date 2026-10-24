// const bcrypt = require("bcryptjs"); // TODO - should this be handled in the service? Answer is NO!
require("dotenv/config");
// const { validationResult } = require("express-validator");
// const {
//   formatValidationErrors,
// } = require("../utils/format-validation-errors.utils.js");
const { getAllUsers, deleteUser } = require("../services/user.service.js");

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

async function deleteUserByAdmin(req,res, next) {
    try {
    const userId = req.params.userId;
    const user = await deleteUser(userId);

    return res.status(200).json({
      user,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getUsersForAdmin,
  deleteUserByAdmin,
};
