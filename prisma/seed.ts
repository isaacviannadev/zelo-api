import { prisma } from '../src/lib/prisma';

async function seed() {
  await prisma.event.create({
    data: {
      id: 'd3c740c2-2f95-4f9c-8825-535150f263e4',
      title: 'Event Frontend',
      details: 'Event Frontend description just for testing',
      slug: 'event-frontend',
      maximumAttendees: 120,
    },
  });
}

seed().then(() => {
  console.log('Seed complete');
  prisma.$disconnect();
});
