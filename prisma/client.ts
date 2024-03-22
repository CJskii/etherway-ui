import { PrismaClient } from "@prisma/client";

let _prisma: PrismaClient;

// Singleton pattern to create and export Prisma Client instance
function getPrismaClient() {
  if (!_prisma) {
    _prisma = new PrismaClient();
    console.log("New client initiated");
  } else {
    console.log("Old client initiated");
  }
  return _prisma;
}

const prisma = getPrismaClient();

export { prisma };
