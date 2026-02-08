import axios from 'axios';

async function test() {
  try {
    console.log('Testing basic GET /');
    const res = await axios.get('http://localhost:8000/');
    console.log('✅ Response:', res.data);
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

test();
