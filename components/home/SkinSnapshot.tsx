import { colors, spacing, borderRadius, shadows } from '@/constants/theme';
import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { H3, H4, Body, BodySmall } from '@/components/ui/Typography';
import { useSkincare } from '@/hooks/useSkincare';
import { router } from 'expo-router';

export const SkinSnapshot: React.FC = () => {
  const { skinScore } = useSkincare();

  const handleRescan = () => {
    router.push('/scan');
  };

  if (!skinScore) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <H3>Skin Snapshot</H3>
        </View>
        <View style={styles.emptyContainer}>
          <Body style={styles.emptyText}>
            Complete your skin scan to see your score
          </Body>
          <TouchableOpacity
            style={styles.scanButton}
            onPress={handleRescan}
          >
            <Text style={{ fontSize: 20 }}>📷</Text>
            <BodySmall style={styles.scanButtonText}>Scan Now</BodySmall>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <H3>Skin Snapshot</H3>
        <TouchableOpacity
          style={styles.rescanButton}
          onPress={handleRescan}
        >
          <Text style={{ fontSize: 20 }}>📷</Text>
          <BodySmall style={styles.rescanText}>Rescan</BodySmall>
        </TouchableOpacity>
      </View>
      <View style={styles.scoreContainer}>
        <View style={styles.scoreCircle}>
          <H4>{skinScore.overall}</H4>
          <BodySmall>Overall</BodySmall>
        </View>
        <View style={styles.metricsContainer}>
          <View style={styles.metricItem}>
            <BodySmall style={styles.metricLabel}>Hydration</BodySmall>
            <Body>{skinScore.hydration}</Body>
          </View>
          <View style={styles.metricItem}>
            <BodySmall style={styles.metricLabel}>Acne</BodySmall>
            <Body>{skinScore.acne}</Body>
          </View>
          <View style={styles.metricItem}>
            <BodySmall style={styles.metricLabel}>Sun Damage</BodySmall>
            <Body>{skinScore.sunDamage}</Body>
          </View>
          <View style={styles.metricItem}>
            <BodySmall style={styles.metricLabel}>Dryness</BodySmall>
            <Body>{skinScore.dryness}</Body>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.l,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  emptyContainer: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.m,
    padding: spacing.l,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 150,
  },
  emptyText: {
    textAlign: 'center',
    marginBottom: spacing.m,
    color: colors.text.secondary,
  },
  scanButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.round,
    paddingVertical: spacing.s,
    paddingHorizontal: spacing.l,
    alignItems: 'center',
    gap: spacing.xs,
    ...shadows.light,
  },
  scanButtonText: {
    color: colors.text.light,
  },
  rescanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  rescanText: {
    color: colors.primary,
  },
  scoreContainer: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: borderRadius.m,
    padding: spacing.m,
    borderWidth: 1,
    borderColor: colors.border,
  },
  scoreCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
    marginRight: spacing.l,
  },
  metricsContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  metricItem: {
    width: '50%',
    paddingVertical: spacing.xs,
  },
  metricLabel: {
    color: colors.text.secondary,
    marginBottom: 2,
  },
});