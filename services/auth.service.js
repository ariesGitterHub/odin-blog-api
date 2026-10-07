const prisma = require("../lib/prisma");
const bcrypt = require("bcryptjs");

async function verifyLogin(email, password) {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      firstName: true, // New
      lastName: true, // New
      email: true,
      passwordHash: true, // I need passwordHash temporarily because bcrypt.compare() needs it
      role: true,
    },
  });

  if (!user) {
    return null;
  }

  const passwordValid = await bcrypt.compare(password, user.passwordHash);

  if (!passwordValid) {
    return null;
  }

  return {
    // REMINDER - that passwordHash is NOT returned on purpose!!!
    id: user.id,
    firstName: user.firstName, // Newly added for frontend
    lastName: user.lastName, // New added for frontend
    email: user.email,
    role: user.role,
  };
}

async function getUserById(userId) {
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
    },
  });
}

module.exports = {
  verifyLogin,
  getUserById,
};
