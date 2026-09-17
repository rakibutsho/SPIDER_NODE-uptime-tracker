const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();
async function main() {
  try {
    const monitors = await prisma.monitor.findMany();
    console.log("Success:", monitors.length);
  } catch (e) {
    console.error("Error:", e);
  } finally {
    await prisma.$disconnect();
  }
}
main();
