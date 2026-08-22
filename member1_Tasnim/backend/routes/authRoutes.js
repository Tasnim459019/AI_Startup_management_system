const { OAuth2Client } = require('google-auth-library');
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// SIGNUP — public signup always creates a MANAGER (their own workspace)
router.post('/signup', (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please fill all fields' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  const sql = 'INSERT INTO users (name, email, password, role, manager_id) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [name, email, hashedPassword, 'manager', null], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error creating user', error: err.message });
    }
    res.status(201).json({ message: 'User created successfully!' });
  });
});

// LOGIN
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [email], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Server error', error: err.message });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = results[0];
    const isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // A manager's workspace is their own id; an employee's workspace is their manager's id
    const workspaceId = user.role === 'manager' ? user.id : user.manager_id;

    const token = jwt.sign(
      { id: user.id, role: user.role, workspaceId },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Login successful!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  });
});

// GOOGLE SIGN-IN
router.post('/google', async (req, res) => {
  const { credential } = req.body;

  if (!credential) {
    return res.status(400).json({ message: 'Google credential is required' });
  }

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name } = payload;

    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
      if (err) return res.status(500).json({ message: 'Server error', error: err.message });

      if (results.length > 0) {
        // Existing user — log them in
        const user = results[0];
        const workspaceId = user.role === 'manager' ? user.id : user.manager_id;

        const token = jwt.sign(
          { id: user.id, role: user.role, workspaceId },
          process.env.JWT_SECRET,
          { expiresIn: '7d' }
        );

        return res.status(200).json({
          message: 'Login successful!',
          token,
          user: { id: user.id, name: user.name, email: user.email, role: user.role },
        });
      }

      // New user — create a manager account (random password since they'll always use Google to log in)
      const randomPassword = bcrypt.hashSync(Math.random().toString(36), 10);
      const insertSql = 'INSERT INTO users (name, email, password, role, manager_id) VALUES (?, ?, ?, "manager", NULL)';
      db.query(insertSql, [name, email, randomPassword], (err, result) => {
        if (err) return res.status(500).json({ message: 'Error creating user', error: err.message });

        const newUserId = result.insertId;
        const token = jwt.sign(
          { id: newUserId, role: 'manager', workspaceId: newUserId },
          process.env.JWT_SECRET,
          { expiresIn: '7d' }
        );

        res.status(201).json({
          message: 'Account created and logged in!',
          token,
          user: { id: newUserId, name, email, role: 'manager' },
        });
      });
    });
  } catch (err) {
    res.status(401).json({ message: 'Invalid Google credential', error: err.message });
  }
});

module.exports = router;
