import React from "react";
import { StyleSheet, View, Image, SafeAreaView } from "react-native";
import { H2, H3, Body } from "@/components/ui/Typography";
import { colors, spacing, borderRadius } from "@/constants/theme";
import { Button } from "@/components/ui/Button";
import { router } from "expo-router";
import { FileText, Sparkles, BarChart2 } from "lucide-react-native";

export default function IntroScreen() {
  const handleStart = () => {
    router.push("/onboarding/scan-front");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <H2 style={styles.title}>Here's how it works:</H2>

        <View style={styles.stepsContainer}>
          <View style={styles.step}>
            <View style={styles.iconContainer}>
              <FileText size={32} color={colors.primary} />
            </View>
            <View style={styles.stepContent}>
              <H3 style={styles.stepTitle}>Quick Quiz</H3>
              <Body style={styles.stepDescription}>
                Answer a few questions about your skin type and concerns
              </Body>
            </View>
          </View>

          <View style={styles.step}>
            <View style={styles.iconContainer}>
              <Sparkles size={32} color={colors.primary} />
            </View>
            <View style={styles.stepContent}>
              <H3 style={styles.stepTitle}>AI Analysis</H3>
              <Body style={styles.stepDescription}>
                Get intelligent insights based on your quiz responses
              </Body>
            </View>
          </View>

          <View style={styles.step}>
            <View style={styles.iconContainer}>
              <BarChart2 size={32} color={colors.primary} />
            </View>
            <View style={styles.stepContent}>
              <H3 style={styles.stepTitle}>Custom Plan</H3>
              <Body style={styles.stepDescription}>
                Get a personalized skincare routine and track your progress
              </Body>
            </View>
          </View>
        </View>

        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&q=80&w=387&ixlib=rb-4.0.3",
            }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>

        <Button
          title="Start Diagnostic"
          onPress={handleStart}
          size="large"
          style={styles.button}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: spacing.xl,
  },
  title: {
    marginBottom: spacing.xl,
    textAlign: "center",
  },
  stepsContainer: {
    marginBottom: spacing.xl,
  },
  step: {
    flexDirection: "row",
    marginBottom: spacing.l,
    alignItems: "center",
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.m,
    backgroundColor: colors.secondary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.m,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    marginBottom: spacing.xs,
  },
  stepDescription: {
    color: colors.text.secondary,
  },
  imageContainer: {
    flex: 1,
    borderRadius: borderRadius.l,
    overflow: "hidden",
    marginBottom: spacing.xl,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  button: {
    width: "100%",
  },
});