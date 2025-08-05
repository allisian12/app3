CREATE TABLE IF NOT EXISTS deals (
  id SERIAL PRIMARY KEY,
  external_id TEXT UNIQUE NOT NULL,
  rep_name TEXT,
  amount NUMERIC,
  status TEXT,
  synced_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS equipment (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  cost NUMERIC NOT NULL,
  markup_type TEXT NOT NULL,
  markup_value NUMERIC NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS deal_equipment (
  id SERIAL PRIMARY KEY,
  deal_id INTEGER REFERENCES deals(id),
  equipment_id INTEGER REFERENCES equipment(id),
  quantity INTEGER DEFAULT 1
);
