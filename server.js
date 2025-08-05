// server.js
const express = require('express');
const { fetchApprovedDeals, saveDeals } = require('./services/iriscrm');

const app = express();
const PORT = process.env.PORT || 10000;

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
