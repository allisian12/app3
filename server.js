const express = require('express');
const path = require('path');
const { fetchApprovedDeals, saveDeals } = require('./services/iriscrm');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// API Endpoints
app.get('/api/sync', async (req, res) => {
  try {
    const deals = await fetchApprovedDeals();
    const result = await saveDeals(deals);
    res.json({ success: true, synced: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Login endpoint
app.post('/api/login', (req, res) => {
  // Implement your authentication logic here
  res.json({ id: '123', name: 'John Doe' });
});

// All other routes should return the frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
