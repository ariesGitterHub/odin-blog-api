// Create a new user
// Find a user by ID
// Find a user by email
// Potentially update user information later

const prisma = require("../lib/prisma");
const bcrypt = require("bcryptjs");

// Checks if the email already exists at sign-up for writing posts (if additional writers making posts are added later) and for those signing up to comment on posts
// Comment out until needed...
async function checkIfEmailExistsForSignUp(email) {
  return prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });
}

// Checks if the email already exists when any user chooses to update their profile (poster or commenter)
// Comment out until needed...
// async function checkIfEmailAlreadyExists(email, targetId) {
//   return prisma.user.findFirst({
//     where: {
//       email,
//       NOT: {
//         id: targetId,
//       },
//     },
//     select: {
//       id: true,
//     },
//   });
// }

// createUser is only for creating a commenter, not a poster 
// The blog writer/poster already exist in the db via seed.js, so no need to create for them
async function createUser({
  firstName,
  lastName,
  email,
  password,
  // role, // defaults to USER
  // emailVerified, // defaults to false
}) {
  const passwordHash = await bcrypt.hash(password, 12);

  return prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      passwordHash,
      // role, // defaults to USER
      // emailVerified, // defaults to false
    },
  });
}

async function getUser(userId) {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      emailVerified: true,
    },
  });
}

async function getUsers() {
  return prisma.user.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      emailVerified: true,
      // TODO - add more details from schema
    },
  });
}

async function updateUser(userId, userData) {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data: userData,
  });
}

async function deleteUser(userId) {
  return prisma.user.delete({
    where: {
      id: userId,
    }
  })
}

module.exports = {
  checkIfEmailExistsForSignUp,
  // checkIfEmailAlreadyExists,
  createUser,
  getUser,
  getUsers,
  updateUser,
  deleteUser,
};
