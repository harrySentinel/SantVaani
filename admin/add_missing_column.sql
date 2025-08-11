-- Add the missing text_hi column if it doesn't exist
ALTER TABLE spiritual_facts ADD COLUMN IF NOT EXISTS text_hi TEXT;

-- Add missing columns that might be needed
ALTER TABLE spiritual_facts ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Update existing rows to have updated_at = created_at if null
UPDATE spiritual_facts 
SET updated_at = created_at 
WHERE updated_at IS NULL;

-- Verify the table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'spiritual_facts'
ORDER BY ordinal_position;