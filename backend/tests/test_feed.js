import axios from 'axios';

const BASE_URL = 'http://localhost:8000';

async function testFeedEndpoint() {
  try {
    console.log('Testing /feed endpoint...\n');
    
    const response = await axios.get(`${BASE_URL}/feed`);
    
    console.log('Status:', response.status);
    console.log('Response data:');
    console.log(JSON.stringify(response.data, null, 2));
    
    if (Array.isArray(response.data)) {
      console.log(`\n✓ Received ${response.data.length} asteroids`);
      
      if (response.data.length > 0) {
        console.log('\nSample asteroid:');
        console.log(response.data[0]);
      }
    }
    
  } catch (error) {
    console.error('Error testing /feed endpoint:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else if (error.message) {
      console.error('Message:', error.message);
    } else {
      console.error('Full error:', error);
    }
    console.error('\nStack trace:', error.stack);
  }
}

testFeedEndpoint();
