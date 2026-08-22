const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authenticate = require('../middleware/auth');

router.use(authenticate);

router.get('/', (req, res) => {
  db.query('SELECT * FROM budget WHERE manager_id = ? ORDER BY created_at DESC', [req.user.workspaceId], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching budget', error: err.message });
    res.status(200).json(results);
  });
});

router.post('/', (req, res) => {
  const { category, amount, type, note } = req.body;

  if (!category || !amount || !type) {
    return res.status(400).json({ message: 'Category, amount, and type are required' });
  }

  const sql = 'INSERT INTO budget (category, amount, type, note, manager_id) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [category, amount, type, note || null, req.user.workspaceId], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error creating budget entry', error: err.message });
    res.status(201).json({ message: 'Budget entry created!', budgetId: result.insertId });
  });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM budget WHERE id = ? AND manager_id = ?', [id, req.user.workspaceId], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error deleting budget entry', error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Budget entry not found' });
    res.status(200).json({ message: 'Budget entry deleted successfully!' });
  });
});

module.exports = router;
