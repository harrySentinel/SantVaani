-- First, drop the table if it exists (in case it was created incorrectly)
DROP TABLE IF EXISTS spiritual_facts;

-- Create the spiritual_facts table with all required columns
CREATE TABLE spiritual_facts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  text TEXT NOT NULL,
  text_hi TEXT,
  category VARCHAR(50) NOT NULL,
  icon VARCHAR(10) NOT NULL,
  source VARCHAR(200),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_spiritual_facts_category ON spiritual_facts(category);
CREATE INDEX idx_spiritual_facts_active ON spiritual_facts(is_active);

-- Enable Row Level Security
ALTER TABLE spiritual_facts ENABLE ROW LEVEL SECURITY;

-- Create policies for access control
CREATE POLICY "Allow public read access on spiritual_facts" 
ON spiritual_facts FOR SELECT 
USING (true);

CREATE POLICY "Allow authenticated insert on spiritual_facts" 
ON spiritual_facts FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Allow authenticated update on spiritual_facts" 
ON spiritual_facts FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Allow authenticated delete on spiritual_facts" 
ON spiritual_facts FOR DELETE 
TO authenticated 
USING (true);

-- Insert sample data to test
INSERT INTO spiritual_facts (text, text_hi, category, icon, source) VALUES 
('In the Ramayana, Hanuman''s heart contains an image of Rama and Sita inside it.', 'रामायण में हनुमान के हृदय में राम और सीता की छवि है।', 'Ramayana', '🏹', 'Valmiki Ramayana'),
('The Mahabharata has 1.8 million words, making it the longest epic poem ever written.', 'महाभारत में 1.8 मिलियन शब्द हैं, जो इसे अब तक लिखी गई सबसे लंबी महाकाव्य बनाती है।', 'Mahabharata', '⚔️', 'Vyasa Mahabharata'),
('Lord Vishnu has 1008 names, each describing a different aspect of his divine nature.', 'भगवान विष्णु के 1008 नाम हैं, प्रत्येक उनकी दिव्य प्रकृति के एक अलग पहलू का वर्णन करता है।', 'Hindu Deities', '🕉️', 'Vishnu Sahasranama');