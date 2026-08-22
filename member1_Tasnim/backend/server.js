const express = require('express');
const cors = require('cors');
require('./config/db');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const riskRoutes = require('./routes/riskRoutes');
const aiRoutes = require('./routes/aiRoutes');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use('/api/budget', budgetRoutes);
app.use('/api/risks', riskRoutes);
app.use('/api/ai', aiRoutes);

app.get('/', (req, res) => {
  res.send('Backend server is working!');
});

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/employees', employeeRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
