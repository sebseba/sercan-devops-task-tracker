const express = require('express');
const path = require('path');
const taskRoutes = require('./routes/tasks');

const app = express();

app.use(express.json());

// Simple health check for monitoring and pipeline smoke tests
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', service: 'devops-task-tracker' });
});

app.use('/api/tasks', taskRoutes);

// Demo UI
app.use(express.static(path.join(__dirname, '..', 'public')));

module.exports = app;
