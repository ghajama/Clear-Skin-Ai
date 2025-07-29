# Supabase Authentication & Storage System Guide

## Overview

This guide explains the complete Supabase integration for your skincare app, including authentication, database structure, image storage, and data management.

## 🔧 Setup Instructions

### 1. Database Setup
1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `supabase-setup.sql`
4. Run the script to create all tables, policies, and functions

### 2. Storage Setup
The script automatically creates two storage buckets:
- `scan-images`: For storing user's skin scan photos
- `avatars`: For user profile pictures

## 📊 Database Schema

### Tables Structure

#### `profiles`
- **Purpose**: User profile information
- **Fields**:
  - `id`: UUID (references auth.users)
  - `email`: User's email address
  - `name`: User's display name
  - `avatar_url`: Profile picture URL
  - `quiz_completed`: Boolean flag for quiz completion
  - `subscribed`: Boolean flag for subscription status
  - `skin_score`: Overall skin health score (1-10)
  - `created_at`, `updated_at`: Timestamps

#### `scan_sessions`
- **Purpose**: Store user's skin scan sessions and analysis results
- **Fields**:
  - `id`: UUID primary key
  - `user_id`: References profiles.id
  - `front_image_url`: URL to front face photo
  - `right_image_url`: URL to right profile photo
  - `left_image_url`: URL to left profile photo
  - `analysis_result`: JSONB containing AI analysis results
  - `completed`: Boolean flag for session completion
  - `created_at`, `updated_at`: Timestamps

#### `quiz_answers`
- **Purpose**: Store user's quiz responses
- **Fields**:
  - `id`: UUID primary key
  - `user_id`: References profiles.id
  - `question_id`: Identifier for the quiz question
  - `answer_id`: Identifier for the selected answer
  - `created_at`: Timestamp

#### `routine_progress`
- **Purpose**: Track user's skincare routine progress
- **Fields**:
  - `id`: UUID primary key
  - `user_id`: References profiles.id
  - `step_id`: Identifier for the routine step
  - `completed`: Boolean completion status
  - `completed_at`: Timestamp when completed
  - `created_at`, `updated_at`: Timestamps

## 🔐 Authentication System

### How It Works
1. **Sign Up**: Creates user in `auth.users` and automatically creates profile in `profiles` table
2. **Sign In**: Authenticates user and loads profile data
3. **OAuth**: Supports Google and Apple sign-in (requires additional setup)
4. **Session Management**: Handles token refresh and persistence across app restarts

### Authentication Methods
```typescript
// Email/Password
await signUp(name, email, password)
await signIn(email, password)

// OAuth Providers
await signInWithProvider('google')
await signInWithProvider('apple')

// Sign Out
await signOut()
```

## 💾 Data Storage Strategy

### Local vs Cloud Storage

#### What's Stored Locally (AsyncStorage/localStorage):
- **Temporary data**: Current scan session images (for offline capability)
- **Cache**: Recently accessed data for better performance
- **Fallback**: When user is offline or not authenticated

#### What's Stored in Supabase:
- **User profiles**: All user account information
- **Images**: Scan photos uploaded to Supabase Storage
- **Quiz answers**: Persistent across devices
- **Routine progress**: Synced across devices
- **Analysis results**: AI-generated skin analysis data

### Data Synchronization
The app uses a hybrid approach:
1. **Write-through**: Data is saved locally first, then synced to Supabase
2. **Read-through**: Data is loaded from Supabase when available, falls back to local storage
3. **Conflict resolution**: Supabase data takes precedence over local data

## 🖼️ Image Storage System

### How Images Are Handled
1. **Capture**: User takes photo with camera or selects from gallery
2. **Local Cache**: Image is immediately saved to local cache with mirror effect info
3. **Upload**: If authenticated, image is uploaded to Supabase Storage
4. **Database Update**: Image URL is saved to `scan_sessions` table
5. **Cleanup**: Old images can be automatically cleaned up

### Image Organization
```
scan-images/
├── {user_id}/
│   ├── front_1234567890.jpg
│   ├── right_1234567890.jpg
│   └── left_1234567890.jpg
```

