-- ============================================
-- ZYBORN - Simple Subscribers Table
-- Run this in Supabase SQL Editor
-- ============================================

-- Create table
CREATE TABLE simple_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    subscribed_at TIMESTAMPTZ DEFAULT NOW(),
    ip_hash TEXT,
    turnstile_score DECIMAL,
    welcome_sent BOOLEAN DEFAULT FALSE,
    welcome_sent_at TIMESTAMPTZ
);

-- Index for fast duplicate checks
CREATE INDEX idx_simple_subscribers_email ON simple_subscribers(email);

-- Index for rate limiting queries (by ip_hash and time)
CREATE INDEX idx_simple_subscribers_ip_time ON simple_subscribers(ip_hash, subscribed_at);

-- Enable Row Level Security
ALTER TABLE simple_subscribers ENABLE ROW LEVEL SECURITY;

-- Policy: Allow inserts from anonymous users (API will handle validation)
CREATE POLICY "Allow anonymous inserts" ON simple_subscribers
    FOR INSERT
    WITH CHECK (true);

-- Policy: Allow service role to read/update
CREATE POLICY "Service role full access" ON simple_subscribers
    FOR ALL
    USING (auth.role() = 'service_role');

-- Grant permissions
GRANT INSERT ON simple_subscribers TO anon;
GRANT ALL ON simple_subscribers TO service_role;
