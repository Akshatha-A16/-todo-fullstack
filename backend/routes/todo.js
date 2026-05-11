const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET all todos
router.get('/', async (req, res) => {
  try {
    const todos = await pool.query(
      'SELECT * FROM todos ORDER BY created_at DESC'
    );
    res.json(todos.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE todo
router.post('/', async (req, res) => {
  try {
    const { title, user_id } = req.body;
    const newTodo = await pool.query(
      'INSERT INTO todos (title, user_id) VALUES ($1, $2) RETURNING *',
      [title, user_id]
    );
    res.json(newTodo.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE todo
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM todos WHERE id = $1', [id]);
    res.json({ message: 'Todo deleted!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE todo (mark complete)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTodo = await pool.query(
      'UPDATE todos SET completed = NOT completed WHERE id = $1 RETURNING *',
      [id]
    );
    res.json(updatedTodo.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;