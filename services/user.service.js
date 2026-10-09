const prisma = require("../lib/prisma");
const bcrypt = require("bcryptjs");

// Checks if the email already exists at sign-up for writing posts (if additional writers making posts are added later) and for those signing up to comment on posts
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
async function checkIfEmailAlreadyExists(email, userId) {
  return prisma.user.findFirst({
    where: {
      email,
      NOT: {
        id: userId,
      },
    },
    select: {
      id: true,
    },
  });
}

// createUser is only for creating a commenter, not a poster 
// The blog writer/poster already exist in the db via seed.js, so no need to create for them
async function createUser({
  firstName,
  lastName,
  email,
  password,
  // role, // defaults to USER for blog commenters, on blog writer is admin
  // emailVerified, // defaults to false // TODO - keep? Reset schema and db if not keeping
}) {
  const passwordHash = await bcrypt.hash(password, 12);

  return prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      passwordHash,
      // role, // defaults to USER // defaults to USER for blog commenters, on blog writer is admin
      // emailVerified, // defaults to false // TODO - keep? Reset schema and db if not keeping
    },
  });
}

// Not needed now, maybe if I make an admin page...

// async function getUser(userId) {
//   return prisma.user.findUnique({
//     where: {
//       id: userId,
//     },
//     select: {
//       id: true,
//       firstName: true,
//       lastName: true,
//       email: true,
//       role: true,
//       // emailVerified: true,
//     },
//   });
// }

// Not needed now, maybe if I make an admin page...
// async function getUsers() {
//   return prisma.user.findMany({
//     select: {
//       id: true,
//       firstName: true,
//       lastName: true,
//       email: true,
//       role: true,
//       // emailVerified: true,
//       // TODO - add more details from schema
//     },
//   });
// }

async function updateUser(userId, userData) {
  const { password, ...profileData } = userData;
  // NOTE - This is how userData is properly destructured to grab password and hash it
  if (password) {
    profileData.passwordHash = await bcrypt.hash(password, 12);
  }

  // NOTE - Conceptually important(!!!): use select below to keep passwordHash inside the service/database layer, so that it never reaches the frontend via a returned object
  // Use the service layer to enforce what data crosses the backend/frontend boundary
  return prisma.user.update({
    where: {
      id: userId,
    },
    data: profileData,
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
    },
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
  checkIfEmailAlreadyExists,
  createUser,
  // getUser,
  // getUsers,
  updateUser,
  deleteUser,
};
