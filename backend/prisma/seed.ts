import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 10);
  const modelPassword = await bcrypt.hash('model123', 10);
  const agencyPassword = await bcrypt.hash('agency123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@modelmatch.com' },
    update: {},
    create: {
      email: 'admin@modelmatch.com',
      passwordHash: adminPassword,
      role: 'ADMIN',
    },
  });

  const modelUser = await prisma.user.upsert({
    where: { email: 'model@modelmatch.com' },
    update: {},
    create: {
      email: 'model@modelmatch.com',
      passwordHash: modelPassword,
      role: 'MODEL',
    },
  });

  const agencyUser = await prisma.user.upsert({
    where: { email: 'agency@modelmatch.com' },
    update: {},
    create: {
      email: 'agency@modelmatch.com',
      passwordHash: agencyPassword,
      role: 'AGENCY',
    },
  });

  console.log('Seed done');
  console.log({ admin, modelUser, agencyUser });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });