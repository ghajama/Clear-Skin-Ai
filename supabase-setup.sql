-- Supabase Database Setup Script
-- Run this in your Supabase SQL Editor
-- Make sure to run this as a single script in the SQL Editor

-- First, let's clean up any existing setup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  avatar_url TEXT,
  quiz_completed BOOLEAN DEFAULT FALSE,
  subscribed BOOLEAN DEFAULT FALSE,
  skin_score INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create scan_sessions table
CREATE TABLE IF NOT EXISTS scan_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  front_image_url TEXT,
  right_image_url TEXT,
  left_image_url TEXT,
  analysis_result JSONB,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create quiz_answers table
CREATE TABLE IF NOT EXISTS quiz_answers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  question_id TEXT NOT NULL,
  answer_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, question_id)
);

-- Create routine_progress table
CREATE TABLE IF NOT EXISTS routine_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  step_id TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, step_id)
);

-- Create storage bucket for scan images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('scan-images', 'scan-images', true)
ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE scan_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE routine_progress ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view own scan sessions" ON scan_sessions;
DROP POLICY IF EXISTS "Users can insert own scan sessions" ON scan_sessions;
DROP POLICY IF EXISTS "Users can update own scan sessions" ON scan_sessions;
DROP POLICY IF EXISTS "Users can view own quiz answers" ON quiz_answers;
DROP POLICY IF EXISTS "Users can insert own quiz answers" ON quiz_answers;
DROP POLICY IF EXISTS "Users can update own quiz answers" ON quiz_answers;
DROP POLICY IF EXISTS "Users can view own routine progress" ON routine_progress;
DROP POLICY IF EXISTS "Users can insert own routine progress" ON routine_progress;
DROP POLICY IF EXISTS "Users can update own routine progress" ON routine_progress;
DROP POLICY IF EXISTS "Users can upload scan images" ON storage.objects;
DROP POLICY IF EXISTS "Users can view scan images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update scan images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete scan images" ON storage.objects;

-- Create RLS policies for profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for scan_sessions
CREATE POLICY "Users can view own scan sessions" ON scan_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own scan sessions" ON scan_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own scan sessions" ON scan_sessions
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for quiz_answers
CREATE POLICY "Users can view own quiz answers" ON quiz_answers
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quiz answers" ON quiz_answers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own quiz answers" ON quiz_answers
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for routine_progress
CREATE POLICY "Users can view own routine progress" ON routine_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own routine progress" ON routine_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own routine progress" ON routine_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- Create storage policies for scan images
CREATE POLICY "Users can upload scan images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'scan-images' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view scan images" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'scan-images' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update scan images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'scan-images' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete scan images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'scan-images' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $
BEGIN
  -- Create profile for new user
  INSERT INTO profiles (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scan_sessions_updated_at
  BEFORE UPDATE ON scan_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_routine_progress_updated_at
  BEFORE UPDATE ON routine_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_scan_sessions_user_id ON scan_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_scan_sessions_created_at ON scan_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quiz_answers_user_id ON quiz_answers(user_id);
CREATE INDEX IF NOT EXISTS idx_routine_progress_user_id ON routine_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;