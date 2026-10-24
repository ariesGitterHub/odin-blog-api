const prisma = require("../lib/prisma");
const bcrypt = require("bcryptjs");

// async function getAllUsers() {
//   return prisma.user.findMany({
//     select: {
//       id: true,
//       firstName: true,
//       lastName: true,
//       email: true,
//       role: true,
//       emailVerified: true,
//       createdAt: true,
//       updatedAt: true,
//       lastLoginAt: true,
//     },
//     orderBy: {
//       createdAt: "desc",
//     },
//   });
// }

module.exports = {
  getAllUsers,
};
