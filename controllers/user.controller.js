const {
  // createUser,
  getUser,
  getUsers, // TODO - add to admin controller later
  updateUser,
  deleteUser,
} = require("../services/user.service.js");

async function getUser(req, res, next) {
  try {
    
  } catch (err) {
    next(err);
  }
}

// TODO - add to admin controller later
async function getUsers(req, res, next) {
  try {
  } catch (err) {
    next(err);
  }
}

async function updateUser(req, res, next) {
  try {
  } catch (err) {
    next(err);
  }
}

async function deleteUser(req, res, next) {
  try {
  } catch (err) {
    next(err);
  }
}


module.exports = {
  getUser,
  getUsers, // TODO - add to admin controller later
  updateUser,
  deleteUser,
};