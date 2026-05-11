const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Server is running!' });
});
const pool = require('./db');

// Test DB connection
app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ message: 'DB connected!', time: result.rows[0] });
  } catch (err) {
    res.json({ error: err.message });
  }
});

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const todoRoutes = require('./routes/todo');
app.use('/api/todos', todoRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


