-- Migration: Extend quotes table for Daily Guide feature
-- This adds new columns WITHOUT affecting existing data

-- Add new columns to existing quotes table
ALTER TABLE quotes 
ADD COLUMN IF NOT EXISTS usage_type VARCHAR(50) DEFAULT 'general',
ADD COLUMN IF NOT EXISTS display_priority INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_daily_guide BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS deity VARCHAR(100),
ADD COLUMN IF NOT EXISTS deity_hi VARCHAR(100),
ADD COLUMN IF NOT EXISTS benefits TEXT,
ADD COLUMN IF NOT EXISTS benefits_hi TEXT;

-- Update existing quotes to maintain current functionality
UPDATE quotes 
SET usage_type = 'bhajan', 
    is_daily_guide = false 
WHERE usage_type IS NULL OR usage_type = 'general';

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_quotes_usage_type ON quotes(usage_type);
CREATE INDEX IF NOT EXISTS idx_quotes_daily_guide ON quotes(is_daily_guide);
CREATE INDEX IF NOT EXISTS idx_quotes_priority ON quotes(display_priority);

-- Insert some sample daily guide quotes (won't conflict with existing)
INSERT INTO quotes (
  text, 
  text_hi, 
  author, 
  category, 
  usage_type, 
  is_daily_guide, 
  display_priority,
  created_at
) VALUES 
(
  'The mind is everything. What you think you become.',
  'मन ही सब कुछ है। आप जो सोचते हैं, वही बन जाते हैं।',
  'Buddha',
  'wisdom',
  'daily_guide',
  true,
  10,
  NOW()
),
(
  'It is better to live your own dharma imperfectly than to live an imitation of somebody else''s life with perfection.',
  'अपने धर्म का अपूर्ण रूप से पालन करना किसी और के जीवन की पूर्ण नकल से बेहतर है।',
  'Lord Krishna',
  'dharma',
  'daily_guide',
  true,
  9,
  NOW()
),
(
  'Wherever you are, and whatever you do, be in love.',
  'जहाँ भी हों, जो भी करें, प्रेम में रहें।',
  'Kabir Das',
  'love',
  'daily_guide',
  true,
  8,
  NOW()
)
ON CONFLICT DO NOTHING;  -- Prevents duplicates if run multiple times