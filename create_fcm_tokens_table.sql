-- Create FCM tokens table for persistent notification storage
-- This will replace the in-memory storage and make notifications reliable

-- First, create the FCM tokens table
CREATE TABLE IF NOT EXISTS public.fcm_tokens (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    token TEXT NOT NULL UNIQUE,
    device_info JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    is_active BOOLEAN DEFAULT true
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_fcm_tokens_user_id ON public.fcm_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_fcm_tokens_token ON public.fcm_tokens(token);
CREATE INDEX IF NOT EXISTS idx_fcm_tokens_active ON public.fcm_tokens(is_active);

-- Enable RLS (Row Level Security)
ALTER TABLE public.fcm_tokens ENABLE ROW LEVEL SECURITY;

-- RLS Policies for FCM tokens
-- Policy: Users can view their own tokens
CREATE POLICY "Users can view their own FCM tokens" ON public.fcm_tokens
    FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can insert their own tokens
CREATE POLICY "Users can insert their own FCM tokens" ON public.fcm_tokens
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own tokens
CREATE POLICY "Users can update their own FCM tokens" ON public.fcm_tokens
    FOR UPDATE USING (auth.uid() = user_id);

-- Policy: Users can delete their own tokens
CREATE POLICY "Users can delete their own FCM tokens" ON public.fcm_tokens
    FOR DELETE USING (auth.uid() = user_id);

-- Policy: Allow service role to manage all FCM tokens (for server-side operations)
CREATE POLICY "Service role can manage all FCM tokens" ON public.fcm_tokens
    FOR ALL USING (auth.role() = 'service_role');

-- Grant permissions
GRANT ALL ON public.fcm_tokens TO authenticated;
GRANT ALL ON public.fcm_tokens TO service_role;

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$;

-- Create trigger for updated_at
CREATE TRIGGER fcm_tokens_updated_at
    BEFORE UPDATE ON public.fcm_tokens
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Insert some test data (optional)
-- This will be replaced by real tokens when users register
-- INSERT INTO public.fcm_tokens (user_id, token, device_info) VALUES
--     (gen_random_uuid(), 'test_token_1', '{"device": "laptop", "browser": "chrome"}'),
--     (gen_random_uuid(), 'test_token_2', '{"device": "mobile", "browser": "safari"}');

COMMENT ON TABLE public.fcm_tokens IS 'Stores Firebase Cloud Messaging tokens for push notifications';
COMMENT ON COLUMN public.fcm_tokens.user_id IS 'Links FCM token to authenticated user';
COMMENT ON COLUMN public.fcm_tokens.token IS 'Firebase FCM registration token';
COMMENT ON COLUMN public.fcm_tokens.device_info IS 'Device and browser information as JSON';
COMMENT ON COLUMN public.fcm_tokens.is_active IS 'Whether this token is still valid and active';