import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView, Alert } from 'react-native';
import { router, Stack, useFocusEffect } from 'expo-router';
import { imageCache } from '@/lib/storage';
import { useSkincare } from '@/hooks/useSkincare';
import PhotoUpload from '@/components/onboarding/PhotoUpload';

export default function ScanRightScreen() {
  const { uploadScanImage, scanResults } = useSkincare();
  const [savedPhoto, setSavedPhoto] = useState<string | null>(null);
  const [shouldMirror, setShouldMirror] = useState(false);

  const loadSavedImage = useCallback(async () => {
    try {
      // First try to get from scanResults (which includes Supabase URLs)
      if (scanResults.right) {
        setSavedPhoto(scanResults.right.uri);
        setShouldMirror(scanResults.right.shouldMirror);
        return;
      }
      
      // Fallback to local cache
      const saved = await imageCache.getImage('right');
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
  }, [scanResults.right]);

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
      uploadScanImage(uri, 'right', mirror);
      
      // Navigate immediately without waiting for upload
      router.push('/onboarding/scan-left');
    } catch (error) {
      console.error('Failed to save image:', error);
      Alert.alert('Error', 'Failed to save photo. Please try again.');
    }
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Right Side Photo',
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
          title="Right Profile"
          description="Turn your head 90° to the right to show your complete profile with good lighting."
          exampleImageUrl="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"
          badExampleUrl="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face"
          onPhotoTaken={handlePhotoTaken}
          savedPhoto={savedPhoto}
          savedShouldMirror={shouldMirror}
          scanType="right"
        />
      </SafeAreaView>
    </>
  );
}

