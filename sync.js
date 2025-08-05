// sync.js
require('dotenv').config();
const express = require('express');
const { fetchApprovedDeals } = require('./services/iriscrm');
const { saveDeals } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Health check endpoint
app.get('/', (req, res) => {
  res.send('Sync service is running');
});

// Manual sync trigger endpoint
app.get('/sync', async (req, res) => {
  console.log("Starting sync job...");
  try {
    const deals = await fetchApprovedDeals();
    const result = await saveDeals(deals);
    res.json({ success: true, message: `Synced ${result} deals` });
  } catch (error) {
    console.error("Sync failed:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Scheduled sync (every hour)
setInterval(async () => {
  console.log("Running scheduled sync...");
  try {
    const deals = await fetchApprovedDeals();
    const result = await saveDeals(deals);
    console.log(`Synced ${result} deals.`);
  } catch (error) {
    console.error("Sync failed:", error.message);
  }
}, 60 * 60 * 1000); // 1 hour

// Initial sync on startup
(async () => {
  console.log("Running initial sync...");
  try {
    const deals = await fetchApprovedDeals();
    const result = await saveDeals(deals);
    console.log(`Initial sync completed: ${result} deals.`);
  } catch (error) {
    console.error("Initial sync failed:", error.message);
  }
})();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
