const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.setting.upsert({
    where: { key: 'supportEmail' },
    update: {},
    create: { key: 'supportEmail', value: 'reliontomx@Gmail.com' }
  });
  console.log('Seeded supportEmail');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
