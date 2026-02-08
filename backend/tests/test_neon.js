import axios from 'axios';

const BASE_URL = 'http://localhost:8000';

async function test() {
  try {
    const testEmail = `test_${Date.now()}@example.com`;
    const dummy = { 
      name: 'Real Test User', 
      email: testEmail, 
      password: 'Password123' 
    };

    console.log('\n=== Testing /auth/register ===');
    const regRes = await axios.post(`${BASE_URL}/auth/register`, dummy);
    console.log('✅ Register Response:', regRes.data);

    console.log('\n=== Testing /auth/login ===');
    const loginRes = await axios.post(`${BASE_URL}/auth/login`, { 
      email: dummy.email, 
      password: dummy.password 
    });
    console.log('✅ Login Response:', loginRes.data);

    console.log('\n✅ User should now be in your Neon DB!');
  } catch (err) {
    console.error('❌ Error:', err.message);
    if (err.response) console.error('Response:', err.response.data);
  }
}

test();
