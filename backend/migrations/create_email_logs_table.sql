-- Email Sent Logs Table
-- Tracks which emails have been sent to which users to prevent duplicates

CREATE TABLE IF NOT EXISTS email_sent_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  user_email TEXT NOT NULL,
  email_type TEXT NOT NULL, -- 'welcome', '7day', '30day', 'broadcast'
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  success BOOLEAN DEFAULT TRUE,
  error_message TEXT,
  UNIQUE(user_id, email_type) -- Prevent duplicate emails of same type to same user
);

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_email_logs_user_id ON email_sent_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_email_type ON email_sent_logs(email_type);
CREATE INDEX IF NOT EXISTS idx_email_logs_sent_at ON email_sent_logs(sent_at);

-- Enable RLS (Row Level Security)
ALTER TABLE email_sent_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Admin can view all logs
CREATE POLICY "Admins can view all email logs"
  ON email_sent_logs
  FOR SELECT
  USING (
    auth.jwt() ->> 'role' = 'admin'
  );

-- Policy: Service role can insert logs (for backend)
CREATE POLICY "Service role can insert logs"
  ON email_sent_logs
  FOR INSERT
  WITH CHECK (true);

COMMENT ON TABLE email_sent_logs IS 'Tracks email delivery to prevent duplicate milestone emails';
COMMENT ON COLUMN email_sent_logs.email_type IS 'Type of email sent: welcome, 7day, 30day, or broadcast';
