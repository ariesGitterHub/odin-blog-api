require("dotenv/config");
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function seed() {
  // await prisma.user.deleteMany() // Clear existing data first, comment out otherwise

  // Temp password hashes for dev
  if (!process.env.MMM_PASSWORD || !process.env.MMM_EMAIL) {
    throw new Error("MMM_PASSWORD or MMM_EMAIL is not defined");
  }

  const hash = await bcrypt.hash(process.env.MMM_PASSWORD, 12);

  // Create admin user
  const admin = await prisma.user.create({
    data: {
      firstName: "Mad Muffin Man",
      lastName: "Dude",
      email: process.env.MMM_EMAIL,
      passwordHash: hash,
      role: "ADMIN",
      emailVerified: true,
    },
  });

  const user = await prisma.user.create({
    data: {
      firstName: "Joe",
      lastName: "User",
      email: "joe@user.com",
      passwordHash: hash,
      role: "USER",
      emailVerified: true,
    },
  });
}

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
