-- Enable UUID extension (optional but good practice)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE,
  password TEXT, -- Nullable for OAuth
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  role TEXT CHECK (role IN ('client', 'agent', 'admin')) DEFAULT 'client' NOT NULL,
  
  -- Social Auth
  google_id TEXT,
  facebook_id TEXT,
  
  -- Gamification
  points INTEGER DEFAULT 0 NOT NULL,
  level TEXT CHECK (level IN ('bronze', 'silver', 'gold', 'platinum')) DEFAULT 'bronze' NOT NULL,
  language TEXT CHECK (language IN ('fr', 'ar', 'en')) DEFAULT 'fr' NOT NULL,
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Sessions Table (for express-session with connect-pg-simple)
CREATE TABLE IF NOT EXISTS "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX "IDX_session_expire" ON "session" ("expire");

-- Travel Offers Table
CREATE TABLE IF NOT EXISTS offers (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  type TEXT CHECK (type IN ('manasik', 'touristique', 'organise', 'pack', 'hotel', 'car_rental')) NOT NULL,
  subtype TEXT, -- e.g., 'omra', 'hajj'
  description TEXT NOT NULL,
  program JSONB DEFAULT '[]'::jsonb NOT NULL,
  price INTEGER NOT NULL,
  currency TEXT DEFAULT 'MAD' NOT NULL,
  duration_days INTEGER NOT NULL,
  image_url TEXT NOT NULL,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  offer_id INTEGER REFERENCES offers(id),
  status TEXT CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')) DEFAULT 'pending' NOT NULL,
  travelers_count INTEGER DEFAULT 1 NOT NULL,
  total_price INTEGER NOT NULL,
  special_requests TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Content Table
CREATE TABLE IF NOT EXISTS content (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT CHECK (category IN ('esim', 'guide', 'general')) NOT NULL,
  video_url TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert Admin User (Password: admin123) - PLEASE CHANGE PASSWORD IN PRODUCTION
-- Note: In a real app, you would hash the password. This is just for initial setup if using plain text for testing, 
-- or you can use the register flow.
-- INSERT INTO users (username, email, password, role) VALUES ('admin', 'admin@manasik.com', 'admin123', 'admin');
