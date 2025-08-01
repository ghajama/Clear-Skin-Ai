// Suppress warnings IMMEDIATELY before any other imports
if (typeof window !== 'undefined') {
  const originalWarn = console.warn;
  console.warn = (...args) => {
    const message = args[0];
    if (typeof message === 'string' && message.includes('shadow')) return;
    originalWarn.apply(console, args);
  };
}

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider } from "@/hooks/useAuth";
import { SkincareProvider } from "@/hooks/useSkincare";
import { ChatProvider } from "@/hooks/useChat";
import { initializeSupabase } from "@/lib/supabase";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ErrorProvider } from "@/providers/ErrorProvider";
import "@/lib/suppressWarnings"; // Suppress React Native Web warnings

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{
      headerBackTitle: "Back",
      headerStyle: { backgroundColor: '#FFFFFF' },
      headerShadowVisible: false,
    }}>
      <Stack.Screen name="splash" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />

    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
    // Initialize Supabase on app start
    initializeSupabase();
  }, []);

  return (
    <ErrorBoundary>
      <ErrorProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <SkincareProvider>
              <ChatProvider>
                <GestureHandlerRootView style={{ flex: 1 }}>
                  <RootLayoutNav />
                </GestureHandlerRootView>
              </ChatProvider>
            </SkincareProvider>
          </AuthProvider>
        </QueryClientProvider>
      </ErrorProvider>
    </ErrorBoundary>
  );
}