### Mirror Effect Handling
- Front-facing camera images are automatically mirrored for better UX
- Mirror information is stored in local cache
- Gallery images are not mirrored

## 🔒 Security & Privacy

### Row Level Security (RLS)
- All tables have RLS enabled
- Users can only access their own data
- Storage policies ensure users can only access their own images

### Data Privacy
- Images are stored in user-specific folders
- All data is encrypted in transit and at rest
- Users can delete their data at any time

## 🚀 Usage in Your App

### Authentication Hook
```typescript
const { user, loading, signIn, signUp, signOut, isAuthenticated } = useAuth();
```

### Skincare Data Hook
```typescript
const { 
  scanResults, 
  skinScore, 
  quizAnswers, 
  uploadScanImage, 
  saveQuizAnswer,
  analyzeSkin 
} = useSkincare();
```

### Image Upload Example
```typescript
// Upload scan image
await uploadScanImage(imageUri, 'front', true); // true for mirror effect

// The system automatically:
// 1. Saves to local cache
// 2. Uploads to Supabase Storage (if authenticated)
// 3. Updates database record
// 4. Handles errors gracefully
```

## 📱 Offline Support

### What Works Offline:
- Taking and viewing photos
- Completing quizzes (saved locally)
- Viewing previously loaded data
- Basic app navigation

### What Requires Internet:
- User authentication
- Image uploads to cloud
- Data synchronization
- AI analysis results

### Sync Strategy:
- When app comes back online, local data is automatically synced
- Conflicts are resolved by preferring server data
- Failed uploads are retried automatically

## 🔧 Configuration

### Environment Variables
The app uses these Supabase configuration values:
- `supabaseUrl`: Your Supabase project URL
- `supabaseAnonKey`: Your Supabase anonymous key

### Storage Buckets
- `scan-images`: Public bucket for scan photos
- `avatars`: Public bucket for profile pictures

## 📊 Data Flow Examples

### User Registration Flow:
1. User enters name, email, password
2. `supabase.auth.signUp()` creates auth user
3. Database trigger creates profile record
4. User is automatically signed in
5. Profile data is loaded into app state

### Skin Scan Flow:
1. User takes three photos (front, right, left)
2. Images are saved to local cache with mirror info
3. If authenticated, images are uploaded to Supabase Storage
4. Database record is created/updated with image URLs
5. AI analysis is performed and results are saved
6. User sees analysis results and skin score

### Quiz Completion Flow:
1. User answers quiz questions
2. Each answer is immediately saved locally and to Supabase
3. Quiz completion triggers skin analysis
4. Results are saved to user profile
5. User is redirected to results page

## 🛠️ Troubleshooting

### Common Issues:

#### "AsyncStorage is not defined"
- This error occurs on web - the system automatically handles this with fallbacks

#### "Failed to upload image"
- Check internet connection
- Verify Supabase storage policies
- Ensure user is authenticated

#### "Profile not found"
- User might not be properly authenticated
- Check if profile was created during signup
- Verify database triggers are working

### Debug Tips:
- Check browser console for detailed error messages
- Use Supabase dashboard to verify data is being saved
- Check network tab for failed API calls

## 🔄 Data Migration

If you need to migrate existing local data to Supabase:
1. User signs up/signs in
2. Local data is automatically synced to Supabase
3. Subsequent app launches will use Supabase data
4. Local data serves as backup/cache

## 📈 Monitoring & Analytics

### What to Monitor:
- User registration/login success rates
- Image upload success rates
- Database query performance
- Storage usage
- API error rates

### Supabase Dashboard:
- View real-time database activity
- Monitor storage usage
- Check authentication logs
- Review API usage statistics

## 🎯 Best Practices

### Performance:
- Images are compressed before upload
- Local caching reduces API calls
- Lazy loading for large datasets
- Efficient query patterns with proper indexes

### User Experience:
- Offline-first approach
- Graceful error handling
- Loading states for all async operations
- Automatic retry for failed operations

### Security:
- All data access is authenticated
- Row-level security prevents data leaks
- Images are stored in user-specific folders
- Sensitive operations require re-authentication

This system provides a robust, scalable foundation for your skincare app with proper data management, security, and user experience considerations.