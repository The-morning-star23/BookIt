import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Helper function to create dates in the future
function getFutureDate(dayOffset: number, hour: number) {
  const date = new Date();
  date.setDate(date.getDate() + dayOffset);
  date.setHours(hour, 0, 0, 0); // Set time and reset minutes/seconds
  return date;
}

// Helper function to create an end time (1 hour later)
function getEndTime(startTime: Date) {
  const endTime = new Date(startTime.getTime());
  endTime.setHours(endTime.getHours() + 1);
  return endTime;
}

const experiencesData = [
  {
    title: 'Kayaking',
    description:
      'Curated small-group experience. Certified guide. Safety first with gear included.',
    price: 999,
    location: 'Udupi',
    imageUrl: '/images/kayaking.jpg',
  },
  {
    title: 'Nandi Hills Sunrise',
    description:
      'Curated small-group experience. Certified guide. Safety first with gear included.',
    price: 899,
    location: 'Bangalore',
    imageUrl: '/images/nandi.jpg',
  },
  {
    title: 'Coffee Trail',
    description:
      'Curated small-group experience. Certified guide. Safety first with gear included.',
    price: 1299,
    location: 'Coorg',
    imageUrl: '/images/coffee.jpg',
  },
  {
    title: 'Coastal Kayaking',
    description:
      'Curated small-group experience. Certified guide. Safety first with gear included.',
    price: 999,
    location: 'Udupi, Karnataka',
    imageUrl: '/images/kayaking1.jpg',
  },
  {
    title: 'Nandi Hills sunrise',
    description:
      'Curated small-group experience. Certified guide. Safety first with gear included.',
    price: 899,
    location: 'Bangalore',
    imageUrl: '/images/nandi hills.jpg',
  },
  {
    title: 'Boat Cruise',
    description:
      'Curated small-group experience. Certified guide. Safety first with gear included.',
    price: 999,
    location: 'Sunderban',
    imageUrl: '/images/boat.jpg',
  },
  {
    title: 'Bungee Jumping',
    description:
      'Curated small-group experience. Certified guide. Safety first with gear included.',
    price: 999,
    location: 'Manali',
    imageUrl: '/images/bunjee.jpg',
  },
  {
    title: 'Jungle Mist Trail',
    description:
      'Curated small-group experience. Certified guide. Safety first with gear included.',
    price: 1299,
    location: 'Coorg',
    imageUrl: '/images/coffee trail.jpg',
  },
];

async function main() {
  console.log('Start seeding ...');

  // --- Clean up old data ---
  await prisma.booking.deleteMany();
  await prisma.slot.deleteMany();
  await prisma.experience.deleteMany();
  console.log('Deleted old bookings, slots, and experiences.');

  // --- Create Experiences ---
  for (const exp of experiencesData) {
    const experience = await prisma.experience.create({
      data: exp,
    });
    console.log(`Created experience: ${experience.title}`);

    // --- Create slots for the next 5 days ---
    for (let i = 0; i < 5; i++) {
      // Create 4 time slots for each day
      await prisma.slot.createMany({
        data: [
          // 7:00 AM - 4 left
          {
            startTime: getFutureDate(i, 7),
            endTime: getEndTime(getFutureDate(i, 7)),
            totalSpots: 10,
            spotsAvailable: 4,
            experienceId: experience.id,
          },
          // 9:00 AM - 2 left
          {
            startTime: getFutureDate(i, 9),
            endTime: getEndTime(getFutureDate(i, 9)),
            totalSpots: 10,
            spotsAvailable: 2,
            experienceId: experience.id,
          },
          // 11:00 AM - 5 left
          {
            startTime: getFutureDate(i, 11),
            endTime: getEndTime(getFutureDate(i, 11)),
            totalSpots: 10,
            spotsAvailable: 5,
            experienceId: experience.id,
          },
          // 1:00 PM (13:00) - Sold out
          {
            startTime: getFutureDate(i, 13),
            endTime: getEndTime(getFutureDate(i, 13)),
            totalSpots: 10,
            spotsAvailable: 0,
            experienceId: experience.id,
          },
        ],
      });
    }
    console.log(`Created 20 slots (5 days x 4 times) for ${experience.title}`);
  }

  console.log('Seeding finished.');
}

main()
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });