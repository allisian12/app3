const axios = require('axios');
require('dotenv').config();

async function fetchApprovedDeals() {
  const response = await axios.get(`${process.env.IRISCRM_BASE_URL}/api/v1/deals`, {
    headers: { 'X-API-KEY': process.env.IRISCRM_API_KEY }
  });

  const allDeals = response.data || [];
  return allDeals.filter(deal => deal.status === "Approved - Live Merchant")
    .map(deal => ({
      id: deal.id.toString(),
      rep: deal.salesRep || 'Unknown',
      amount: parseFloat(deal.amount || 0),
      status: deal.status
    }));
}

module.exports = { fetchApprovedDeals };
