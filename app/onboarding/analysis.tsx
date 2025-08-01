import React, { useEffect, useState } from "react";
import { StyleSheet, View, SafeAreaView, Dimensions, Text } from "react-native";
import { H2, Body } from "@/components/ui/Typography";
import { colors, spacing, borderRadius, shadows } from "@/constants/theme";
import { router, Stack } from "expo-router";
import { SafeImage as Image } from "@/components/ui/SafeImage";
import { LinearGradient } from "expo-linear-gradient";
import { imageCache, ScanImage } from "@/lib/storage";
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withRepeat, 
  withSequence,
  interpolate
} from "react-native-reanimated";
import Svg, { Path, Circle, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';

const { width } = Dimensions.get("window");

const SkincareLogo = ({ size = 60 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 100 100">
    <Defs>
      <SvgLinearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor={colors.primary} />
        <Stop offset="100%" stopColor={colors.accent} />
      </SvgLinearGradient>
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

export default function AnalysisScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [scanResults, setScanResults] = useState<{
    front?: ScanImage;
    right?: ScanImage;
    left?: ScanImage;
  }>({});

  const progress = useSharedValue(0);
  const pulseAnimation = useSharedValue(1);

  const steps = [
    { title: "Processing Images", icon: () => <Text style={{ fontSize: 16 }}>⚡</Text>, duration: 2000 },
    { title: "Analyzing Skin Texture", icon: () => <Text style={{ fontSize: 16 }}>🧠</Text>, duration: 2500 },
    { title: "Generating Report", icon: () => <Text style={{ fontSize: 16 }}>✅</Text>, duration: 1500 }
  ];

  // Always show 3 image slots, regardless of availability
  const images = [
    { uri: scanResults.front?.uri || '', label: "Front", type: 'front' as const },
    { uri: scanResults.right?.uri || '', label: "Right", type: 'right' as const },
    { uri: scanResults.left?.uri || '', label: "Left", type: 'left' as const }
  ];

  const loadScanResults = async () => {
    try {
      const [front, right, left] = await Promise.all([
        imageCache.getImage('front'),
        imageCache.getImage('right'),
        imageCache.getImage('left'),
      ]);

      console.log('🔬 [Analysis] Scan results:', { front, right, left });

      setScanResults({
        front: front || undefined,
        right: right || undefined,
        left: left || undefined,
      });
    } catch (error) {
      console.error('Failed to load scan results:', error);
    }
  };

  useEffect(() => {
    loadScanResults();
  }, []);

  // Separate effect for polling that depends on scanResults
  useEffect(() => {
    const missingImages = images.filter(img => !img.uri);

    if (missingImages.length > 0) {
      console.log('🔄 [Analysis] Setting up polling for missing images:', missingImages.map(img => img.type));

      const pollInterval = setInterval(() => {
        loadScanResults();
      }, 2000);

      // Cleanup interval
      return () => {
        console.log('🛑 [Analysis] Stopping polling');
        clearInterval(pollInterval);
      };
    } else {
      console.log('✅ [Analysis] All images loaded, no polling needed');
    }
  }, [scanResults.front, scanResults.right, scanResults.left]);

  useEffect(() => {
    const performAnalysis = async () => {
      // Start pulse animation
      pulseAnimation.value = withRepeat(
        withSequence(
          withTiming(1.1, { duration: 800 }),
          withTiming(1, { duration: 800 })
        ),
        -1,
        true
      );
      
      // Progress through steps
      for (let i = 0; i < steps.length; i++) {
        setCurrentStep(i);
        progress.value = withTiming((i + 1) / steps.length, { duration: steps[i].duration });
        await new Promise(resolve => setTimeout(resolve, steps[i].duration));
      }
      
      setAnalysisComplete(true);

      setTimeout(() => {
        router.push("/onboarding/quiz/1");
      }, 1000);
    };

    performAnalysis();
  }, []);

  const progressStyle = useAnimatedStyle(() => {
    return {
      width: `${interpolate(progress.value, [0, 1], [0, 100])}%`,
    };
  });
  
  const pulseStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pulseAnimation.value }]
    };
  });

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[colors.background, colors.secondary]}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Animated.View style={pulseStyle}>
              <SkincareLogo size={80} />
            </Animated.View>
            <H2 style={styles.title}>Analyzing Your Skin</H2>
            <Body style={styles.subtitle}>
              Our AI is processing your photos to create a personalized skincare plan
            </Body>
          </View>
          
          {/* Images Grid */}
          <View style={styles.imagesContainer}>
            {images.map((image, index) => (
              <View key={index} style={styles.imageWrapper}>
                <View style={styles.imageContainer}>
                  {image.uri ? (
                    <>
                      <Image
                        source={{ uri: image.uri }}
                        style={styles.scanImage}
                        contentFit="cover"
                      />
                      <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.7)']}
                        style={styles.imageGradient}
                      />
                    </>
                  ) : (
                    <View style={styles.placeholderContent}>
                      <Text style={{ fontSize: 24, marginBottom: 8 }}>📸</Text>
                      <Body style={styles.placeholderText}>Loading...</Body>
                    </View>
                  )}
                  <View style={styles.imageOverlay}>
                    <Body style={styles.imageLabel}>{image.label}</Body>
                  </View>
                  <View style={styles.analysisIndicator}>
                    {image.uri && currentStep >= index ? (
                      <Text style={{ fontSize: 20 }}>✅</Text>
                    ) : image.uri ? (
                      <View style={styles.analysisRing} />
                    ) : (
                      <Text style={{ fontSize: 16 }}>⏳</Text>
                    )}
                  </View>
                </View>
              </View>
            ))}
          </View>
          
          {/* Progress Section */}
          <View style={styles.progressSection}>
            <View style={styles.currentStep}>
              <Text style={{ fontSize: 20 }}>✨</Text>
              <Body style={styles.currentStepText}>
                {analysisComplete ? "Analysis Complete!" : steps[currentStep]?.title}
              </Body>
            </View>
            
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarBackground}>
                <Animated.View style={[styles.progressBarFill, progressStyle]} />
              </View>
              <Body style={styles.progressText}>
                {Math.round((currentStep + 1) / steps.length * 100)}% Complete
              </Body>
            </View>
            
            <View style={styles.stepsGrid}>
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                const isActive = index === currentStep;
                const isCompleted = index < currentStep || analysisComplete;
                
                return (
                  <View key={index} style={styles.stepCard}>
                    <View style={[
                      styles.stepIconContainer,
                      isActive && styles.stepIconActive,
                      isCompleted && styles.stepIconCompleted
                    ]}>
                      <StepIcon 
                        size={16} 
                        color={isActive || isCompleted ? colors.text.light : colors.text.secondary} 
                      />
                    </View>
                    <Body style={[
                      styles.stepCardText,
                      isActive && styles.stepCardTextActive
                    ]}>
                      {step.title}
                    </Body>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: spacing.xl,
    justifyContent: "space-between",
  },
  header: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  title: {
    textAlign: "center",
    marginTop: spacing.m,
    marginBottom: spacing.s,
    color: colors.text.primary,
    fontSize: 28,
    fontWeight: '700' as const,
  },
  subtitle: {
    textAlign: "center",
    color: colors.text.secondary,
    fontSize: 16,
    lineHeight: 24,
    paddingHorizontal: spacing.m,
  },
  imagesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.xl,
    gap: spacing.m,
  },
  imageWrapper: {
    flex: 1,
  },
  imageContainer: {
    position: "relative",
    aspectRatio: 0.8,
    borderRadius: borderRadius.xl,
    overflow: "hidden",
    backgroundColor: colors.card,
    ...shadows.medium,
  },
  scanImage: {
    width: "100%",
    height: "100%",
  },
  imageGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "40%",
  },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.s,
  },
  imageLabel: {
    color: colors.text.light,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "600" as const,
  },
  analysisIndicator: {
    position: "absolute",
    top: spacing.s,
    right: spacing.s,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 15,
    padding: 4,
  },
  analysisRing: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.7)",
    backgroundColor: "transparent",
  },
  progressSection: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    ...shadows.medium,
  },
  currentStep: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.l,
    gap: spacing.s,
  },
  currentStepText: {
    color: colors.text.primary,
    fontSize: 18,
    fontWeight: "600" as const,
  },
  progressBarContainer: {
    marginBottom: spacing.l,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: spacing.s,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  progressText: {
    textAlign: "center",
    color: colors.text.secondary,
    fontSize: 14,
    fontWeight: "500" as const,
  },
  stepsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.s,
  },
  stepCard: {
    flex: 1,
    alignItems: "center",
    padding: spacing.m,
    backgroundColor: colors.background,
    borderRadius: borderRadius.m,
    borderWidth: 1,
    borderColor: colors.border,
  },
  stepIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.s,
  },
  stepIconActive: {
    backgroundColor: colors.primary,
  },
  stepIconCompleted: {
    backgroundColor: colors.success,
  },
  stepCardText: {
    color: colors.text.secondary,
    fontSize: 12,
    textAlign: "center",
    lineHeight: 16,
  },
  stepCardTextActive: {
    color: colors.text.primary,
    fontWeight: "600" as const,
  },
  placeholderContainer: {
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderContent: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: colors.card,
  },
  placeholderText: {
    color: colors.text.secondary,
    fontSize: 12,
    fontWeight: '500' as const,
    textAlign: 'center',
  },
});