import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView, Alert } from 'react-native';
import { router, Stack, useFocusEffect } from 'expo-router';
import { imageCache } from '@/lib/storage';
import { useSkincare } from '@/hooks/useSkincare';
import PhotoUpload from '@/components/onboarding/PhotoUpload';

export default function ScanFrontScreen() {
  const { uploadScanImage, scanResults } = useSkincare();
  const [savedPhoto, setSavedPhoto] = useState<string | null>(null);
  const [shouldMirror, setShouldMirror] = useState(false);

  const loadSavedImage = useCallback(async () => {
    try {
      // Clean expired sessions on load
      await imageCache.cleanExpiredSessions();
      
      // First try to get from scanResults (which includes Supabase URLs)
      if (scanResults.front) {
        setSavedPhoto(scanResults.front.uri);
        setShouldMirror(scanResults.front.shouldMirror);
        return;
      }
      
      // Fallback to local cache
      const saved = await imageCache.getImage('front');
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
  }, [scanResults.front]);

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
      uploadScanImage(uri, 'front', mirror);
      
      // Navigate immediately without waiting for upload
      router.push('/onboarding/scan-right');
    } catch (error) {
      console.error('Failed to save image:', error);
      Alert.alert('Error', 'Failed to save photo. Please try again.');
    }
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Front Photo',
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
          title="Front View"
          description="Position your face directly facing the camera with good lighting and a neutral expression."
          exampleImageUrl="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"
          badExampleUrl="https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=400&h=400&fit=crop&crop=face"
          onPhotoTaken={handlePhotoTaken}
          savedPhoto={savedPhoto}
          savedShouldMirror={shouldMirror}
          scanType="front"
        />
      </SafeAreaView>
    </>
  );
}

