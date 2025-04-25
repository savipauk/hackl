import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.event.createMany({
    data: [
      { name: 'City Marathon', date: new Date('2025-05-15') },
      { name: 'Local Football Final', date: new Date('2025-06-01') },
    ],
  });
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());

