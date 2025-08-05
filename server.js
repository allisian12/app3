// server.js
const express = require('express');
const { fetchApprovedDeals, saveDeals } = require('./services/iriscrm');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/sync', async (req, res) => {
  try {
    const deals = await fetchApprovedDeals();
    const result = await saveDeals(deals);
    res.json({ success: true, synced: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
// Employee authentication
app.post('/api/login', async (req, res) => {
  // Implement actual authentication
  res.json({ id: '123', name: 'John Doe' });
});

// Time clock endpoints
app.post('/api/timeclock', async (req, res) => {
  // Record time clock action
  res.json({ success: true });
});

// Leave management endpoints
app.post('/api/leave', async (req, res) => {
  // Process leave request
  res.json({ success: true });
});

app.get('/api/leave/:employeeId', async (req, res) => {
  // Get leave requests
  res.json([]);
});
