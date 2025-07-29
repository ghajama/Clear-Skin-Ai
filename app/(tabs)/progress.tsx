import React from "react";
import { StyleSheet, View, ScrollView, TouchableOpacity, SafeAreaView } from "react-native";
import { H2, H3, Body, BodySmall, Caption } from "@/components/ui/Typography";
import { colors, spacing, borderRadius } from "@/constants/theme";
import { useSkincare } from "@/hooks/useSkincare";
import { Card } from "@/components/ui/Card";
import { Image } from "expo-image";
import { BarChart2, Camera, Share2, Download } from "lucide-react-native";

export default function ProgressScreen() {
  const { skinScore, scanResults } = useSkincare();

  if (!skinScore) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={[styles.content, styles.emptyContent]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.emptyContainer}>
            <BarChart2 size={60} color={colors.text.secondary} />
            <H3 style={styles.emptyTitle}>No Progress Data Yet</H3>
            <Body style={styles.emptyText}>
              Complete your skin scan to start tracking your progress
            </Body>
            <TouchableOpacity style={styles.scanButton}>
              <Camera size={20} color={colors.text.light} />
              <BodySmall style={styles.scanButtonText}>Start Scan</BodySmall>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <H2 style={styles.title}>Your Skin Progress</H2>
        
        <Card style={styles.scoreCard}>
          <View style={styles.scoreHeader}>
            <H3>Skin Score Timeline</H3>
            <BodySmall style={styles.scoreDate}>July 20, 2025</BodySmall>
          </View>
          
          <View style={styles.chartPlaceholder}>
            <View style={styles.chartBar}>
              <View style={[styles.chartFill, { height: `${skinScore.overall}%` }]} />
            </View>
            <Caption style={styles.chartLabel}>Overall</Caption>
          </View>
          
          <View style={styles.metricsRow}>
            <View style={styles.metricItem}>
              <BodySmall style={styles.metricLabel}>Hydration</BodySmall>
              <Body>{skinScore.hydration}</Body>
            </View>
            <View style={styles.metricItem}>
              <BodySmall style={styles.metricLabel}>Texture</BodySmall>
              <Body>{skinScore.texture}</Body>
            </View>
            <View style={styles.metricItem}>
              <BodySmall style={styles.metricLabel}>Pigmentation</BodySmall>
              <Body>{skinScore.pigmentation}</Body>
            </View>
            <View style={styles.metricItem}>
              <BodySmall style={styles.metricLabel}>Sensitivity</BodySmall>
              <Body>{skinScore.sensitivity}</Body>
            </View>
          </View>
        </Card>
        
        {scanResults.front && (
          <View style={styles.scanSection}>
            <H3 style={styles.sectionTitle}>Latest Scan</H3>
            <Card style={styles.scanCard}>
              <Image 
                source={{ uri: scanResults.front }}
                style={styles.scanImage}
                contentFit="cover"
              />
              <View style={styles.scanActions}>
                <TouchableOpacity style={styles.actionButton}>
                  <Share2 size={20} color={colors.primary} />
                  <BodySmall style={styles.actionText}>Share</BodySmall>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Download size={20} color={colors.primary} />
                  <BodySmall style={styles.actionText}>Save</BodySmall>
                </TouchableOpacity>
              </View>
            </Card>
          </View>
        )}
        
        <View style={styles.habitsSection}>
          <H3 style={styles.sectionTitle}>Habit Tracker</H3>
          <Card style={styles.habitsCard}>
            <View style={styles.habitRow}>
              <Body>Water Intake</Body>
              <View style={styles.habitTracker}>
                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                  <TouchableOpacity key={i} style={styles.habitCircle} />
                ))}
              </View>
            </View>
            <View style={styles.habitRow}>
              <Body>Sleep Quality</Body>
              <View style={styles.habitRating}>
                {[1, 2, 3, 4, 5].map(i => (
                  <TouchableOpacity key={i} style={styles.ratingCircle} />
                ))}
              </View>
            </View>
            <View style={styles.habitRow}>
              <Body>Stress Level</Body>
              <View style={styles.habitRating}>
                {[1, 2, 3, 4, 5].map(i => (
                  <TouchableOpacity key={i} style={styles.ratingCircle} />
                ))}
              </View>
            </View>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
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
  content: {
    padding: spacing.l,
  },
  emptyContent: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    marginBottom: spacing.l,
  },
  scoreCard: {
    marginBottom: spacing.l,
  },
  scoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  scoreDate: {
    color: colors.text.secondary,
  },
  chartPlaceholder: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: spacing.l,
  },
  chartBar: {
    width: 60,
    height: 160,
    backgroundColor: colors.secondary,
    borderRadius: borderRadius.s,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  chartFill: {
    width: '100%',
    backgroundColor: colors.primary,
  },
  chartLabel: {
    marginTop: spacing.xs,
  },
  metricsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  metricItem: {
    width: '50%',
    paddingVertical: spacing.s,
  },
  metricLabel: {
    color: colors.text.secondary,
    marginBottom: 2,
  },
  scanSection: {
    marginBottom: spacing.l,
  },
  sectionTitle: {
    marginBottom: spacing.m,
  },
  scanCard: {
    padding: 0,
    overflow: 'hidden',
  },
  scanImage: {
    width: '100%',
    height: 300,
    backgroundColor: colors.secondary,
  },
  scanActions: {
    flexDirection: 'row',
    padding: spacing.m,
    justifyContent: 'space-around',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  actionText: {
    color: colors.primary,
  },
  habitsSection: {
    marginBottom: spacing.l,
  },
  habitsCard: {
    gap: spacing.m,
  },
  habitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  habitTracker: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  habitCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  habitRating: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  ratingCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  emptyTitle: {
    marginTop: spacing.l,
    marginBottom: spacing.s,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.text.secondary,
    marginBottom: spacing.l,
  },
  scanButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.round,
    paddingVertical: spacing.s,
    paddingHorizontal: spacing.l,
    alignItems: 'center',
    gap: spacing.xs,
  },
  scanButtonText: {
    color: colors.text.light,
  },
});