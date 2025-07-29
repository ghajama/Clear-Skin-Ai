import { colors, spacing, borderRadius, shadows } from '@/constants/theme';
import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { H3, BodySmall } from '@/components/ui/Typography';
import { Camera, MessageCircle, Calendar, BarChart2 } from 'lucide-react-native';
import { router } from 'expo-router';

interface ActionItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  route: string;
}

export const QuickActions: React.FC = () => {
  const actions: ActionItem[] = [
    {
      id: '1',
      title: 'Scan',
      icon: <Camera size={24} color={colors.primary} />,
      route: '/scan',
    },
    {
      id: '2',
      title: 'Routine',
      icon: <Calendar size={24} color={colors.primary} />,
      route: '/(tabs)/routine',
    },
    {
      id: '3',
      title: 'Progress',
      icon: <BarChart2 size={24} color={colors.primary} />,
      route: '/(tabs)/progress',
    },
    {
      id: '4',
      title: 'Chat',
      icon: <MessageCircle size={24} color={colors.primary} />,
      route: '/(tabs)/chat',
    },
  ];

  const handlePress = (route: string) => {
    router.push(route);
  };

  return (
    <View style={styles.container}>
      <H3 style={styles.title}>Quick Actions</H3>
      <View style={styles.grid}>
        {actions.map(action => (
          <TouchableOpacity
            key={action.id}
            style={styles.actionItem}
            onPress={() => handlePress(action.route)}
          >
            <View style={styles.iconContainer}>{action.icon}</View>
            <BodySmall>{action.title}</BodySmall>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.l,
  },
  title: {
    marginBottom: spacing.m,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.xs,
  },
  actionItem: {
    width: '25%',
    padding: spacing.xs,
    alignItems: 'center',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.m,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.light,
  },
});