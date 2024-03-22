import { PrismaClient } from "@prisma/client";

let _prisma: PrismaClient;

// Singleton pattern to create and export Prisma Client instance
function getPrismaClient() {
  if (!_prisma) {
    _prisma = new PrismaClient();
  }
  return _prisma;
}

const prisma = getPrismaClient();

export { prisma };
