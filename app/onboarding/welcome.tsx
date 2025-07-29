import React, { useEffect } from "react";
import { StyleSheet, View, SafeAreaView, Dimensions } from "react-native";
import { H1, Body } from "@/components/ui/Typography";
import { colors, spacing, borderRadius } from "@/constants/theme";
import { Button } from "@/components/ui/Button";
import { router } from "expo-router";
import Svg, { Path, Circle, Defs, LinearGradient, Stop, Ellipse } from 'react-native-svg';
import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';
import { useCameraPermissions } from 'expo-camera';

const { width, height } = Dimensions.get('window');

const SkincareLogo = ({ size = 100 }: { size?: number }) => (
  <View style={styles.logoContainer}>
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
  </View>
);

export default function WelcomeScreen() {
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, []);

  const handleStartDiagnostic = () => {
    router.push('/onboarding/auth');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ExpoLinearGradient
        colors={[colors.background, `${colors.primary}10`, colors.background]}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <View style={styles.logoSection}>
            <View style={styles.logoWrapper}>
              <SkincareLogo size={140} />
            </View>
            <H1 style={styles.title}>Welcome to SkinAI</H1>
            <Body style={styles.subtitle}>
              Discover your perfect skincare routine with personalized AI-powered analysis
            </Body>
            <View style={styles.features}>
              <View style={styles.feature}>
                <View style={styles.featureDot} />
                <Body style={styles.featureText}>AI-powered skin analysis</Body>
              </View>
              <View style={styles.feature}>
                <View style={styles.featureDot} />
                <Body style={styles.featureText}>Personalized recommendations</Body>
              </View>
              <View style={styles.feature}>
                <View style={styles.featureDot} />
                <Body style={styles.featureText}>Track your progress</Body>
              </View>
            </View>
          </View>

          <View style={styles.footer}>
            <Button
              title="Start Your Journey"
              onPress={handleStartDiagnostic}
              size="large"
              style={styles.button}
            />
          </View>
        </View>
      </ExpoLinearGradient>
    </SafeAreaView>
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
  content: {
    flex: 1,
    justifyContent: "space-between",
    padding: spacing.xl,
  },
  logoSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: spacing.xxl,
  },
  logoContainer: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  logoWrapper: {
    marginBottom: spacing.xl,
  },
  title: {
    color: colors.text.primary,
    textAlign: "center",
    marginBottom: spacing.m,
    fontSize: 36,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
  },
  subtitle: {
    color: colors.text.secondary,
    textAlign: "center",
    fontSize: 18,
    lineHeight: 26,
    paddingHorizontal: spacing.l,
    marginBottom: spacing.xl,
  },
  features: {
    alignItems: 'flex-start',
    gap: spacing.m,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s,
  },
  featureDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  featureText: {
    color: colors.text.secondary,
    fontSize: 16,
  },
  footer: {
    paddingBottom: spacing.l,
  },
  button: {
    width: "100%",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
});