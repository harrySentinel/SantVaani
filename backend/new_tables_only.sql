-- CREATE ONLY NEW TABLES - NO CHANGES TO EXISTING QUOTES
-- Copy-paste these in Supabase SQL Editor

-- 1. MANTRAS TABLE
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

-- Enable RLS
ALTER TABLE mantras ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read mantras" ON mantras FOR SELECT USING (true);

-- 2. HOROSCOPE TABLE 
CREATE TABLE horoscope (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  zodiac_sign VARCHAR(50) NOT NULL,
  date DATE NOT NULL,
  period VARCHAR(20) NOT NULL,
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

-- Enable RLS
ALTER TABLE horoscope ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read horoscope" ON horoscope FOR SELECT USING (true);

-- 3. FESTIVALS TABLE
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

-- Enable RLS
ALTER TABLE festivals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read festivals" ON festivals FOR SELECT USING (true);

-- 4. PANCHANG TABLE
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

-- Enable RLS
ALTER TABLE panchang ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read panchang" ON panchang FOR SELECT USING (true);

-- 5. INSERT SAMPLE DATA

-- Sample Mantras
INSERT INTO mantras (sanskrit, transliteration, meaning, meaning_hi, deity, deity_hi, benefits, category) VALUES
('ॐ नमः शिवाय', 'Om Namah Shivaya', 'I bow to Shiva', 'मैं शिव को नमन करता हूँ', 'Lord Shiva', 'भगवान शिव', 'Inner peace, spiritual awakening', 'meditation'),
('ॐ गं गणपतये नमः', 'Om Gam Ganapataye Namah', 'I bow to Lord Ganesha', 'मैं भगवान गणेश को नमन करता हूँ', 'Lord Ganesha', 'भगवान गणेश', 'Removes obstacles, brings success', 'prosperity'),
('ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात्', 'Om Bhur Bhuvaḥ Swaḥ Tat-savitur Vareṇyaṃ Bhargo Devasya Dhīmahi Dhiyo Yo Naḥ Prachodayāt', 'We meditate on divine light', 'हम दिव्य प्रकाश पर ध्यान करते हैं', 'Goddess Gayatri', 'माता गायत्री', 'Wisdom, spiritual illumination', 'morning');

-- Sample Festivals
INSERT INTO festivals (name, name_hi, date, year, significance, category) VALUES
('Diwali', 'दिवाली', '2024-11-01', 2024, 'Festival of Lights celebrating victory of light over darkness', 'major'),
('Holi', 'होली', '2025-03-14', 2025, 'Festival of Colors celebrating spring and love', 'major'),
('Karva Chauth', 'करवा चौथ', '2024-10-20', 2024, 'Fast observed by married women for husbands long life', 'vrat'),
('Dhanteras', 'धनतेरस', '2024-10-29', 2024, 'Worship of wealth and prosperity', 'major');

-- Sample Horoscope Data
INSERT INTO horoscope (zodiac_sign, date, period, prediction, prediction_hi, love_score, career_score, health_score, money_score, lucky_color, lucky_number) VALUES
('aries', CURRENT_DATE, 'daily', 'Today brings energy and enthusiasm. Focus on new beginnings.', 'आज ऊर्जा और उत्साह लाता है। नई शुरुआत पर ध्यान दें।', 4, 5, 4, 3, 'Red', 9),
('taurus', CURRENT_DATE, 'daily', 'Stability and patience will be your strengths today.', 'स्थिरता और धैर्य आज आपकी शक्ति होगी।', 3, 4, 5, 4, 'Green', 6),
('gemini', CURRENT_DATE, 'daily', 'Communication and learning are highlighted today.', 'संवाद और सीखना आज प्रमुख है।', 5, 4, 3, 3, 'Yellow', 3);

-- Sample Panchang
INSERT INTO panchang (date, tithi, tithi_hi, nakshatra, nakshatra_hi, sunrise, sunset, muhurat_start, muhurat_end) VALUES
(CURRENT_DATE, 'Shukla Tritiya', 'शुक्ल त्रितीया', 'Rohini', 'रोहिणी', '06:15:00', '18:45:00', '08:30:00', '09:15:00');