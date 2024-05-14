import { prisma } from '../src/lib/prisma';

async function seed() {
  await prisma.user.create({
    data: {
      id: 'd3c740c2-2f95-4f9c-8825-535150f263e4',
      email: 'teste@teste.com',
      password: '$2b$10$KbG8gY4JkMk1Q9vZI6Z1sO4jw4V1J5Zwq2Xbq3yL3g5z7HdQ0zg5S',
      role: 'NON_CAREGIVER',
    },
  });
}

seed().then(() => {
  console.log('Seed complete');
  prisma.$disconnect();
});
