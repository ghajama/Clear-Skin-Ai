import React, { useState } from "react";
import { StyleSheet, View, TouchableOpacity, SafeAreaView, Platform, ScrollView } from "react-native";
import { H2, H3, Body, BodySmall } from "@/components/ui/Typography";
import { colors, spacing, borderRadius, shadows } from "@/constants/theme";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { router } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import { Check } from "lucide-react-native";
import { LinearGradient } from 'expo-linear-gradient';

export default function PaywallScreen() {
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "annual">("annual");
  const [loading, setLoading] = useState(false);
  const { updateUser } = useAuth();

  const handlePlanSelect = (plan: "monthly" | "annual") => {
    setSelectedPlan(plan);
  };

  const handlePurchase = async () => {
    setLoading(true);
    
    // Simulate purchase process
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Update user subscription status
    updateUser({ subscribed: true });
    
    // Navigate to home screen
    router.replace("/(tabs)");
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[colors.background, `${colors.primary}08`, colors.background]}
        style={styles.gradient}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <View style={styles.headerSection}>
              <H2 style={styles.title}>Choose Your Plan</H2>
              <Body style={styles.subtitle}>
                Unlock personalized skincare with AI-powered analysis
              </Body>
            </View>

            <View style={styles.plansContainer}>
              <TouchableOpacity
                style={[
                  styles.planCard,
                  selectedPlan === "monthly" && styles.selectedPlan,
                ]}
                onPress={() => handlePlanSelect("monthly")}
                activeOpacity={0.9}
              >
                <View style={styles.planHeader}>
                  <H3 style={styles.planTitle}>Monthly</H3>
                  <View style={styles.priceContainer}>
                    <H2 style={styles.planPrice}>$9.99</H2>
                    <BodySmall style={styles.planPeriod}>/month</BodySmall>
                  </View>
                </View>
                <View style={styles.planFeatures}>
                  <View style={styles.featureItem}>
                    <Check size={16} color={colors.primary} />
                    <Body style={styles.featureText}>Personalized routine</Body>
                  </View>
                  <View style={styles.featureItem}>
                    <Check size={16} color={colors.primary} />
                    <Body style={styles.featureText}>Progress tracking</Body>
                  </View>
                  <View style={styles.featureItem}>
                    <Check size={16} color={colors.primary} />
                    <Body style={styles.featureText}>AI skin analysis</Body>
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.planCard,
                  selectedPlan === "annual" && styles.selectedPlan,
                ]}
                onPress={() => handlePlanSelect("annual")}
                activeOpacity={0.9}
              >
                {selectedPlan === "annual" && (
                  <View style={styles.savingBadge}>
                    <BodySmall style={styles.savingText}>BEST VALUE</BodySmall>
                  </View>
                )}
                <View style={styles.planHeader}>
                  <H3 style={styles.planTitle}>Annual</H3>
                  <View style={styles.priceContainer}>
                    <H2 style={styles.planPrice}>$79.99</H2>
                    <BodySmall style={styles.planPeriod}>/year</BodySmall>
                  </View>
                  <BodySmall style={styles.savingsText}>Save $40 vs monthly</BodySmall>
                </View>
                <View style={styles.planFeatures}>
                  <View style={styles.featureItem}>
                    <Check size={16} color={colors.primary} />
                    <Body style={styles.featureText}>Everything in Monthly</Body>
                  </View>
                  <View style={styles.featureItem}>
                    <Check size={16} color={colors.primary} />
                    <Body style={styles.featureText}>Priority support</Body>
                  </View>
                  <View style={styles.featureItem}>
                    <Check size={16} color={colors.primary} />
                    <Body style={styles.featureText}>Advanced analytics</Body>
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.bottomSection}>
              <Button
                title={`Start ${selectedPlan === "monthly" ? "Monthly" : "Annual"} Plan`}
                onPress={handlePurchase}
                loading={loading}
                size="large"
                style={styles.button}
              />
              
              <BodySmall style={styles.termsText}>
                Cancel anytime • Terms apply • Privacy Policy
              </BodySmall>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
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
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: spacing.xl,
    justifyContent: 'space-between',
    minHeight: '100%',
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    marginBottom: spacing.s,
    textAlign: 'center',
    fontSize: 28,
    fontWeight: '700' as const,
  },
  subtitle: {
    color: colors.text.secondary,
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 22,
  },
  plansContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.l,
  },
  bottomSection: {
    paddingBottom: Platform.OS === 'ios' ? spacing.xl : spacing.l,
  },
  planCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    padding: spacing.l,
    borderWidth: 2,
    borderColor: colors.border,
    position: "relative",
    ...shadows.medium,
    marginBottom: spacing.m,
  },

  selectedPlan: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}08`,
    borderWidth: 3,
    transform: [{ scale: 1.02 }],
  },
  savingBadge: {
    position: "absolute",
    top: -12,
    alignSelf: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.round,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  savingText: {
    color: colors.text.light,
    fontWeight: "700" as const,
    fontSize: 12,
    letterSpacing: 0.5,
  },
  planHeader: {
    marginBottom: spacing.m,
    alignItems: 'center',
  },
  planTitle: {
    marginBottom: spacing.xs,
    fontSize: 20,
    fontWeight: '600' as const,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: spacing.xs,
  },
  planPrice: {
    marginRight: spacing.xs,
    fontSize: 32,
    fontWeight: '700' as const,
    color: colors.primary,
  },
  planPeriod: {
    color: colors.text.secondary,
    marginBottom: 6,
    fontSize: 14,
  },
  savingsText: {
    color: colors.accent,
    fontWeight: '600' as const,
    fontSize: 13,
  },
  planFeatures: {
    gap: spacing.s,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.s,
  },
  featureText: {
    flex: 1,
    fontSize: 15,
  },
  button: {
    width: "100%",
    marginBottom: spacing.l,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  termsText: {
    textAlign: "center",
    color: colors.text.secondary,
    fontSize: 12,
    lineHeight: 16,
  },
});