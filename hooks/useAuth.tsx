import createContextHook from '@nkzw/create-context-hook';
import { useEffect, useState } from 'react';
import { UserProfile } from '@/types';
import { router } from 'expo-router';
import { supabase, Database } from '@/lib/supabase';
import { AuthError, User, Session } from '@supabase/supabase-js';

type SupabaseProfile = Database['public']['Tables']['profiles']['Row'];

export const [AuthProvider, useAuth] = createContextHook(() => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  // Convert Supabase profile to UserProfile
  const convertProfile = (profile: SupabaseProfile): UserProfile => ({
    id: profile.id,
    name: profile.name || '',
    email: profile.email,
    quizCompleted: profile.quiz_completed,
    subscribed: profile.subscribed,
    skinScore: profile.skin_score ? {
      overall: profile.skin_score,
      acne: Math.floor(Math.random() * 10) + 1,
      hydration: Math.floor(Math.random() * 10) + 1,
      sunDamage: Math.floor(Math.random() * 10) + 1,
      dryness: Math.floor(Math.random() * 10) + 1,
      recommendations: [],
      issues: [],
    } : undefined,
  });

  // Load user session on mount
  useEffect(() => {
    const getSession = async () => {
      try {
        console.log('🔍 Getting session...');
        
        // Add timeout to prevent hanging
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Session timeout')), 10000)
        );
        
        const { data: { session }, error } = await Promise.race([
          sessionPromise,
          timeoutPromise
        ]) as any;
        
        if (error) {
          console.error('Session error:', error);
          setLoading(false);
          return;
        }

        console.log('✅ Session retrieved:', session ? 'authenticated' : 'not authenticated');
        setSession(session);
        
        if (session?.user) {
          await loadUserProfile(session.user.id);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Failed to get session:', error);
        console.log('⚠️ Continuing without authentication due to connection issues');
        setLoading(false);
      }
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setSession(session);
        
        if (session?.user) {
          await loadUserProfile(session.user.id);
        } else {
          setUser(null);
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      console.log('👤 Loading user profile for:', userId);
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Profile load error:', error);
        
        // If profile doesn't exist, try to create it
        if (error.code === 'PGRST116') {
          console.log('📝 Profile not found, creating new profile...');
          await createUserProfileFromAuth(userId);
          return;
        }
        return;
      }

      if (profile) {
        console.log('✅ Profile loaded successfully');
        setUser(convertProfile(profile));
      }
    } catch (error) {
      console.error('Failed to load user profile:', error);
    }
  };

  const createUserProfile = async (user: User, name?: string) => {
    try {
      console.log('📝 Creating user profile for:', user.id);
      
      const { error } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email || '',
          name: name || null,
          quiz_completed: false,
          subscribed: false,
        });

      if (error) {
        console.error('Profile creation error:', error);
        throw error;
      }

      console.log('✅ Profile created successfully');
      await loadUserProfile(user.id);
    } catch (error) {
      console.error('Failed to create user profile:', error);
      throw error;
    }
  };

  const createUserProfileFromAuth = async (userId: string) => {
    try {
      console.log('📝 Creating profile from auth user:', userId);
      
      // Get user data from auth
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error('Failed to get auth user:', userError);
        return;
      }
      
      const { error } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          email: user.email || '',
          name: user.user_metadata?.name || null,
          quiz_completed: false,
          subscribed: false,
        });

      if (error) {
        console.error('Profile creation from auth error:', error);
        return;
      }

      console.log('✅ Profile created from auth successfully');
      await loadUserProfile(userId);
    } catch (error) {
      console.error('Failed to create profile from auth:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      console.log('🔐 Starting sign in process...');
      
      // Add timeout to prevent hanging
      const signInPromise = supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Sign in request timed out. Please try again.')), 15000)
      );
      
      const { data, error } = await Promise.race([
        signInPromise,
        timeoutPromise
      ]) as any;

      if (error) {
        console.error('Sign in error:', error);
        
        // Enhance error message for better user experience
        if (error.message?.includes('Invalid login credentials')) {
          throw new Error('Invalid email or password. Please check your credentials.');
        } else if (error.message?.includes('Email not confirmed')) {
          throw new Error('Please check your email and confirm your account before signing in.');
        } else if (error.message?.includes('Database error')) {
          throw new Error('Connection issue. Please check your internet and try again.');
        }
        
        throw error;
      }

      console.log('✅ Sign in successful:', data.user?.id);
      
      if (data.user) {
        await loadUserProfile(data.user.id);
      }

      return true;
    } catch (error) {
      console.error('Sign in failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };



  const signUp = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      console.log('🔐 Starting sign up process...');
      
      // Add timeout to prevent hanging
      const signUpPromise = supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });
      
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Sign up request timed out. Please try again.')), 15000)
      );
      
      const { data, error } = await Promise.race([
        signUpPromise,
        timeoutPromise
      ]) as any;

      if (error) {
        console.error('Sign up error:', error);
        console.error('Auth error details:', JSON.stringify(error, null, 2));
        
        // Enhance error message for better user experience
        if (error.message?.includes('Database error')) {
          throw new Error('Unable to create account. Please check your internet connection and try again.');
        } else if (error.message?.includes('User already registered')) {
          throw new Error('An account with this email already exists. Please sign in instead.');
        } else if (error.message?.includes('Invalid email')) {
          throw new Error('Please enter a valid email address.');
        } else if (error.message?.includes('Password')) {
          throw new Error('Password must be at least 6 characters long.');
        }
        
        throw error;
      }

      console.log('✅ Sign up successful:', data.user?.id);
      
      // If user is immediately confirmed (no email confirmation required)
      if (data.user && !data.user.email_confirmed_at) {
        console.log('📧 Email confirmation required');
      } else if (data.user) {
        console.log('✅ User confirmed, loading profile...');
        await loadUserProfile(data.user.id);
      }

      return true;
    } catch (error) {
      console.error('Sign up failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Sign out error:', error);
        return;
      }

      setUser(null);
      setSession(null);
      router.replace('/onboarding/welcome');
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  const updateUser = async (updates: Partial<UserProfile>) => {
    if (!user || !session?.user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: updates.name,
          quiz_completed: updates.quizCompleted,
          subscribed: updates.subscribed,
          skin_score: updates.skinScore?.overall,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) {
        console.error('Update user error:', error);
        return;
      }

      // Update local state
      setUser({ ...user, ...updates });
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  return {
    user,
    loading,
    session,
    signIn,
    signUp,
    signOut,
    updateUser,
    isAuthenticated: !!session?.user,
  };
});