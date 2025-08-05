const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function saveDeals(deals) {
  const client = await pool.connect();
  let inserted = 0;
  try {
    for (const deal of deals) {
      await client.query(
        'INSERT INTO deals (external_id, rep_name, amount, status) VALUES ($1, $2, $3, $4) ON CONFLICT (external_id) DO NOTHING',
        [deal.id, deal.rep, deal.amount, deal.status]
      );
      inserted++;
    }
  } finally {
    client.release();
  }
  return inserted;
}

module.exports = { saveDeals };
