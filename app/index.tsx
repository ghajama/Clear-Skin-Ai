import { useEffect } from 'react';
import { router } from 'expo-router';
import { View } from 'react-native';

export default function Index() {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/splash');
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return <View style={{ flex: 1, backgroundColor: '#F5F5F0' }} />;
}