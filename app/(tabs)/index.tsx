import React from "react";
import { StyleSheet, View, ScrollView, ActivityIndicator, Platform } from "react-native";
import { H2, Body } from "@/components/ui/Typography";
import { colors, spacing } from "@/constants/theme";
import { useAuth } from "@/hooks/useAuth";
import { useSkincare } from "@/hooks/useSkincare";
import { DailyRoutine } from "@/components/home/DailyRoutine";
import { SkinSnapshot } from "@/components/home/SkinSnapshot";
import { QuickActions } from "@/components/home/QuickActions";
import { router } from "expo-router";

export default function HomeScreen() {
  const { user, loading, isAuthenticated } = useAuth();
  const { dailyTip } = useSkincare();

  // Redirect to onboarding if not authenticated
  React.useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace('/onboarding/welcome');
    }
  }, [isAuthenticated, loading]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <H2 style={styles.greeting}>
            {getGreeting()}, {user?.name?.split(' ')[0] || 'there'}
          </H2>
          {dailyTip && (
            <View style={styles.tipContainer}>
              <Body style={styles.tipText}>{dailyTip.text}</Body>
            </View>
          )}
        </View>

        <DailyRoutine />
        <SkinSnapshot />
        <QuickActions />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.l,
    paddingBottom: Platform.OS === 'ios' ? spacing.xxl : spacing.xl,
  },
  header: {
    marginBottom: spacing.xl,
    paddingTop: spacing.s,
  },
  greeting: {
    marginBottom: spacing.l,
    fontSize: 24,
    fontWeight: '600' as const,
  },
  tipContainer: {
    backgroundColor: colors.secondary,
    borderRadius: 16,
    padding: spacing.l,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tipText: {
    color: colors.text.primary,
    fontSize: 15,
    lineHeight: 22,
  },
});