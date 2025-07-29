import { colors, spacing, borderRadius } from '@/constants/theme';
import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { H3, Body, BodySmall } from '@/components/ui/Typography';
import { useSkincare } from '@/hooks/useSkincare';
import { Check, Info } from 'lucide-react-native';

export const DailyRoutine: React.FC = () => {
  const { routineSteps, toggleRoutineStep } = useSkincare();
  const [timeOfDay, setTimeOfDay] = React.useState<'morning' | 'evening'>(
    new Date().getHours() < 12 ? 'morning' : 'evening'
  );

  const filteredSteps = routineSteps.filter(
    step => step.time === timeOfDay || step.time === 'both'
  );

  const handleToggle = (id: string, completed: boolean) => {
    toggleRoutineStep(id, completed);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <H3>Today's Routine</H3>
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, timeOfDay === 'morning' && styles.activeTab]}
            onPress={() => setTimeOfDay('morning')}
          >
            <BodySmall
              style={timeOfDay === 'morning' ? styles.activeTabText : undefined}
            >
              Morning
            </BodySmall>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, timeOfDay === 'evening' && styles.activeTab]}
            onPress={() => setTimeOfDay('evening')}
          >
            <BodySmall
              style={timeOfDay === 'evening' ? styles.activeTabText : undefined}
            >
              Evening
            </BodySmall>
          </TouchableOpacity>
        </View>
      </View>

      {filteredSteps.map(step => (
        <View key={step.id} style={styles.stepCard}>
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
          <View style={styles.stepContent}>
            <Body style={step.completed ? styles.completedText : undefined}>
              {step.title}
            </Body>
          </View>
          <TouchableOpacity style={styles.infoButton}>
            <Info size={20} color={colors.text.secondary} />
          </TouchableOpacity>
        </View>
      ))}
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
  tabs: {
    flexDirection: 'row',
    backgroundColor: colors.secondary,
    borderRadius: borderRadius.round,
    padding: 4,
  },
  tab: {
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.round,
  },
  activeTab: {
    backgroundColor: colors.primary,
  },
  activeTabText: {
    color: colors.text.light,
  },
  stepCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: borderRadius.m,
    padding: spacing.m,
    marginBottom: spacing.s,
    borderWidth: 1,
    borderColor: colors.border,
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
  stepContent: {
    flex: 1,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: colors.text.secondary,
  },
  infoButton: {
    padding: spacing.xs,
  },
});