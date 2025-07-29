import { spacing } from '@/constants/theme';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from '@/components/ui/Button';
import { router } from 'expo-router';

export const AuthButtons: React.FC = () => {
  const handleEmailSignIn = () => {
    router.push('/onboarding/auth');
  };

  return (
    <View style={styles.container}>
      <Button
        title="Continue with Email"
        onPress={handleEmailSignIn}
        variant="primary"
        style={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  button: {
    marginBottom: spacing.m,
    width: '100%',
  },
});