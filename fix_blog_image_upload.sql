-- Fix Blog Image Upload - Supabase Storage RLS Policies
-- Run this in Supabase SQL Editor

-- First, check if policies exist and drop them if they do
DROP POLICY IF EXISTS "Allow authenticated uploads to blog-images" ON storage.objects;
DROP POLICY IF EXISTS "Public read access to blog images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated updates to blog-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes from blog-images" ON storage.objects;

-- Allow authenticated users (admins) to upload to blog-images folder
CREATE POLICY "Allow authenticated uploads to blog-images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'santvaani-assets' AND
  (storage.foldername(name))[1] = 'blog-images'
);

-- Allow public read access to blog images (so users can see them)
CREATE POLICY "Public read access to blog images"
ON storage.objects
FOR SELECT
TO public
USING (
  bucket_id = 'santvaani-assets' AND
  (storage.foldername(name))[1] = 'blog-images'
);

-- Allow authenticated users to update their uploads
CREATE POLICY "Allow authenticated updates to blog-images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'santvaani-assets' AND
  (storage.foldername(name))[1] = 'blog-images'
)
WITH CHECK (
  bucket_id = 'santvaani-assets' AND
  (storage.foldername(name))[1] = 'blog-images'
);

-- Allow authenticated users to delete their uploads
CREATE POLICY "Allow authenticated deletes from blog-images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'santvaani-assets' AND
  (storage.foldername(name))[1] = 'blog-images'
);

-- Verify policies were created
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'objects'
AND schemaname = 'storage'
AND policyname LIKE '%blog-images%';
