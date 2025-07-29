import { createClient } from '@supabase/supabase-js';

// Hardcoded Supabase configuration for immediate fix
const supabaseUrl = 'https://sogmridxuwqulqxtpoqp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvZ21yaWR4dXdxdWxxeHRwb3FwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4NjA1NjYsImV4cCI6MjA2ODQzNjU2Nn0.t7Pm0qLVFAMX17HyKSaGfKFWN5ByyL_MqNTd3Fo_gSA';

console.log('🔧 Supabase config loaded:', { url: supabaseUrl, keyLength: supabaseAnonKey.length });

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Function to initialize and test Supabase connection
export async function initializeSupabase() {
  console.log('🔧 Initializing Supabase...');
  console.log('🌐 Supabase URL:', supabaseUrl);
  console.log('🔑 Supabase Anon Key length:', supabaseAnonKey.length);
  
  try {
    // Test auth configuration only - no database checks
    console.log('🔐 Testing auth configuration...');
    const { data: authData, error: authError } = await supabase.auth.getSession();
    console.log('📱 Current session:', authData?.session ? 'Active' : 'None');
    if (authError) {
      console.error('❌ Auth configuration test failed:', authError);
    } else {
      console.log('✅ Auth configuration test complete');
    }
    
    console.log('✅ Supabase initialization complete');
    return true;
  } catch (error) {
    console.error('❌ Supabase initialization failed:', error);
    throw error;
  }
}

// Listen to auth changes
export function setupAuthListener(callback: (event: string, session: any) => void) {
  const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
    console.log('Auth state changed:', event, session ? 'Session active' : 'No session');
    callback(event, session);
  });
  return authListener;
}