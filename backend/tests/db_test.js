import axios from 'axios';
import prisma from '../src/config/db.js';
import { spawn } from 'child_process';

const BASE_URL = 'http://localhost:8000';

async function test() {
  // Start the server
  console.log('Starting server...');
  const server = spawn('node', ['index.js'], { cwd: '.', stdio: 'inherit' });

  // Wait for server to boot
  await new Promise(resolve => setTimeout(resolve, 2000));

  try {
    const testEmail = `test_${Date.now()}@example.com`;
    const dummy = { 
      name: 'Test User', 
      email: testEmail, 
      password: 'Password123' 
    };

    console.log('\n=== Testing /auth/register ===');
    const regRes = await axios.post(`${BASE_URL}/auth/register`, dummy);
    console.log('Response:', regRes.data);

    console.log('\n=== Testing /auth/login ===');
    const loginRes = await axios.post(`${BASE_URL}/auth/login`, { 
      email: dummy.email, 
      password: dummy.password 
    });
    console.log('Response:', loginRes.data);

    console.log('\n=== Checking database ===');
    const userInDb = await prisma.user.findUnique({ where: { email: testEmail } });
    if (userInDb) {
      console.log('✅ User found in database:');
      console.log({ id: userInDb.id, name: userInDb.name, email: userInDb.email });
    } else {
      console.log('❌ User NOT found in database');
    }
  } catch (err) {
    console.error('Error:', err.message);
    if (err.response) console.error('Response:', err.response.data);
  } finally {
    await prisma.$disconnect();
    server.kill();
    process.exit(0);
  }
}

test();
