-- Create notices table for the notice board feature
CREATE TABLE IF NOT EXISTS notices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    message_hi TEXT, -- Hindi version of the message
    type VARCHAR(50) DEFAULT 'announcement' CHECK (type IN ('festival', 'announcement', 'greeting', 'update')),
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for active notices
CREATE INDEX IF NOT EXISTS idx_notices_active ON notices(is_active, expires_at) WHERE is_active = true;

-- Create index for ordering by creation date
CREATE INDEX IF NOT EXISTS idx_notices_created_at ON notices(created_at DESC);

-- Add a trigger to update the updated_at column
CREATE OR REPLACE FUNCTION update_notices_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_notices_updated_at
    BEFORE UPDATE ON notices
    FOR EACH ROW
    EXECUTE FUNCTION update_notices_updated_at();

-- Insert a sample notice for testing
INSERT INTO notices (title, message, message_hi, type, is_active, expires_at) VALUES (
    'Welcome to SantVaani!',
    'Experience the divine wisdom of saints and spiritual masters. May this journey bring peace and enlightenment to your life.',
    'संतवाणी में आपका स्वागत है! 🙏 संतों और आध्यात्मिक गुरुओं का दिव्य ज्ञान अनुभव करें। यह यात्रा आपके जीवन में शांति और ज्ञान लाए।',
    'greeting',
    true,
    NOW() + INTERVAL '30 days'
);