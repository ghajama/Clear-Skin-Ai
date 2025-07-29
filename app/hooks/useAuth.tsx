import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

export default function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Auth state changed: INITIAL_SESSION', session ? 'Session active' : 'No session');
      setUser(session?.user ? { 
        id: session.user.id, 
        email: session.user.email || '', 
        firstName: session.user.user_metadata?.firstName,
        lastName: session.user.user_metadata?.lastName
      } : null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: string, session: any) => {
      setUser(session?.user ? { 
        id: session.user.id, 
        email: session.user.email || '', 
        firstName: session.user.user_metadata?.firstName,
        lastName: session.user.user_metadata?.lastName
      } : null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setError(null);
    setLoading(true);
    console.log('🔐 Starting sign in process...');
    console.log('📋 Sign in data:', { email });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        console.error('Sign in error:', error);
        console.error('Auth error details:', JSON.stringify(error, null, 2));
        console.error('Sign in failed:', error.message);
        setError(error.message);
        throw error;
      }
      console.log('✅ Sign in successful', data.user ? 'User data received' : 'No user data');
      return data.user;
    } catch (err) {
      console.error('Auth error:', err);
      setError(err instanceof Error ? err.message : 'Authentication failed. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, firstName?: string, lastName?: string) => {
    setError(null);
    setLoading(true);
    console.log('🔐 Starting sign up process...');
    console.log('📋 Sign up data:', { email, firstName, lastName });
    
    // Validate password length
    if (password.length < 6) {
      const errorMsg = 'Password must be at least 6 characters long';
      console.error('❌ Password validation failed:', errorMsg);
      setError(errorMsg);
      setLoading(false);
      throw new Error(errorMsg);
    }
    
    try {
      const signUpData: any = {
        email,
        password,
      };
      
      // Only add metadata if provided
      if (firstName || lastName) {
        signUpData.options = {
          data: {
            firstName: firstName || '',
            lastName: lastName || '',
          },
        };
      }
      
      console.log('📤 Sending sign up request to Supabase...');
      const { data, error } = await supabase.auth.signUp(signUpData);
      
      if (error) {
        console.error('❌ Sign up error:', error);
        console.error('❌ Auth error details:', JSON.stringify(error, null, 2));
        console.error('❌ Sign up failed:', error.message);
        
        // Handle specific error types
        let userFriendlyMessage = 'There was an issue creating your account. Please try again.';
        if (error.message.includes('weak_password')) {
          userFriendlyMessage = 'Password must be at least 6 characters long';
        } else if (error.message.includes('invalid_email')) {
          userFriendlyMessage = 'Please enter a valid email address';
        } else if (error.message.includes('email_address_invalid')) {
          userFriendlyMessage = 'Please enter a valid email address';
        } else if (error.message.includes('signup_disabled')) {
          userFriendlyMessage = 'Sign up is currently disabled. Please contact support.';
        }
        
        setError(userFriendlyMessage);
        throw error;
      }
      
      console.log('✅ Sign up successful:', {
        user: data.user ? 'User created' : 'No user data',
        session: data.session ? 'Session created' : 'No session',
        needsConfirmation: !data.session && data.user && !data.user.email_confirmed_at
      });
      
      if (!data.session && data.user && !data.user.email_confirmed_at) {
        console.log('📧 Email confirmation required');
        setError('Please check your email and click the confirmation link to complete your registration.');
      }
      
      return data.user;
    } catch (err: any) {
      console.error('❌ Auth error:', err);
      const errorMessage = err?.message || 'There was an issue creating your account. Please try again.';
      console.log('Error to show user:', errorMessage);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (err) {
      console.error('Sign out error:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred during sign out');
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    signIn,
    signUp,
    signOut,
    loading,
    error,
  };
}
