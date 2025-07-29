-- Storage setup for scan-images bucket
-- This script sets up the storage bucket and RLS policies for scan images

-- Create the scan-images bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'scan-images',
  'scan-images',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy: Users can upload images to their own folder
CREATE POLICY "Users can upload scan images to own folder" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'scan-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy: Users can view their own images
CREATE POLICY "Users can view own scan images" ON storage.objects
FOR SELECT USING (
  bucket_id = 'scan-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy: Users can update their own images
CREATE POLICY "Users can update own scan images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'scan-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy: Users can delete their own images
CREATE POLICY "Users can delete own scan images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'scan-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Grant necessary permissions
GRANT ALL ON storage.objects TO authenticated;
GRANT ALL ON storage.buckets TO authenticated;