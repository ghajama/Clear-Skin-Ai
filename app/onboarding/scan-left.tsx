import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView, Alert } from 'react-native';
import { router, Stack, useFocusEffect } from 'expo-router';
import { imageCache } from '@/lib/storage';
import { useSkincare } from '@/hooks/useSkincare';
import PhotoUpload from '@/components/onboarding/PhotoUpload';

export default function ScanLeftScreen() {
  const { uploadScanImage, scanResults } = useSkincare();
  const [savedPhoto, setSavedPhoto] = useState<string | null>(null);
  const [shouldMirror, setShouldMirror] = useState(false);

  const loadSavedImage = useCallback(async () => {
    try {
      // First try to get from scanResults (which includes Supabase URLs)
      if (scanResults.left) {
        setSavedPhoto(scanResults.left.uri);
        setShouldMirror(scanResults.left.shouldMirror);
        return;
      }
      
      // Fallback to local cache
      const saved = await imageCache.getImage('left');
      if (saved) {
        setSavedPhoto(saved.uri);
        setShouldMirror(saved.shouldMirror);
      } else {
        setSavedPhoto(null);
        setShouldMirror(false);
      }
    } catch (error) {
      console.error('Failed to load saved image:', error);
    }
  }, [scanResults.left]);

  useEffect(() => {
    loadSavedImage();
  }, [loadSavedImage]);

  // Reload image when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadSavedImage();
    }, [loadSavedImage])
  );

  const handlePhotoTaken = async (uri: string, mirror: boolean = false) => {
    try {
      // Update UI immediately
      setSavedPhoto(uri);
      setShouldMirror(mirror);
      
      // Upload to Supabase and save locally (async)
      uploadScanImage(uri, 'left', mirror);
      
      // Navigate immediately without waiting for upload
      router.push('/onboarding/analysis');
    } catch (error) {
      console.error('Failed to save image:', error);
      Alert.alert('Error', 'Failed to save photo. Please try again.');
    }
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Left Side Photo',
          headerBackVisible: true,
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontFamily: 'Georgia',
            fontSize: 18,
            fontWeight: '600',
          },
        }} 
      />
      <SafeAreaView style={{ flex: 1 }}>
        <PhotoUpload
          title="Left Profile"
          description="Turn your head 90° to the left to show your complete profile with good lighting."
          exampleImageUrl="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face"
          badExampleUrl="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face"
          onPhotoTaken={handlePhotoTaken}
          savedPhoto={savedPhoto}
          savedShouldMirror={shouldMirror}
          scanType="left"
        />
      </SafeAreaView>
    </>
  );
}

