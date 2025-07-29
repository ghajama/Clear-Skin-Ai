import React from "react";
import { StyleSheet, View, SafeAreaView, Platform, ScrollView } from "react-native";
import { H1, H2, Body, BodySmall } from "@/components/ui/Typography";
import { colors, spacing, borderRadius, shadows } from "@/constants/theme";
import { Button } from "@/components/ui/Button";
import { router, Stack } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import { useSkincare } from "@/hooks/useSkincare";
import { BlurView } from "expo-blur";
import { 
  Clock,
  Award,
  AlertTriangle,
  Activity
} from "lucide-react-native";

export default function PlanTeaserScreen() {
  const { user } = useAuth();
  const { skinScore } = useSkincare();

  const handleUnlock = () => {
    router.push("/onboarding/paywall");
  };

  const insights = [
    { type: 'critical', text: 'Severe dehydration detected in T-zone area', color: colors.error },
    { type: 'warning', text: 'Enlarged pores require targeted treatment', color: '#FF8C00' },
    { type: 'warning', text: 'Sun damage visible on cheek areas', color: '#FF8C00' },
    { type: 'moderate', text: 'Uneven skin texture needs attention', color: '#FFA500' },
    { type: 'critical', text: 'Blackheads concentrated around nose area', color: colors.error }
  ];

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <View style={styles.header}>
              <H1 style={styles.title}>
                Your Skin Analysis
              </H1>
              <Body style={styles.subtitle}>
                Personalized insights ready to unlock
              </Body>
            </View>

            {/* Stats Grid */}
            <View style={styles.statsGrid}>
              <View style={styles.mainStat}>
                <Award size={24} color={colors.primary} />
                <H2 style={styles.statNumber}>{skinScore?.overall || 72}</H2>
                <BodySmall style={styles.statLabel}>Skin Score</BodySmall>
              </View>
              
              <View style={styles.subStats}>
                <View style={styles.subStat}>
                  <Clock size={18} color={colors.text.secondary} />
                  <Body style={styles.subStatValue}>6-8 weeks</Body>
                  <BodySmall style={styles.subStatLabel}>Improvement</BodySmall>
                </View>
                
                <View style={styles.subStat}>
                  <Activity size={18} color={colors.warning} />
                  <Body style={styles.subStatValue}>Moderate</Body>
                  <BodySmall style={styles.subStatLabel}>Severity</BodySmall>
                </View>
              </View>
            </View>

            {/* Insights Section */}
            <View style={styles.insightsSection}>
              <Body style={styles.sectionTitle}>Key Insights</Body>
              
              <View style={styles.insightsContainer}>
                {Platform.OS !== 'web' ? (
                  <BlurView intensity={15} style={styles.blurView} tint="light">
                    <View style={styles.insightsContent}>
                      {insights.map((insight, index) => (
                        <View key={index} style={styles.insightItem}>
                          <View style={[styles.insightDot, { backgroundColor: insight.color }]} />
                          <Body style={styles.insightText}>{insight.text}</Body>
                        </View>
                      ))}
                    </View>
                  </BlurView>
                ) : (
                  <View style={[styles.blurView, styles.webBlur]}>
                    <View style={styles.insightsContent}>
                      {insights.map((insight, index) => (
                        <View key={index} style={styles.insightItem}>
                          <View style={[styles.insightDot, { backgroundColor: insight.color }]} />
                          <Body style={styles.insightText}>{insight.text}</Body>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
              </View>
            </View>

            <View style={styles.actionSection}>
              <Button
                title="Start My Skincare Routine"
                onPress={handleUnlock}
                size="large"
                style={styles.actionButton}
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
    paddingTop: spacing.l,
  },
  title: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: colors.text.primary,
    marginBottom: spacing.s,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  statsGrid: {
    marginBottom: spacing.xxl,
  },
  mainStat: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.l,
    ...shadows.medium,
  },
  statNumber: {
    fontSize: 48,
    fontWeight: '700' as const,
    color: colors.primary,
    marginVertical: spacing.s,
  },
  statLabel: {
    color: colors.text.secondary,
    fontSize: 14,
  },
  subStats: {
    flexDirection: 'row',
    gap: spacing.m,
  },
  subStat: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: borderRadius.l,
    padding: spacing.l,
    alignItems: 'center',
    ...shadows.light,
  },
  subStatValue: {
    fontWeight: '600' as const,
    color: colors.text.primary,
    marginVertical: spacing.xs,
    fontSize: 16,
  },
  subStatLabel: {
    color: colors.text.secondary,
    fontSize: 12,
  },
  insightsSection: {
    marginBottom: spacing.xxl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: colors.text.primary,
    marginBottom: spacing.l,
  },
  insightsContainer: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...shadows.medium,
  },
  blurView: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
  },
  webBlur: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(20px)',
  },
  insightsContent: {
    padding: spacing.xl,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  insightDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.m,
  },
  insightText: {
    flex: 1,
    fontSize: 15,
    color: colors.text.primary,
    lineHeight: 20,
  },
  actionSection: {
    paddingBottom: spacing.xl,
  },
  actionButton: {
    ...shadows.strong,
  },
});