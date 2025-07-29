import React, { useState } from "react";
import { StyleSheet, View, ScrollView, TouchableOpacity, SafeAreaView } from "react-native";
import { H2, H3, Body, BodySmall } from "@/components/ui/Typography";
import { colors, spacing, borderRadius } from "@/constants/theme";
import { useSkincare } from "@/hooks/useSkincare";
import { Check, Info } from "lucide-react-native";
import { Card } from "@/components/ui/Card";

export default function RoutineScreen() {
  const { routineSteps, toggleRoutineStep } = useSkincare();
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'evening'>(
    new Date().getHours() < 12 ? 'morning' : 'evening'
  );
  const [expandedStep, setExpandedStep] = useState<string | null>(null);

  const filteredSteps = routineSteps.filter(
    step => step.time === timeOfDay || step.time === 'both'
  );

  const handleToggle = (id: string, completed: boolean) => {
    toggleRoutineStep(id, completed);
  };

  const toggleExpand = (id: string) => {
    setExpandedStep(expandedStep === id ? null : id);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <H2 style={styles.title}>Your Skincare Routine</H2>
        
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, timeOfDay === 'morning' && styles.activeTab]}
            onPress={() => setTimeOfDay('morning')}
          >
            <Body style={timeOfDay === 'morning' ? styles.activeTabText : undefined}>
              Morning
            </Body>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, timeOfDay === 'evening' && styles.activeTab]}
            onPress={() => setTimeOfDay('evening')}
          >
            <Body style={timeOfDay === 'evening' ? styles.activeTabText : undefined}>
              Evening
            </Body>
          </TouchableOpacity>
        </View>

        <View style={styles.stepsContainer}>
          {filteredSteps.map(step => (
            <Card key={step.id} style={styles.stepCard}>
              <View style={styles.stepHeader}>
                <TouchableOpacity
                  style={styles.checkbox}
                  onPress={() => handleToggle(step.id, !step.completed)}
                >
                  <View
                    style={[
                      styles.checkboxInner,
                      step.completed && styles.checkboxChecked,
                    ]}
                  >
                    {step.completed && <Check size={16} color={colors.text.light} />}
                  </View>
                </TouchableOpacity>
                <View style={styles.stepTitleContainer}>
                  <H3 style={[styles.stepTitle, step.completed && styles.completedText]}>
                    {step.title}
                  </H3>
                </View>
                <TouchableOpacity 
                  style={styles.infoButton}
                  onPress={() => toggleExpand(step.id)}
                >
                  <Info size={20} color={colors.primary} />
                </TouchableOpacity>
              </View>
              
              {expandedStep === step.id && (
                <View style={styles.stepDetails}>
                  <Body>{step.description}</Body>
                </View>
              )}
            </Card>
          ))}
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
  title: {
    marginBottom: spacing.l,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: colors.secondary,
    borderRadius: borderRadius.round,
    marginBottom: spacing.l,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.s,
    alignItems: 'center',
    borderRadius: borderRadius.round,
  },
  activeTab: {
    backgroundColor: colors.primary,
  },
  activeTabText: {
    color: colors.text.light,
  },
  stepsContainer: {
    gap: spacing.m,
  },
  stepCard: {
    padding: spacing.m,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    marginRight: spacing.m,
  },
  checkboxInner: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
  },
  stepTitleContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 18,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: colors.text.secondary,
  },
  infoButton: {
    padding: spacing.xs,
  },
  stepDetails: {
    marginTop: spacing.m,
    paddingTop: spacing.m,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});