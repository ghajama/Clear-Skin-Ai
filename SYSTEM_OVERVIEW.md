# SkinAI App - System Overview

## Backend & Database Architecture

### **Supabase Integration**
The app uses Supabase as the complete backend solution providing:
- **PostgreSQL Database**: Hosted and managed by Supabase
- **Authentication**: Email/password + OAuth (Google, Apple)
- **Storage**: File storage for user scan images
- **Real-time**: Built-in real-time capabilities (ready for future features)
- **Row Level Security (RLS)**: Automatic data isolation per user

### **Database Schema**

#### 1. **profiles** table
```sql
- id: UUID (links to auth.users)
- email: TEXT
- name: TEXT
- avatar_url: TEXT
- quiz_completed: BOOLEAN
- subscribed: BOOLEAN  
- skin_score: INTEGER
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

#### 2. **scan_sessions** table
```sql
- id: UUID
- user_id: UUID (links to profiles)
- front_image_url: TEXT
- right_image_url: TEXT
- left_image_url: TEXT
- analysis_result: JSONB
- completed: BOOLEAN
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

#### 3. **quiz_answers** table
```sql
- id: UUID
- user_id: UUID (links to profiles)
- question_id: TEXT
- answer_id: TEXT
- created_at: TIMESTAMP
```

#### 4. **routine_progress** table
```sql
- id: UUID
- user_id: UUID (links to profiles)
- step_id: TEXT
- completed: BOOLEAN
- completed_at: TIMESTAMP
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### **Storage Strategy**

#### **Local Storage (AsyncStorage/localStorage)**
- **Purpose**: Temporary data, caching, offline functionality
- **Data Stored**:
  - Authentication tokens (managed by Supabase)
  - Image cache for scan sessions
  - User preferences and settings
  - Temporary quiz answers
  - Chat history cache

#### **Supabase Storage**
- **Purpose**: Permanent file storage
- **Structure**: 
  ```
  scan-images/
    ├── {user_id}/
    │   ├── front_image.jpg
    │   ├── right_image.jpg
    │   └── left_image.jpg
  ```
- **Security**: User can only access their own folder via RLS policies

#### **Supabase Database**
- **Purpose**: Structured data, relationships, queries
- **Data Stored**:
  - User profiles and authentication
  - Scan session metadata and results
  - Quiz answers and progress
  - Routine tracking and completion

### **Authentication System**

#### **Flow**
1. **Sign Up/In**: User authenticates via Supabase Auth
2. **Profile Creation**: Database trigger automatically creates profile
3. **Session Management**: Supabase handles token refresh automatically
4. **Local Persistence**: Auth state persisted via AsyncStorage

#### **Providers Supported**
- Email/Password
- Google OAuth
- Apple OAuth (iOS only)

#### **Security Features**
- Row Level Security (RLS) on all tables
- User can only access their own data
- Automatic session refresh
- Secure token storage

### **Data Flow Examples**

#### **Photo Scan Process**
1. User takes photos → Stored locally in imageCache
2. Photos uploaded to Supabase Storage → Returns public URLs
3. Scan session created in database with image URLs
4. AI analysis results stored in analysis_result JSONB field

#### **Quiz Process**
1. Answers stored locally during quiz
2. On completion, batch uploaded to quiz_answers table
3. Profile updated with quiz_completed = true
4. Local cache cleared

#### **Routine Tracking**
1. Daily progress stored in routine_progress table
2. Real-time updates possible via Supabase subscriptions
3. Historical data maintained for analytics

### **API Keys & Configuration**

#### **Supabase Configuration**
- **URL**: `https://sogmridxuwqulqxtpoqp.supabase.co`
- **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (public, safe for client)
- **Service Role**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (private, server-only)

#### **Setup Instructions**
1. Run the SQL script in Supabase SQL Editor
2. Create storage bucket: `scan-images`
3. Configure OAuth providers in Supabase Auth settings
4. Update redirect URLs for mobile app

### **Scalability Considerations**

#### **Current Architecture Supports**
- Unlimited users (Supabase scales automatically)
- Large file uploads (Supabase Storage)
- Real-time features (built-in)
- Global CDN for images
- Automatic backups

#### **Future Enhancements**
- **Payments**: Integrate Stripe with Supabase
- **Analytics**: Use Supabase Analytics or external service
- **Push Notifications**: Supabase Edge Functions + FCM
- **AI Processing**: Supabase Edge Functions for image analysis

### **Development vs Production**

#### **Current Setup (Development)**
- Single Supabase project for all environments
- Direct database access from mobile app
- Public anon key used for authentication

#### **Production Recommendations**
- Separate Supabase projects for staging/production
- Environment-specific configuration
- Enhanced monitoring and logging
- Rate limiting and abuse prevention

### **Data Privacy & Compliance**

#### **User Data Protection**
- All user data isolated via RLS
- Images stored in user-specific folders
- No cross-user data access possible
- GDPR-compliant data deletion available

#### **Data Retention**
- User profiles: Retained until account deletion
- Scan images: Can be deleted by user
- Quiz answers: Historical data for improvements
- Routine progress: Analytics and progress tracking

### **Monitoring & Maintenance**

#### **Available Metrics**
- User authentication events
- Database query performance
- Storage usage per user
- API response times

#### **Backup Strategy**
- Automatic daily backups by Supabase
- Point-in-time recovery available
- Manual backup exports possible

This architecture provides a robust, scalable foundation for the SkinAI app with proper security, data isolation, and room for future growth.