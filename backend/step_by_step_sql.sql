-- STEP 1: CREATE MANTRAS TABLE
-- Copy this first, run it, wait for success ✅

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

ALTER TABLE mantras ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read mantras" ON mantras FOR SELECT USING (true);

-- ✅ WAIT FOR SUCCESS MESSAGE BEFORE CONTINUING

-- STEP 2: CREATE HOROSCOPE TABLE  
-- Copy this second, run it, wait for success ✅

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

ALTER TABLE horoscope ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read horoscope" ON horoscope FOR SELECT USING (true);

-- ✅ WAIT FOR SUCCESS MESSAGE BEFORE CONTINUING

-- STEP 3: CREATE FESTIVALS TABLE
-- Copy this third, run it, wait for success ✅

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

ALTER TABLE festivals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read festivals" ON festivals FOR SELECT USING (true);

-- ✅ WAIT FOR SUCCESS MESSAGE BEFORE CONTINUING

-- STEP 4: CREATE PANCHANG TABLE
-- Copy this fourth, run it, wait for success ✅

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

ALTER TABLE panchang ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read panchang" ON panchang FOR SELECT USING (true);

-- ✅ ALL TABLES CREATED! NOW ADD SAMPLE DATA

-- STEP 5: INSERT SAMPLE DATA
-- Copy this last, run it ✅

-- Sample Mantras
INSERT INTO mantras (sanskrit, transliteration, meaning, meaning_hi, deity, deity_hi, benefits, category) VALUES
('ॐ नमः शिवाय', 'Om Namah Shivaya', 'I bow to Shiva', 'मैं शिव को नमन करता हूँ', 'Lord Shiva', 'भगवान शिव', 'Inner peace, spiritual awakening', 'meditation'),
('ॐ गं गणपतये नमः', 'Om Gam Ganapataye Namah', 'I bow to Lord Ganesha', 'मैं भगवान गणेश को नमन करता हूँ', 'Lord Ganesha', 'भगवान गणेश', 'Removes obstacles, brings success', 'prosperity');

-- Sample Festivals
INSERT INTO festivals (name, name_hi, date, year, significance, category) VALUES
('Diwali', 'दिवाली', '2024-11-01', 2024, 'Festival of Lights celebrating victory of light over darkness', 'major'),
('Karva Chauth', 'करवा चौथ', '2024-10-20', 2024, 'Fast observed by married women', 'vrat');

-- Sample Horoscope
INSERT INTO horoscope (zodiac_sign, date, period, prediction, prediction_hi, love_score, career_score, health_score, money_score, lucky_color, lucky_number) VALUES
('aries', CURRENT_DATE, 'daily', 'Today brings energy and enthusiasm. Focus on new beginnings.', 'आज ऊर्जा और उत्साह लाता है।', 4, 5, 4, 3, 'Red', 9),
('taurus', CURRENT_DATE, 'daily', 'Stability and patience will be your strengths today.', 'स्थिरता और धैर्य आपकी शक्ति होगी।', 3, 4, 5, 4, 'Green', 6);

-- Sample Panchang
INSERT INTO panchang (date, tithi, tithi_hi, nakshatra, nakshatra_hi, sunrise, sunset, muhurat_start, muhurat_end) VALUES
(CURRENT_DATE, 'Shukla Tritiya', 'शुक्ल त्रितीया', 'Rohini', 'रोहिणी', '06:15:00', '18:45:00', '08:30:00', '09:15:00');