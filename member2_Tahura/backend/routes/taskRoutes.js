const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authenticate = require('../middleware/auth');

router.use(authenticate);

// GET all tasks for this workspace
router.get('/', (req, res) => {
  db.query('SELECT * FROM tasks WHERE manager_id = ? ORDER BY created_at DESC', [req.user.workspaceId], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching tasks', error: err.message });
    res.status(200).json(results);
  });
});

// CREATE a new task in this workspace
router.post('/', (req, res) => {
  const { title, description, status, assigned_to, due_date } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Task title is required' });
  }

  const sql = 'INSERT INTO tasks (title, description, status, assigned_to, due_date, manager_id) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(sql, [title, description, status || 'pending', assigned_to || null, due_date || null, req.user.workspaceId], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error creating task', error: err.message });
    res.status(201).json({ message: 'Task created successfully!', taskId: result.insertId });
  });
});

// UPDATE a task (only within this workspace)
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, status, assigned_to, due_date } = req.body;

  const sql = `UPDATE tasks SET title = ?, description = ?, status = ?, assigned_to = ?, due_date = ? WHERE id = ? AND manager_id = ?`;
  db.query(sql, [title, description, status, assigned_to, due_date, id, req.user.workspaceId], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error updating task', error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Task not found' });
    res.status(200).json({ message: 'Task updated successfully!' });
  });
});

// DELETE a task (only within this workspace)
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM tasks WHERE id = ? AND manager_id = ?', [id, req.user.workspaceId], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error deleting task', error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Task not found' });
    res.status(200).json({ message: 'Task deleted successfully!' });
  });
});

module.exports = router;
