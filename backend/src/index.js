const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const prisma = require('./lib/prisma');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Backend is working' });
});

app.get('/api/test-db', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    res.json({
      message: 'Database connection works',
      users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Database query failed',
    });
  }
});

app.post('/api/auth/register', (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({
      error: 'email, password and role are required',
    });
  }

  return res.status(201).json({
    message: 'Register endpoint works',
    user: {
      email,
      role,
    },
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});