-- ===================================
-- SUPABASE MANUAL SQL UPDATES
-- Copy-paste these into your Supabase SQL Editor
-- ===================================

-- 1. EXTEND EXISTING QUOTES TABLE (Run this first)
-- This adds new columns to your existing quotes table without breaking anything
ALTER TABLE quotes 
ADD COLUMN usage_type VARCHAR(50) DEFAULT 'general',
ADD COLUMN display_priority INTEGER DEFAULT 0,
ADD COLUMN is_daily_guide BOOLEAN DEFAULT false,
ADD COLUMN deity VARCHAR(100),
ADD COLUMN deity_hi VARCHAR(100),
ADD COLUMN benefits TEXT,
ADD COLUMN benefits_hi TEXT;

-- Update existing quotes to keep them working as before
UPDATE quotes 
SET usage_type = 'bhajan', 
    is_daily_guide = false 
WHERE usage_type = 'general' OR usage_type IS NULL;

-- Add indexes for better performance
CREATE INDEX idx_quotes_usage_type ON quotes(usage_type);
CREATE INDEX idx_quotes_daily_guide ON quotes(is_daily_guide);
CREATE INDEX idx_quotes_priority ON quotes(display_priority);

-- ===================================

-- 2. CREATE NEW MANTRAS TABLE
CREATE TABLE mantras (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sanskrit TEXT NOT NULL,
  transliteration TEXT NOT NULL,
  meaning TEXT NOT NULL,
  meaning_hi TEXT,
  deity VARCHAR(100),
  deity_hi VARCHAR(100),
  benefits TEXT,
  benefits_hi TEXT,
  audio_url TEXT,
  category VARCHAR(50) DEFAULT 'general',
  display_priority INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS (Row Level Security) for mantras
ALTER TABLE mantras ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read mantras" ON mantras FOR SELECT USING (true);

-- ===================================

-- 3. CREATE FESTIVALS TABLE
CREATE TABLE festivals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  name_hi VARCHAR(200),
  date DATE NOT NULL,
  year INTEGER NOT NULL,
  significance TEXT,
  significance_hi TEXT,
  rituals TEXT[],
  rituals_hi TEXT[],
  category VARCHAR(50) DEFAULT 'major',
  region VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS for festivals
ALTER TABLE festivals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read festivals" ON festivals FOR SELECT USING (true);

-- ===================================

-- 4. CREATE PANCHANG TABLE
CREATE TABLE panchang (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  tithi VARCHAR(100),
  tithi_hi VARCHAR(100),
  nakshatra VARCHAR(100),
  nakshatra_hi VARCHAR(100),
  yoga VARCHAR(100),
  yoga_hi VARCHAR(100),
  karana VARCHAR(100),
  karana_hi VARCHAR(100),
  sunrise TIME,
  sunset TIME,
  moonrise TIME,
  moonset TIME,
  muhurat_start TIME,
  muhurat_end TIME,
  rahu_start TIME,
  rahu_end TIME,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS for panchang
ALTER TABLE panchang ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read panchang" ON panchang FOR SELECT USING (true);

-- ===================================

-- 5. CREATE HOROSCOPE TABLE
CREATE TABLE horoscope (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  zodiac_sign VARCHAR(50) NOT NULL,
  date DATE NOT NULL,
  period VARCHAR(20) NOT NULL, -- 'daily', 'weekly', 'monthly'
  prediction TEXT NOT NULL,
  prediction_hi TEXT,
  love_score INTEGER CHECK (love_score >= 1 AND love_score <= 5),
  career_score INTEGER CHECK (career_score >= 1 AND career_score <= 5),
  health_score INTEGER CHECK (health_score >= 1 AND health_score <= 5),
  money_score INTEGER CHECK (money_score >= 1 AND money_score <= 5),
  lucky_color VARCHAR(50),
  lucky_number INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(zodiac_sign, date, period)
);

-- Add RLS for horoscope
ALTER TABLE horoscope ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read horoscope" ON horoscope FOR SELECT USING (true);

-- ===================================

-- 6. INSERT SAMPLE DATA (Optional - for testing)

-- Sample Daily Guide Quotes
INSERT INTO quotes (text, text_hi, author, category, usage_type, is_daily_guide, display_priority) VALUES
('The mind is everything. What you think you become.', 'मन ही सब कुछ है। आप जो सोचते हैं, वही बन जाते हैं।', 'Buddha', 'wisdom', 'daily_guide', true, 10),
('Wherever you are, and whatever you do, be in love.', 'जहाँ भी हों, जो भी करें, प्रेम में रहें।', 'Kabir Das', 'love', 'daily_guide', true, 9);

-- Sample Mantras
INSERT INTO mantras (sanskrit, transliteration, meaning, meaning_hi, deity, deity_hi, benefits, category) VALUES
('ॐ नमः शिवाय', 'Om Namah Shivaya', 'I bow to Shiva', 'मैं शिव को नमन करता हूँ', 'Lord Shiva', 'भगवान शिव', 'Inner peace, spiritual awakening', 'meditation'),
('ॐ गं गणपतये नमः', 'Om Gam Ganapataye Namah', 'I bow to Lord Ganesha', 'मैं भगवान गणेश को नमन करता हूँ', 'Lord Ganesha', 'भगवान गणेश', 'Removes obstacles, brings success', 'prosperity');

-- Sample Festivals
INSERT INTO festivals (name, name_hi, date, year, significance, category) VALUES
('Diwali', 'दिवाली', '2024-11-01', 2024, 'Festival of Lights celebrating victory of light over darkness', 'major'),
('Holi', 'होली', '2024-03-25', 2024, 'Festival of Colors celebrating spring and love', 'major');

-- ===================================
-- IMPORTANT NOTES:
-- 1. Run these queries ONE BY ONE in Supabase SQL Editor
-- 2. Check each query executes successfully before running the next
-- 3. Your existing quotes will remain untouched
-- 4. All new tables have proper RLS policies for public read access
-- ===================================