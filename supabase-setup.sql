-- =====================================================
-- INOVASIIN Portfolio Database Setup
-- Run this SQL in Supabase SQL Editor
-- https://app.supabase.com/project/YOUR_PROJECT/sql
-- =====================================================

-- 1. Create portfolios table
CREATE TABLE IF NOT EXISTS portfolios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  subtitle TEXT,
  description TEXT,
  thumbnail_url TEXT,
  category VARCHAR(100) NOT NULL,
  industry VARCHAR(100),
  year VARCHAR(10),
  client VARCHAR(255),
  duration VARCHAR(100),
  challenge TEXT,
  solution TEXT,
  result TEXT,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create portfolio_media table
CREATE TABLE IF NOT EXISTS portfolio_media (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('image', 'youtube')),
  url TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create portfolio_stats table
CREATE TABLE IF NOT EXISTS portfolio_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE,
  icon VARCHAR(50),
  value VARCHAR(50),
  label VARCHAR(100),
  order_index INTEGER DEFAULT 0
);

-- 4. Create portfolio_tags table
CREATE TABLE IF NOT EXISTS portfolio_tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL
);

-- 5. Create portfolio_technologies table
CREATE TABLE IF NOT EXISTS portfolio_technologies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL
);

-- 6. Create portfolio_testimonials table
CREATE TABLE IF NOT EXISTS portfolio_testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE,
  quote TEXT,
  author VARCHAR(255),
  role VARCHAR(255)
);

-- 7. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_portfolios_featured ON portfolios(is_featured);
CREATE INDEX IF NOT EXISTS idx_portfolios_category ON portfolios(category);
CREATE INDEX IF NOT EXISTS idx_portfolios_created_at ON portfolios(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_portfolio_media_portfolio ON portfolio_media(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_stats_portfolio ON portfolio_stats(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_tags_portfolio ON portfolio_tags(portfolio_id);

-- 8. Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 9. Create trigger for updated_at
DROP TRIGGER IF EXISTS update_portfolios_updated_at ON portfolios;
CREATE TRIGGER update_portfolios_updated_at
    BEFORE UPDATE ON portfolios
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 10. Enable Row Level Security
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_testimonials ENABLE ROW LEVEL SECURITY;

-- 11. Create RLS policies for public read access
CREATE POLICY "Enable read access for all users" ON portfolios FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON portfolio_media FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON portfolio_stats FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON portfolio_tags FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON portfolio_technologies FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON portfolio_testimonials FOR SELECT USING (true);

-- 12. Create RLS policies for insert/update/delete (allow all for now, adjust for production)
CREATE POLICY "Enable insert for all users" ON portfolios FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON portfolios FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON portfolios FOR DELETE USING (true);

CREATE POLICY "Enable insert for all users" ON portfolio_media FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON portfolio_media FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON portfolio_media FOR DELETE USING (true);

CREATE POLICY "Enable insert for all users" ON portfolio_stats FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON portfolio_stats FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON portfolio_stats FOR DELETE USING (true);

CREATE POLICY "Enable insert for all users" ON portfolio_tags FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON portfolio_tags FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON portfolio_tags FOR DELETE USING (true);

CREATE POLICY "Enable insert for all users" ON portfolio_technologies FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON portfolio_technologies FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON portfolio_technologies FOR DELETE USING (true);

CREATE POLICY "Enable insert for all users" ON portfolio_testimonials FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON portfolio_testimonials FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON portfolio_testimonials FOR DELETE USING (true);

-- 13. Create Storage bucket for portfolio images (run this in Storage section or via API)
-- In Supabase Dashboard: Storage > Create new bucket > Name: "portfolio-images" > Make it public

-- Verify tables created
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;

