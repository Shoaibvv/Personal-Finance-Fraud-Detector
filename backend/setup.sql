-- setup.sql
-- Run this file once to create your database tables.
-- In your terminal: psql -U your_username -d fraud_detector -f setup.sql

-- ─────────────────────────────────────────────
-- TABLE 1: transactions
-- Stores every financial transaction in the system.
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS transactions (
  id          SERIAL PRIMARY KEY,          -- auto-incrementing unique ID
  user_id     VARCHAR(50) NOT NULL,        -- who made the transaction (e.g. "user_1")
  amount      DECIMAL(10, 2) NOT NULL,     -- dollar amount (e.g. 1500.00)
  category    VARCHAR(100) NOT NULL,       -- what type: "Food", "Shopping", etc.
  description VARCHAR(255),               -- short note about the transaction
  created_at  TIMESTAMP DEFAULT NOW()      -- when it happened (defaults to right now)
);

-- ─────────────────────────────────────────────
-- TABLE 2: alerts
-- Stores fraud alerts generated for suspicious transactions.
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS alerts (
  id             SERIAL PRIMARY KEY,
  transaction_id INT REFERENCES transactions(id) ON DELETE CASCADE, -- links to transactions table
  risk_level     VARCHAR(20) NOT NULL,     -- "HIGH", "MEDIUM", or "LOW"
  reason         VARCHAR(255) NOT NULL,    -- why it was flagged
  created_at     TIMESTAMP DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- SAMPLE DATA: Insert 15 realistic transactions
-- Some are suspicious on purpose so we can see alerts!
-- ─────────────────────────────────────────────
INSERT INTO transactions (user_id, amount, category, description, created_at) VALUES
  ('user_1', 45.00,   'Food',       'Grocery store',          NOW() - INTERVAL '2 days'),
  ('user_1', 2500.00, 'Shopping',   'Electronics purchase',   NOW() - INTERVAL '2 days'),  -- HIGH: large amount
  ('user_2', 12.50,   'Food',       'Coffee shop',            NOW() - INTERVAL '1 day'),
  ('user_2', 800.00,  'Travel',     'Airline tickets',        NOW() - INTERVAL '1 day'),
  ('user_3', 30.00,   'Food',       'Restaurant',             NOW() - INTERVAL '3 hours'),
  ('user_3', 35.00,   'Food',       'Fast food',              NOW() - INTERVAL '3 hours'), -- MEDIUM: rapid fire
  ('user_3', 28.00,   'Food',       'Lunch',                  NOW() - INTERVAL '3 hours'), -- MEDIUM: rapid fire
  ('user_1', 1200.00, 'Shopping',   'Luxury bag',             NOW() - INTERVAL '6 hours'), -- HIGH: large amount
  ('user_4', 5000.00, 'Transfer',   'Wire transfer',          NOW() - INTERVAL '12 hours'), -- HIGH: large amount
  ('user_2', 22.00,   'Utilities',  'Phone bill',             NOW() - INTERVAL '4 days'),
  ('user_5', 60.00,   'Shopping',   'Clothing store',         NOW() - INTERVAL '5 days'),
  ('user_5', 90.00,   'Health',     'Pharmacy',               NOW() - INTERVAL '5 days'),
  ('user_4', 15.00,   'Food',       'Vending machine',        NOW() - INTERVAL '2 hours'),
  ('user_1', 75.00,   'Health',     'Gym membership',         NOW() - INTERVAL '1 hour'),
  ('user_6', 3300.00, 'Shopping',   'Jewelry purchase',       NOW() - INTERVAL '30 minutes'); -- HIGH: large amount
