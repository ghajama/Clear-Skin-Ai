import React, { useState, useEffect } from 'react';
import { StyleSheet, View, SafeAreaView, ScrollView, Dimensions, Text } from "react-native";
import { H1, H2, H3, Body, BodySmall } from '@/components/ui/Typography';
import { colors, spacing, borderRadius, shadows } from '@/constants/theme';
import { router, Stack } from 'expo-router';
import { SafeImage as Image } from '@/components/ui/SafeImage';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '@/components/ui/Button';
import { imageCache, ScanImage } from '@/lib/storage';
import { useAuth } from '@/hooks/useAuth';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withDelay,
  interpolate
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

interface SkinMetric {
  label: string;
  score: number;
  maxScore: number;
  icon: React.ComponentType<any>;
  color: string;
  description: string;
}

export default function SkinScoreScreen() {
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const { updateUser, user } = useAuth();
  
  const scoreAnimation = useSharedValue(0);
  const detailsAnimation = useSharedValue(0);

  // Mock skin analysis data
  const overallScore = 6.8;
  const maxScore = 10;
  
  const skinMetrics: SkinMetric[] = [
    {
      label: 'Acne',
      score: 5.2,
      maxScore: 10,
      icon: () => <Text style={{ fontSize: 20 }}>⚠️</Text>,
      color: colors.error,
      description: 'Moderate acne concerns detected'
    },
    {
      label: 'Hydration',
      score: 7.8,
      maxScore: 10,
      icon: () => <Text style={{ fontSize: 20 }}>💧</Text>,
      color: colors.primary,
      description: 'Good hydration levels'
    },
    {
      label: 'Sun Damage',
      score: 6.5,
      maxScore: 10,
      icon: () => <Text style={{ fontSize: 20 }}>☀️</Text>,
      color: colors.warning,
      description: 'Some sun exposure signs'
    },
    {
      label: 'Texture',
      score: 8.1,
      maxScore: 10,
      icon: () => <Text style={{ fontSize: 20 }}>✨</Text>,
      color: colors.success,
      description: 'Smooth skin texture'
    }
  ];

  useEffect(() => {
    const loadFrontImage = async () => {
      try {
        const image = await imageCache.getImage('front');
        if (image) {
          setFrontImage(image?.uri || null);
        }
      } catch (error) {
        console.error('Failed to load front image:', error);
      }
    };

    loadFrontImage();
  }, []);

  useEffect(() => {
    // Animate score reveal
    scoreAnimation.value = withDelay(500, withTiming(1, { duration: 1500 }));
    
    // Show details after score animation
    setTimeout(() => {
      setShowDetails(true);
      detailsAnimation.value = withTiming(1, { duration: 800 });
    }, 2000);
  }, []);

  const scoreStyle = useAnimatedStyle(() => {
    const animatedScore = interpolate(
      scoreAnimation.value,
      [0, 1],
      [0, overallScore]
    );
    
    return {
      transform: [{ scale: scoreAnimation.value }],
    };
  });

  const detailsStyle = useAnimatedStyle(() => {
    return {
      opacity: detailsAnimation.value,
      transform: [{ translateY: interpolate(detailsAnimation.value, [0, 1], [20, 0]) }],
    };
  });

  const getScoreColor = (score: number) => {
    if (score >= 8) return colors.success;
    if (score >= 6) return colors.warning;
    return colors.error;
  };

  const getScoreText = (score: number) => {
    if (score >= 8) return 'Excellent';
    if (score >= 6) return 'Good';
    if (score >= 4) return 'Fair';
    return 'Needs Attention';
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Your Skin Score',
          headerBackVisible: false,
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontFamily: 'Georgia',
            fontSize: 18,
            fontWeight: '600',
          },
        }} 
      />
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={[colors.background, colors.secondary]}
          style={styles.gradient}
        >
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={styles.header}>
              <H1 style={styles.title}>Your Skin Analysis</H1>
              <Body style={styles.subtitle}>
                Here are your results and our personalized recommendations
              </Body>
            </View>

            {/* Score Card */}
            <View style={styles.scoreCard}>
              <View style={styles.scoreSection}>
                {frontImage && (
                  <View style={styles.imageContainer}>
                    <Image
                      source={{ uri: frontImage }}
                      style={styles.profileImage}
                      contentFit="cover"
                    />
                    <LinearGradient
                      colors={['transparent', 'rgba(0,0,0,0.3)']}
                      style={styles.imageOverlay}
                    />
                  </View>
                )}
                
                <View style={styles.scoreDisplay}>
                  <Animated.View style={[styles.scoreCircle, scoreStyle]}>
                    <H1 style={[styles.scoreNumber, { color: getScoreColor(overallScore) }]}>
                      {overallScore.toFixed(1)}
                    </H1>
                    <Body style={styles.scoreMax}>/{maxScore}</Body>
                  </Animated.View>
                  
                  <View style={styles.scoreInfo}>
                    <H3 style={[styles.scoreLabel, { color: getScoreColor(overallScore) }]}>
                      {getScoreText(overallScore)}
                    </H3>
                    <Body style={styles.scoreDescription}>
                      Overall Skin Health Score
                    </Body>
                  </View>
                </View>
              </View>
            </View>

            {/* Detailed Metrics */}
            {showDetails && (
              <Animated.View style={[styles.metricsSection, detailsStyle]}>
                <H2 style={styles.sectionTitle}>Detailed Analysis</H2>
                
                {skinMetrics.map((metric, index) => {
                  const IconComponent = metric.icon;
                  const percentage = (metric.score / metric.maxScore) * 100;
                  
                  return (
                    <View key={index} style={styles.metricCard}>
                      <View style={styles.metricHeader}>
                        <View style={styles.metricIcon}>
                          <IconComponent size={20} color={metric.color} />
                        </View>
                        <View style={styles.metricInfo}>
                          <H3 style={styles.metricLabel}>{metric.label}</H3>
                          <Body style={styles.metricDescription}>{metric.description}</Body>
                        </View>
                        <View style={styles.metricScore}>
                          <H3 style={[styles.metricNumber, { color: metric.color }]}>
                            {metric.score.toFixed(1)}
                          </H3>
                          <BodySmall style={styles.metricMax}>/{metric.maxScore}</BodySmall>
                        </View>
                      </View>
                      
                      <View style={styles.progressBar}>
                        <View style={styles.progressBackground}>
                          <View 
                            style={[
                              styles.progressFill, 
                              { 
                                width: `${percentage}%`,
                                backgroundColor: metric.color 
                              }
                            ]} 
                          />
                        </View>
                      </View>
                    </View>
                  );
                })}
              </Animated.View>
            )}

            {/* Recommendations */}
            {showDetails && (
              <Animated.View style={[styles.recommendationsSection, detailsStyle]}>
                <View style={styles.recommendationCard}>
                  <View style={styles.recommendationHeader}>
                    <Text style={{ fontSize: 20 }}>📈</Text>
                    <H2 style={styles.recommendationTitle}>Your Path to Perfect Skin</H2>
                  </View>
                  
                  <Body style={styles.recommendationText}>
                    Based on your analysis, we&apos;ve identified key areas for improvement. 
                    Our personalized skincare plan will help you achieve a perfect 10/10 score.
                  </Body>
                  
                  <View style={styles.improvementAreas}>
                    <Body style={styles.improvementTitle}>Focus Areas:</Body>
                    <View style={styles.improvementList}>
                      <Body style={styles.improvementItem}>• Acne treatment and prevention</Body>
                      <Body style={styles.improvementItem}>• Sun protection routine</Body>
                      <Body style={styles.improvementItem}>• Enhanced hydration protocol</Body>
                    </View>
                  </View>
                  
                  <View style={styles.solutionBox}>
                    <Text style={{ fontSize: 20 }}>🎯</Text>
                    <Body style={styles.solutionText}>
                      Our custom plan will help you become a 10/10
                    </Body>
                  </View>
                </View>
              </Animated.View>
            )}

            {/* Action Buttons */}
            {showDetails && (
              <Animated.View style={[styles.actionSection, detailsStyle]}>
                <Button
                  title="Continue to App"
                  onPress={async () => {
                    // Mark onboarding as complete
                    if (user) {
                      await updateUser({ quizCompleted: true });
                    }
                    // Navigate to main app
                    router.replace('/(tabs)');
                  }}
                  style={styles.primaryButton}
                  icon={<Text style={{ fontSize: 20 }}>➡️</Text>}
                />
              </Animated.View>
            )}
          </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    textAlign: 'center',
    color: colors.text.primary,
    fontSize: 28,
    fontWeight: '700' as const,
    marginBottom: spacing.s,
  },
  subtitle: {
    textAlign: 'center',
    color: colors.text.secondary,
    fontSize: 16,
    lineHeight: 24,
    paddingHorizontal: spacing.m,
  },
  scoreCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    marginBottom: spacing.xl,
    ...shadows.medium,
  },
  scoreSection: {
    alignItems: 'center',
  },
  imageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    marginBottom: spacing.l,
    position: 'relative',
    ...shadows.light,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '30%',
  },
  scoreDisplay: {
    alignItems: 'center',
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.background,
    borderWidth: 4,
    borderColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.m,
    ...shadows.light,
  },
  scoreNumber: {
    fontSize: 36,
    fontWeight: '800' as const,
    lineHeight: 40,
  },
  scoreMax: {
    fontSize: 16,
    color: colors.text.secondary,
    marginTop: -8,
  },
  scoreInfo: {
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 20,
    fontWeight: '600' as const,
    marginBottom: spacing.xs,
  },
  scoreDescription: {
    color: colors.text.secondary,
    textAlign: 'center',
  },
  metricsSection: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    color: colors.text.primary,
    fontSize: 22,
    fontWeight: '600' as const,
    marginBottom: spacing.l,
    textAlign: 'center',
  },
  metricCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.l,
    padding: spacing.l,
    marginBottom: spacing.m,
    ...shadows.light,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  metricIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.m,
  },
  metricInfo: {
    flex: 1,
  },
  metricLabel: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: '600' as const,
    marginBottom: spacing.xs,
  },
  metricDescription: {
    color: colors.text.secondary,
    fontSize: 14,
  },
  metricScore: {
    alignItems: 'flex-end',
  },
  metricNumber: {
    fontSize: 18,
    fontWeight: '700' as const,
  },
  metricMax: {
    color: colors.text.secondary,
    fontSize: 12,
  },
  progressBar: {
    marginTop: spacing.s,
  },
  progressBackground: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  recommendationsSection: {
    marginBottom: spacing.xl,
  },
  recommendationCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    ...shadows.medium,
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.l,
    gap: spacing.s,
  },
  recommendationTitle: {
    color: colors.text.primary,
    fontSize: 20,
    fontWeight: '600' as const,
    flex: 1,
  },
  recommendationText: {
    color: colors.text.secondary,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: spacing.l,
  },
  improvementAreas: {
    marginBottom: spacing.l,
  },
  improvementTitle: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: '600' as const,
    marginBottom: spacing.s,
  },
  improvementList: {
    paddingLeft: spacing.s,
  },
  improvementItem: {
    color: colors.text.secondary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: spacing.xs,
  },
  solutionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: borderRadius.m,
    padding: spacing.m,
    gap: spacing.s,
  },
  solutionText: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: '500' as const,
    flex: 1,
  },
  actionSection: {
    alignItems: 'center',
    gap: spacing.m,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xxl,
    width: '100%',
  },
  secondaryButton: {
    borderColor: colors.primary,
    paddingHorizontal: spacing.xxl,
    width: '100%',
  },
});