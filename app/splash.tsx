import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Dimensions } from 'react-native';
import { colors } from '@/constants/theme';
import { router } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import Svg, { Path, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

const SkincareLogo = ({ size = 80 }: { size?: number }) => (
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
      r="45"
      fill="url(#logoGradient)"
      opacity="0.1"
    />
    <Circle
      cx="50"
      cy="50"
      r="35"
      fill="none"
      stroke="url(#logoGradient)"
      strokeWidth="2"
    />
    <Path
      d="M30 45 Q50 25 70 45 Q50 65 30 45"
      fill="url(#logoGradient)"
      opacity="0.8"
    />
    <Circle cx="40" cy="40" r="3" fill={colors.primary} opacity="0.6" />
    <Circle cx="60" cy="40" r="3" fill={colors.primary} opacity="0.6" />
    <Circle cx="50" cy="55" r="2" fill={colors.accent} opacity="0.8" />
  </Svg>
);

export default function SplashScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const { isAuthenticated, loading, user } = useAuth();

  useEffect(() => {
    const animateIn = () => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    };

    const navigate = () => {
      console.log('🚀 Navigating from splash:', { isAuthenticated, loading, userSubscribed: user?.subscribed });
      
      if (isAuthenticated && user?.subscribed) {
        router.replace('/(tabs)');
      } else {
        router.replace('/onboarding/welcome');
      }
    };

    // Main timer - wait for auth to load
    const mainTimer = setTimeout(() => {
      if (!loading) {
        navigate();
      }
    }, 2500);

    // Fallback timer - navigate anyway after 5 seconds to prevent getting stuck
    const fallbackTimer = setTimeout(() => {
      console.log('⚠️ Fallback navigation triggered - auth loading took too long');
      navigate();
    }, 5000);

    animateIn();

    return () => {
      clearTimeout(mainTimer);
      clearTimeout(fallbackTimer);
    };
  }, [fadeAnim, scaleAnim, isAuthenticated, loading, user]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <SkincareLogo size={120} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});