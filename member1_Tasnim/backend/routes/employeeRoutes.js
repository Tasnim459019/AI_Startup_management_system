const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../config/db');
const authenticate = require('../middleware/auth');

router.use(authenticate);

// GET all employees in this workspace
router.get('/', (req, res) => {
  const sql = 'SELECT id, name, email, role, skills, created_at FROM users WHERE role = "employee" AND manager_id = ?';
  db.query(sql, [req.user.workspaceId], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching employees', error: err.message });
    res.status(200).json(results);
  });
});

// ADD a new employee — only managers can do this
router.post('/', (req, res) => {
  if (req.user.role !== 'manager') {
    return res.status(403).json({ message: 'Only managers can add employees' });
  }

  const { name, email, password, skills } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const sql = 'INSERT INTO users (name, email, password, role, manager_id, skills) VALUES (?, ?, ?, "employee", ?, ?)';
  db.query(sql, [name, email, hashedPassword, req.user.id, skills || null], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error adding employee', error: err.message });
    res.status(201).json({ message: 'Employee added successfully!', employeeId: result.insertId });
  });
});

// GET a single employee
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT id, name, email, role, skills, created_at FROM users WHERE id = ? AND manager_id = ?';
  db.query(sql, [id, req.user.workspaceId], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching employee', error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Employee not found' });
    res.status(200).json(results[0]);
  });
});

// DELETE an employee
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM users WHERE id = ? AND manager_id = ?', [id, req.user.workspaceId], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error deleting employee', error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Employee not found' });
    res.status(200).json({ message: 'Employee deleted successfully!' });
  });
});

module.exports = router;
