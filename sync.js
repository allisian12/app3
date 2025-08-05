require('dotenv').config();
const { fetchApprovedDeals } = require('./services/iriscrm');
const { saveDeals } = require('./db');

(async () => {
  console.log("Starting sync job...");
  try {
    const deals = await fetchApprovedDeals();
    const result = await saveDeals(deals);
    console.log(`Synced ${result} deals.`);
  } catch (error) {
    console.error("Sync failed:", error.message);
  }
})();
