-- COPY-PASTE THESE ONE BY ONE IN SUPABASE SQL EDITOR
-- Run each command separately, wait for success before next one

-- 1. Add usage_type column
ALTER TABLE quotes ADD COLUMN usage_type VARCHAR(50) DEFAULT 'general';

-- 2. Add display_priority column  
ALTER TABLE quotes ADD COLUMN display_priority INTEGER DEFAULT 0;

-- 3. Add is_daily_guide column
ALTER TABLE quotes ADD COLUMN is_daily_guide BOOLEAN DEFAULT false;

-- 4. Add deity column
ALTER TABLE quotes ADD COLUMN deity VARCHAR(100);

-- 5. Add deity_hi column
ALTER TABLE quotes ADD COLUMN deity_hi VARCHAR(100);

-- 6. Add benefits column
ALTER TABLE quotes ADD COLUMN benefits TEXT;

-- 7. Add benefits_hi column
ALTER TABLE quotes ADD COLUMN benefits_hi TEXT;

-- 8. Update existing quotes to keep them working
UPDATE quotes SET usage_type = 'bhajan', is_daily_guide = false WHERE usage_type = 'general';

-- 9. Add indexes for better performance
CREATE INDEX idx_quotes_usage_type ON quotes(usage_type);
CREATE INDEX idx_quotes_daily_guide ON quotes(is_daily_guide);

-- 10. Insert sample daily guide quotes (these won't interfere with your bhajan quotes)
INSERT INTO quotes (text, text_hi, author, category, usage_type, is_daily_guide, display_priority) VALUES
('The mind is everything. What you think you become.', 'मन ही सब कुछ है। आप जो सोचते हैं, वही बन जाते हैं।', 'Buddha', 'wisdom', 'daily_guide', true, 10),
('Wherever you are, and whatever you do, be in love.', 'जहाँ भी हों, जो भी करें, प्रेम में रहें।', 'Kabir Das', 'love', 'daily_guide', true, 9);