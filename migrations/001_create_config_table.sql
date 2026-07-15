-- Create config table for storing key-value configuration
-- This replaces the previous address.json file which doesn't work
-- on Vercel's read-only filesystem.

CREATE TABLE IF NOT EXISTS config (
  key TEXT PRIMARY KEY,
  value TEXT
);

-- Insert existing contract addresses from address.json
INSERT INTO config (key, value) VALUES
  ('election_address', '0x211F0d991f1d4aeefd63D47f3FDce055F2Cae7dE'),
  ('verifier_address', '0x94c2B1B6BAA047747D30f538f6c0e716fc57277C'),
  ('merkle_setup', 'true')
ON CONFLICT (key) DO NOTHING;
