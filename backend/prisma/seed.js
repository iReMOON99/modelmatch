const { PrismaClient } = require('../node_modules/.prisma/client')
const bcrypt = require('bcrypt')
require('dotenv').config()

const prisma = new PrismaClient()

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 10);
  const modelPassword = await bcrypt.hash('model123', 10);
  const agencyPassword = await bcrypt.hash('agency123', 10);

  console.log('Seeding admin...')
  const admin = await prisma.user.upsert({
    where: { email: 'admin@modelmatch.com' },
    update: {},
    create: {
      email: 'admin@modelmatch.com',
      passwordHash: adminPassword,
      role: 'ADMIN',
    },
  });

  console.log('Seeding model...')
  const modelUser = await prisma.user.upsert({
    where: { email: 'model@modelmatch.com' },
    update: {},
    create: {
      email: 'model@modelmatch.com',
      passwordHash: modelPassword,
      role: 'MODEL',
      modelProfile: {
        create: {
          displayName: 'Anna Smith',
          age: 22,
          country: 'USA',
          city: 'New York',
          height: 175,
          measurements: '90-60-90',
          bio: 'Professional fashion model with 3 years experience.',
          experience: 'Fashion Week, Vogue covers',
          photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800',
          isVerified: true,
          isActive: true,
        },
      },
    },
  });

  console.log('Seeding agency...')
  const agencyUser = await prisma.user.upsert({
    where: { email: 'agency@modelmatch.com' },
    update: {},
    create: {
      email: 'agency@modelmatch.com',
      passwordHash: agencyPassword,
      role: 'AGENCY',
      agencyProfile: {
        create: {
          companyName: 'Elite Models',
          country: 'France',
          city: 'Paris',
          description: 'Top global modeling agency based in Paris.',
          website: 'https://elitemodels.com',
          instagram: '@elitemodels',
          isVerified: true,
          isActive: true,
        },
      },
    },
  });

  console.log('Seed done');
  console.log({ admin, modelUser, agencyUser });
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
