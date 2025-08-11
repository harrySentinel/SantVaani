-- Create spiritual_facts table
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

-- Create index for better performance
CREATE INDEX idx_spiritual_facts_category ON spiritual_facts(category);
CREATE INDEX idx_spiritual_facts_active ON spiritual_facts(is_active);

-- Insert sample facts (you can add more)
INSERT INTO spiritual_facts (text, text_hi, category, icon, source) VALUES 
('In the Ramayana, Hanuman''s heart contains an image of Rama and Sita, discovered when his chest was opened by the gods to verify his devotion.', 'रामायण में हनुमान के हृदय में राम और सीता की छवि है, जो देवताओं द्वारा उनकी भक्ति को सत्यापित करने के लिए उनकी छाती खोलने पर पाई गई।', 'Ramayana', '🏹', 'Valmiki Ramayana'),

('The Mahabharata mentions that Krishna lifted Govardhan hill for 7 days straight, protecting the villagers from Indra''s torrential rains.', 'महाभारत में उल्लेख है कि कृष्ण ने 7 दिन तक गोवर्धन पर्वत उठाया, ग्रामीणों को इंद्र की मूसलधार बारिश से बचाया।', 'Mahabharata', '⚔️', 'Bhagavata Purana'),

('Lord Ganesha wrote the entire Mahabharata as Sage Vyasa dictated it, breaking his tusk to use as a pen when his original one broke.', 'भगवान गणेश ने पूरा महाभारत लिखा जब ऋषि व्यास ने इसे कहा था, अपना दांत तोड़कर कलम के रूप में उपयोग किया।', 'Hindu Deities', '🕉️', 'Mahabharata'),

('The Bhagavad Gita contains exactly 700 verses, divided into 18 chapters, and was spoken on the battlefield of Kurukshetra.', 'भगवद गीता में बिल्कुल 700 श्लोक हैं, 18 अध्यायों में बांटे गए, और यह कुरुक्षेत्र के युद्धक्षेत्र में बोला गया था।', 'Hindu Scriptures', '📿', 'Bhagavad Gita'),

('Saint Meera Bai drank poison given by her in-laws but it turned into nectar due to her unwavering devotion to Krishna.', 'संत मीरा बाई ने अपने ससुराल वालों द्वारा दिया गया जहर पिया लेकिन कृष्ण की अटूट भक्ति के कारण यह अमृत बन गया।', 'Saints', '🙏', 'Meera Charitra'),

('The city of Dwarka, Krishna''s legendary kingdom, has been discovered underwater off the coast of Gujarat by marine archaeologists.', 'द्वारका शहर, कृष्ण का पौराणिक राज्य, समुद्री पुरातत्वविदों द्वारा गुजरात के तट पर पानी के नीचे खोजा गया है।', 'Hindu History', '🏛️', 'Archaeological Survey'),

('Sage Valmiki was originally a dacoit named Ratnakar who transformed into a saint through the power of meditation and devotion.', 'ऋषि वाल्मीकि मूल रूप से रत्नाकर नामक डकैत थे जो ध्यान और भक्ति की शक्ति से संत बन गए।', 'Saints', '🧘', 'Valmiki Ramayana'),

('The Kumbh Mela is the largest peaceful gathering of humans on Earth, visible even from space satellites.', 'कुंभ मेला पृथ्वी पर मनुष्यों का सबसे बड़ा शांतिपूर्ण जमावड़ा है, जो अंतरिक्ष उपग्रहों से भी दिखाई देता है।', 'Hindu Festivals', '🎪', 'NASA Satellite Images'),

('The word ''Guru'' means ''from darkness to light'' - Gu (darkness) and Ru (light).', '\'गुरु\' शब्द का अर्थ है \'अंधकार से प्रकाश में\' - गु (अंधकार) और रु (प्रकाश)।', 'Sanskrit Words', '💡', 'Sanskrit Dictionary'),

('Lord Hanuman is believed to be immortal and still lives among us, appearing to devotees in times of need.', 'भगवान हनुमान अमर माने जाते हैं और अभी भी हमारे बीच रहते हैं, जरूरत के समय भक्तों के सामने प्रकट होते हैं।', 'Hindu Deities', '🐒', 'Puranic Literature');

-- Add RLS (Row Level Security) if needed
ALTER TABLE spiritual_facts ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access on spiritual_facts" 
ON spiritual_facts FOR SELECT 
USING (true);

-- Create policy for authenticated insert/update (for admin)
CREATE POLICY "Allow authenticated insert on spiritual_facts" 
ON spiritual_facts FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Allow authenticated update on spiritual_facts" 
ON spiritual_facts FOR UPDATE 
TO authenticated 
USING (true);