import express from 'express';
import axios from 'axios';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const app = express();
app.use(express.json());
const users = new Map();

app.post('/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });
  if (users.has(email)) return res.status(400).json({ message: 'User already exists' });
  const hashed = await bcrypt.hash(password, 10);
  const user = { id: Date.now().toString(), name, email, password: hashed, passwordHash: hashed };
  users.set(email, user);
  res.json({ message: 'User registered', userDetails: { name, email } });
});

app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.get(email);
  if (!user) return res.status(400).json({ message: 'User not found' });
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: 'Invalid password' });
  const token = jwt.sign({ id: user.id, email: user.email }, 'testsecret');
  res.json({ message: 'success', userDetails: { name: user.name, email: user.email }, token });
});

const server = app.listen(4000, async () => {
  console.log('Test server listening on port 4000');
  try {
    const base = 'http://localhost:4000/auth';
    const dummy = { name: 'Test User', email: 'test@example.com', password: 'Password123' };

    const reg = await axios.post(`${base}/register`, dummy);
    console.log('/register response:', reg.data);

    const login = await axios.post(`${base}/login`, { email: dummy.email, password: dummy.password });
    console.log('/login response:', login.data);
  } catch (err) {
    if (err.response) console.error('Error response:', err.response.data);
    else console.error(err);
  } finally {
    server.close(() => process.exit(0));
  }
});
