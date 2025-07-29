import React, { useState } from "react";
import { StyleSheet, View, Dimensions, SafeAreaView, ScrollView } from "react-native";
import { H2, H3, Body, BodySmall } from "@/components/ui/Typography";
import { colors, spacing, borderRadius, shadows } from "@/constants/theme";
import { Button } from "@/components/ui/Button";
import { Image } from "expo-image";
import { router, Stack } from "expo-router";
import { testimonials } from "@/constants/mockData";
import { LinearGradient } from "expo-linear-gradient";
import { Star, ArrowRight } from "lucide-react-native";

const { width } = Dimensions.get("window");

export default function TestimonialsScreen() {
  const handleDiscoverDiagnostic = () => {
    router.push("/onboarding/plan-teaser");
  };

  const textReviews = [
    {
      id: 1,
      name: "Sarah M.",
      age: 28,
      rating: 5,
      text: "My skin has never looked better! The personalized routine completely transformed my complexion in just 6 weeks.",
      concern: "Acne & Dark Spots"
    },
    {
      id: 2,
      name: "Emma L.",
      age: 34,
      rating: 5,
      text: "Finally found products that work for my sensitive skin. No more irritation, just healthy glowing skin!",
      concern: "Sensitive Skin"
    },
    {
      id: 3,
      name: "Jessica R.",
      age: 31,
      rating: 5,
      text: "The AI analysis was spot-on. My fine lines are barely visible now and my skin feels so much firmer.",
      concern: "Anti-Aging"
    }
  ];

  const beforeAfterPairs = [
    {
      id: 1,
      name: "Maria K.",
      age: 29,
      beforeImage: "https://images.unsplash.com/photo-1594824804732-ca8db4394b12?w=300&h=300&fit=crop&crop=face",
      afterImage: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=300&h=300&fit=crop&crop=face",
      improvement: "85% clearer skin",
      duration: "8 weeks"
    },
    {
      id: 2,
      name: "Lisa T.",
      age: 26,
      beforeImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop&crop=face",
      afterImage: "https://images.unsplash.com/photo-1594824804732-ca8db4394b12?w=300&h=300&fit=crop&crop=face",
      improvement: "92% improvement",
      duration: "12 weeks"
    }
  ];

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[colors.background, colors.secondary]}
        style={styles.gradient}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <View style={styles.header}>
              <H2 style={styles.title}>Success Stories</H2>
              <Body style={styles.subtitle}>
                Real transformations from real people
              </Body>
            </View>

            {/* Text Reviews */}
            {textReviews.map((review, index) => (
              <View key={review.id} style={styles.reviewBlock}>
                <View style={styles.reviewHeader}>
                  <View>
                    <H3 style={styles.reviewName}>{review.name}, {review.age}</H3>
                    <Body style={styles.reviewConcern}>{review.concern}</Body>
                  </View>
                  <View style={styles.starsContainer}>
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} size={16} color={colors.warning} fill={colors.warning} />
                    ))}
                  </View>
                </View>
                <Body style={styles.reviewText}>"{review.text}"</Body>
              </View>
            ))}

            {/* Before/After Comparisons */}
            {beforeAfterPairs.map((pair, index) => (
              <View key={pair.id} style={styles.beforeAfterBlock}>
                <View style={styles.beforeAfterHeader}>
                  <H3 style={styles.beforeAfterName}>{pair.name}, {pair.age}</H3>
                  <View style={styles.improvementBadge}>
                    <BodySmall style={styles.improvementText}>{pair.improvement}</BodySmall>
                  </View>
                </View>
                
                <View style={styles.imagesContainer}>
                  <View style={styles.imageBlock}>
                    <Image
                      source={{ uri: pair.beforeImage }}
                      style={styles.comparisonImage}
                      contentFit="cover"
                    />
                    <View style={styles.imageLabel}>
                      <BodySmall style={styles.imageLabelText}>BEFORE</BodySmall>
                    </View>
                  </View>
                  
                  <View style={styles.vsContainer}>
                    <Body style={styles.vsText}>VS</Body>
                    <ArrowRight size={20} color={colors.primary} />
                  </View>
                  
                  <View style={styles.imageBlock}>
                    <Image
                      source={{ uri: pair.afterImage }}
                      style={styles.comparisonImage}
                      contentFit="cover"
                    />
                    <View style={[styles.imageLabel, styles.afterLabel]}>
                      <BodySmall style={styles.imageLabelText}>AFTER</BodySmall>
                    </View>
                  </View>
                </View>
                
                <Body style={styles.durationText}>Results in {pair.duration}</Body>
              </View>
            ))}

            <View style={styles.footer}>
              <Button
                title="Discover My Diagnostic"
                onPress={handleDiscoverDiagnostic}
                size="large"
                style={styles.button}
              />
            </View>
          </View>
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
  content: {
    padding: spacing.m,
    paddingBottom: spacing.xl,
  },
  header: {
    marginBottom: spacing.l,
    alignItems: "center",
  },
  title: {
    textAlign: "center",
    marginBottom: spacing.s,
    color: colors.text.primary,
  },
  subtitle: {
    textAlign: "center",
    color: colors.text.secondary,
  },
  reviewBlock: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.l,
    padding: spacing.m,
    marginBottom: spacing.s,
    ...shadows.light,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.m,
  },
  reviewName: {
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  reviewConcern: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "600" as const,
  },
  starsContainer: {
    flexDirection: "row",
    gap: 2,
  },
  reviewText: {
    color: colors.text.primary,
    fontStyle: "italic",
    lineHeight: 20,
  },
  beforeAfterBlock: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.l,
    padding: spacing.m,
    marginBottom: spacing.s,
    ...shadows.light,
  },
  beforeAfterHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.m,
  },
  beforeAfterName: {
    color: colors.text.primary,
  },
  improvementBadge: {
    backgroundColor: colors.success,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.m,
  },
  improvementText: {
    color: colors.text.light,
    fontWeight: "700" as const,
  },
  imagesContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.m,
  },
  imageBlock: {
    position: "relative",
    flex: 1,
  },
  comparisonImage: {
    width: "100%",
    height: 100,
    borderRadius: borderRadius.m,
  },
  imageLabel: {
    position: "absolute",
    top: spacing.s,
    left: spacing.s,
    backgroundColor: "rgba(255,0,0,0.8)",
    paddingHorizontal: spacing.s,
    paddingVertical: 4,
    borderRadius: borderRadius.s,
  },
  afterLabel: {
    backgroundColor: "rgba(34,197,94,0.8)",
  },
  imageLabelText: {
    color: colors.text.light,
    fontSize: 10,
    fontWeight: "700" as const,
  },
  vsContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.m,
  },
  vsText: {
    color: colors.primary,
    fontWeight: "700" as const,
    fontSize: 16,
    marginBottom: spacing.xs,
  },
  durationText: {
    textAlign: "center",
    color: colors.text.secondary,
    fontSize: 12,
    fontWeight: "600" as const,
  },
  footer: {
    marginTop: spacing.l,
  },
  button: {
    width: "100%",
  },
});