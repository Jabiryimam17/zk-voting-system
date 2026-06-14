BEGIN;

CREATE TABLE IF NOT EXISTS users (
  national_id VARCHAR(64) PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password TEXT NOT NULL,
  verification_code VARCHAR(32),
  expiry_date TIMESTAMPTZ,
  verified BOOLEAN NOT NULL DEFAULT FALSE,
  admin BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS parties (
  id VARCHAR(64) PRIMARY KEY,
  party_name VARCHAR(255) NOT NULL UNIQUE,
  party_leader_name VARCHAR(255) NOT NULL,
  leader_id VARCHAR(64) NOT NULL,
  leader_email VARCHAR(255) NOT NULL,
  party_goals TEXT,
  party_description TEXT,
  party_vision TEXT,
  short_name VARCHAR(32) UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_parties_leader_id FOREIGN KEY (leader_id) REFERENCES users (national_id),
  CONSTRAINT fk_parties_leader_email FOREIGN KEY (leader_email) REFERENCES users (email)
);

CREATE INDEX IF NOT EXISTS idx_users_verified ON users (verified);
CREATE INDEX IF NOT EXISTS idx_parties_leader_id ON parties (leader_id);

COMMIT;