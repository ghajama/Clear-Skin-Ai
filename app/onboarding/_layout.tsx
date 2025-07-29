import { Stack } from "expo-router";
import React from "react";
import { colors } from "@/constants/theme";

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerShadowVisible: false,
        headerBackTitle: "Back",
      }}
    >
      <Stack.Screen
        name="welcome"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="auth"
        options={{
          title: "Sign In",
        }}
      />
      <Stack.Screen
        name="intro"
        options={{
          title: "How It Works",
          headerBackVisible: false,
        }}
      />
      <Stack.Screen
        name="scan-front"
        options={{
          title: "Front Photo",
        }}
      />
      <Stack.Screen
        name="scan-right"
        options={{
          title: "Right Side Photo",
        }}
      />
      <Stack.Screen
        name="scan-left"
        options={{
          title: "Left Side Photo",
        }}
      />
      <Stack.Screen
        name="quiz/[id]"
        options={{
          title: "Skin Quiz",
        }}
      />

      <Stack.Screen
        name="analysis"
        options={{
          title: "Analyzing",
          headerBackVisible: false,
        }}
      />
      <Stack.Screen
        name="skin-score"
        options={{
          title: "Your Skin Score",
          headerBackVisible: false,
        }}
      />
      <Stack.Screen
        name="testimonials"
        options={{
          title: "Success Stories",
        }}
      />
      <Stack.Screen
        name="plan-teaser"
        options={{
          title: "Your Plan",
          headerBackVisible: false,
        }}
      />
      <Stack.Screen
        name="paywall"
        options={{
          title: "Unlock Your Plan",
          presentation: "modal",
        }}
      />
    </Stack>
  );
}