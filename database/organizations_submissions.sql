-- SantVaani Organizations Submission System
-- Run this in Supabase SQL Editor

-- ============================================
-- Organizations Submissions Table
-- ============================================

CREATE TABLE IF NOT EXISTS organization_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Basic Information
  organization_name TEXT NOT NULL,
  organization_name_hi TEXT,
  organization_type TEXT NOT NULL CHECK (organization_type IN ('vridh_ashram', 'orphanage', 'dharamshala', 'temple', 'gaushala', 'other')),

  -- Contact Information
  contact_person TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,

  -- Location
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  address TEXT,
  pincode TEXT,

  -- Details
  description TEXT,
  description_hi TEXT,
  established_year INTEGER,

  -- Additional Information (filled after approval by admin)
  capacity INTEGER,
  needs TEXT[], -- Array of needs
  upi_id TEXT,

  -- Approval System
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES auth.users(id)
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_org_submissions_status ON organization_submissions(status);
CREATE INDEX IF NOT EXISTS idx_org_submissions_created ON organization_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_org_submissions_type ON organization_submissions(organization_type);

-- Enable Row Level Security
ALTER TABLE organization_submissions ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can submit (insert)
CREATE POLICY "Anyone can submit organizations"
  ON organization_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Policy: Only approved organizations are publicly visible
CREATE POLICY "Approved organizations are publicly visible"
  ON organization_submissions
  FOR SELECT
  TO anon, authenticated
  USING (status = 'approved');

-- Policy: Admins can see all submissions (you'll need to create an admin role or use service key)
-- For now, we'll handle admin access via service role key in backend

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_organization_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER organization_updated_at
  BEFORE UPDATE ON organization_submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_organization_updated_at();

-- Grant permissions
GRANT SELECT ON organization_submissions TO anon;
GRANT SELECT ON organization_submissions TO authenticated;
GRANT INSERT ON organization_submissions TO anon;
GRANT INSERT ON organization_submissions TO authenticated;
