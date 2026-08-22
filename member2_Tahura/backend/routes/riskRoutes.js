const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authenticate = require('../middleware/auth');

router.use(authenticate);

router.get('/', (req, res) => {
  db.query('SELECT * FROM risks WHERE manager_id = ? ORDER BY created_at DESC', [req.user.workspaceId], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching risks', error: err.message });
    res.status(200).json(results);
  });
});

router.post('/', (req, res) => {
  const { title, description, severity, status } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Risk title is required' });
  }

  const sql = 'INSERT INTO risks (title, description, severity, status, manager_id) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [title, description || null, severity || 'medium', status || 'open', req.user.workspaceId], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error creating risk', error: err.message });
    res.status(201).json({ message: 'Risk created successfully!', riskId: result.insertId });
  });
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, severity, status } = req.body;

  const sql = 'UPDATE risks SET title = ?, description = ?, severity = ?, status = ? WHERE id = ? AND manager_id = ?';
  db.query(sql, [title, description, severity, status, id, req.user.workspaceId], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error updating risk', error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Risk not found' });
    res.status(200).json({ message: 'Risk updated successfully!' });
  });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM risks WHERE id = ? AND manager_id = ?', [id, req.user.workspaceId], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error deleting risk', error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Risk not found' });
    res.status(200).json({ message: 'Risk deleted successfully!' });
  });
});

module.exports = router;
