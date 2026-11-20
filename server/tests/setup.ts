import { beforeAll, afterAll } from 'vitest';
import { prisma } from '../src/config/prisma';

beforeAll(async () => {
  // Ensure test database is clean before running test suite
  await prisma.lead.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  // Clean up and disconnect Prisma
  await prisma.lead.deleteMany();
  await prisma.user.deleteMany();
  await prisma.$disconnect();
});
