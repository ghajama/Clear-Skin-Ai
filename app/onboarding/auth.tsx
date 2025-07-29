import React, { useState } from "react";
import { StyleSheet, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert } from "react-native";
import { H2, Body } from "@/components/ui/Typography";
import { colors, spacing, borderRadius } from "@/constants/theme";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { router } from "expo-router";
import Svg, { Path, Circle, Defs, LinearGradient, Stop, Ellipse } from 'react-native-svg';
import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';

const SkincareLogo = ({ size = 60 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 100 100">
    <Defs>
      <LinearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor={colors.primary} />
        <Stop offset="100%" stopColor={colors.accent} />
      </LinearGradient>
    </Defs>
    <Circle
      cx="50"
      cy="50"
      r="40"
      fill="rgba(255, 255, 255, 0.05)"
      stroke="url(#logoGradient)"
      strokeWidth="2.5"
    />
    <Circle
      cx="50"
      cy="50"
      r="28"
      fill="none"
      stroke="url(#logoGradient)"
      strokeWidth="1"
      opacity="0.4"
    />
    <Ellipse cx="42" cy="42" rx="2" ry="3" fill={colors.primary} opacity="0.7" />
    <Ellipse cx="58" cy="42" rx="2" ry="3" fill={colors.primary} opacity="0.7" />
    <Path
      d="M50 48 L49 52 Q50 54 51 52 L50 48"
      fill="none"
      stroke={colors.primary}
      strokeWidth="1.5"
      opacity="0.6"
    />
    <Path
      d="M45 58 Q50 62 55 58"
      fill="none"
      stroke={colors.accent}
      strokeWidth="2"
      opacity="0.8"
    />
  </Svg>
);

export default function AuthScreen() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { signIn, signUp, loading } = useAuth();

  const handleSubmit = async () => {
    // Clear any previous errors
    setError(null);
    
    // Basic validation
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }
    
    if (!password.trim()) {
      setError('Please enter your password');
      return;
    }
    
    if (isSignUp && !name.trim()) {
      setError('Please enter your full name');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    // Password validation
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    try {
      console.log(`🔐 Starting ${isSignUp ? 'sign up' : 'sign in'} process...`);
      
      if (isSignUp) {
        const success = await signUp(name.trim(), email.trim(), password);
        if (success) {
          console.log('✅ Sign up successful!');
          // Show success message
          if (Platform.OS === 'web') {
            alert('Account created successfully! Please check your email to confirm your account.');
          } else {
            Alert.alert(
              'Success!', 
              'Account created successfully! Please check your email to confirm your account.',
              [{ text: 'OK' }]
            );
          }
          router.replace("/onboarding/intro");
        }
      } else {
        const success = await signIn(email.trim(), password);
        if (success) {
          console.log('✅ Sign in successful!');
          router.replace("/onboarding/intro");
        }
      }
    } catch (error: any) {
      console.error('❌ Auth error:', error);
      
      // Handle specific error messages
      let errorMessage = 'Authentication failed. Please try again.';
      
      if (error?.message) {
        const message = error.message.toLowerCase();
        
        if (message.includes('invalid login credentials') || message.includes('invalid email or password')) {
          errorMessage = 'Invalid email or password. Please check your credentials.';
        } else if (message.includes('email not confirmed')) {
          errorMessage = 'Please check your email and confirm your account before signing in.';
        } else if (message.includes('user already registered') || message.includes('email already registered')) {
          errorMessage = 'An account with this email already exists. Please sign in instead.';
          setIsSignUp(false); // Switch to sign in mode
        } else if (message.includes('weak password')) {
          errorMessage = 'Password is too weak. Please choose a stronger password.';
        } else if (message.includes('database error') || message.includes('connection')) {
          errorMessage = 'Connection issue. Please check your internet and try again.';
        } else if (message.includes('timeout')) {
          errorMessage = 'Request timed out. Please try again.';
        } else {
          errorMessage = error.message;
        }
      }
      
      console.log('🚨 Error to show user:', errorMessage);
      setError(errorMessage);
      
      // Also show alert for critical errors
      if (error?.message?.includes('connection') || error?.message?.includes('timeout')) {
        if (Platform.OS === 'web') {
          alert(errorMessage);
        } else {
          Alert.alert('Connection Error', errorMessage, [{ text: 'OK' }]);
        }
      }
    }
  };



  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError(null); // Clear any errors when switching modes
    // Clear form fields when switching modes
    setName("");
    setEmail("");
    setPassword("");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
    >
      <ExpoLinearGradient
        colors={[colors.background, `${colors.primary}08`, colors.background]}
        style={styles.gradient}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <View style={styles.header}>
              <SkincareLogo size={70} />
              <H2 style={styles.title}>SkinAI</H2>
              <Body style={styles.subtitle}>
                {isSignUp
                  ? "Join thousands transforming their skin"
                  : "Welcome back to your skincare journey"}
              </Body>
            </View>

            <View style={styles.authSection}>
              {error && (
                <View style={styles.errorContainer}>
                  <Body style={styles.errorText}>{error}</Body>
                </View>
              )}

              <View style={styles.form}>
                {isSignUp && (
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      placeholder="Full Name"
                      value={name}
                      onChangeText={setName}
                      autoCapitalize="words"
                      placeholderTextColor={colors.text.secondary}
                    />
                  </View>
                )}

                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Email Address"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholderTextColor={colors.text.secondary}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    placeholderTextColor={colors.text.secondary}
                  />
                </View>

                <Button
                  title={isSignUp ? "Create Account" : "Sign In"}
                  onPress={handleSubmit}
                  loading={loading}
                  style={styles.submitButton}
                  disabled={
                    loading ||
                    (isSignUp && (!name.trim() || !email.trim() || !password.trim())) ||
                    (!isSignUp && (!email.trim() || !password.trim()))
                  }
                />
              </View>
            </View>

            <View style={styles.footer}>
              <Body style={styles.footerText}>
                {isSignUp ? "Already have an account?" : "Don't have an account?"}
              </Body>
              <TouchableOpacity onPress={toggleMode} style={styles.footerButton}>
                <Body style={styles.footerLink}>
                  {isSignUp ? "Sign In" : "Sign Up"}
                </Body>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </ExpoLinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    minHeight: '100%',
  },
  content: {
    flex: 1,
    padding: spacing.xl,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  title: {
    marginTop: spacing.m,
    marginBottom: spacing.s,
    textAlign: "center",
    fontSize: 28,
    fontWeight: '700' as const,
    color: colors.text.primary,
  },
  subtitle: {
    color: colors.text.secondary,
    textAlign: "center",
    fontSize: 16,
    lineHeight: 22,
  },
  authSection: {
    marginBottom: spacing.xl,
  },
  providerButtons: {
    gap: spacing.m,
    marginBottom: spacing.l,
  },
  providerButton: {
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: spacing.l,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
    opacity: 0.5,
  },
  dividerText: {
    marginHorizontal: spacing.m,
    color: colors.text.secondary,
    fontSize: 13,
  },
  form: {
    gap: spacing.m,
  },
  inputContainer: {
    // No margin needed due to gap in parent
  },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.l,
    padding: spacing.l,
    fontSize: 16,
    fontFamily: Platform.OS === "ios" ? "Avenir Next" : "sans-serif",
    color: colors.text.primary,
  },
  submitButton: {
    marginTop: spacing.m,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: Platform.OS === 'ios' ? spacing.l : spacing.m,
  },
  footerButton: {
    marginLeft: spacing.xs,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.s,
  },
  footerText: {
    color: colors.text.secondary,
    fontSize: 15,
  },
  footerLink: {
    color: colors.primary,
    fontWeight: "600" as const,
    fontSize: 15,
  },
  errorContainer: {
    backgroundColor: `${colors.error || '#FF6B6B'}15`,
    borderColor: colors.error || '#FF6B6B',
    borderWidth: 1,
    borderRadius: borderRadius.m,
    padding: spacing.m,
    marginBottom: spacing.m,
  },
  errorText: {
    color: colors.error || '#FF6B6B',
    fontSize: 14,
    textAlign: 'center',
  },
});