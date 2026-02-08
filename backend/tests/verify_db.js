import prisma from '../src/config/db.js';

async function verifyUser() {
  try {
    const users = await prisma.user.findMany();
    console.log('✅ Total users in Neon DB:', users.length);
    if (users.length > 0) {
      console.log('\nRecent users:');
      users.slice(-3).forEach(u => {
        console.log(`  - ${u.name} (${u.email}) - Created: ${u.createdAt}`);
      });
    }
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

verifyUser();
