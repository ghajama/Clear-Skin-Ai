import React, { useState, useRef, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Dimensions, 
  Platform, 
  Alert,
  ActionSheetIOS
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { H3, Body } from '@/components/ui/Typography';
import { colors, spacing, borderRadius, shadows } from '@/constants/theme';
import { Button } from '@/components/ui/Button';
import { 
  Camera, 
  RotateCcw, 
  Check, 
  Upload, 
  FlipHorizontal
} from 'lucide-react-native';
import { Image } from 'expo-image';
import { useSkincare } from '@/hooks/useSkincare';

const { width } = Dimensions.get('window');

interface PhotoUploadProps {
  title: string;
  description: string;
  exampleImageUrl: string;
  badExampleUrl: string;
  onPhotoTaken: (uri: string, shouldMirror?: boolean) => void;
  savedPhoto?: string | null;
  savedShouldMirror?: boolean;
  scanType: 'front' | 'right' | 'left';
}

export default function PhotoUpload({
  title,
  description,
  exampleImageUrl,
  badExampleUrl,
  onPhotoTaken,
  savedPhoto,
  savedShouldMirror = false,
  scanType
}: PhotoUploadProps) {
  const { isUploading } = useSkincare();
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('front');
  const [capturedImage, setCapturedImage] = useState<string | null>(savedPhoto || null);
  const [cameraActive, setCameraActive] = useState(false);
  const [isFromCamera, setIsFromCamera] = useState(false);
  const [shouldMirror, setShouldMirror] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    if (savedPhoto) {
      setCapturedImage(savedPhoto);
      setShouldMirror(savedShouldMirror);
    }
  }, [savedPhoto, savedShouldMirror]);

  const showImagePicker = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Take Photo', 'Choose from Gallery'],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            openCamera();
          } else if (buttonIndex === 2) {
            openGallery();
          }
        }
      );
    } else {
      Alert.alert(
        'Select Photo',
        'Choose how you want to add your photo',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Take Photo', onPress: openCamera },
          { text: 'Choose from Gallery', onPress: openGallery },
        ]
      );
    }
  };

  const openCamera = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert('Permission Required', 'Camera access is needed to take photos.');
        return;
      }
    }
    setCameraActive(true);
    setIsFromCamera(true);
  };

  const openGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Gallery access is needed to select photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setCapturedImage(result.assets[0].uri);
      setIsFromCamera(false);
      setShouldMirror(false); // Gallery images are never mirrored
      console.log('📸 [PhotoUpload] Photo selected from gallery, shouldMirror: false');
    }
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
        });
        
        if (photo?.uri) {
          setCapturedImage(photo.uri);
          setCameraActive(false);
          setIsFromCamera(true);
          // Mirror only front camera selfies for natural appearance
          const shouldMirrorImage = facing === 'front';
          setShouldMirror(shouldMirrorImage);
          console.log(`📸 [PhotoUpload] Photo taken with ${facing} camera, shouldMirror: ${shouldMirrorImage}`);
        }
      } catch (error) {
        console.error('Failed to take picture:', error);
        Alert.alert('Error', 'Failed to capture photo. Please try again.');
      }
    }
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const usePhoto = async () => {
    if (capturedImage && !isProcessing && !isUploading(scanType)) {
      setIsProcessing(true);
      try {
        console.log(`📸 [PhotoUpload] Using photo with shouldMirror: ${shouldMirror}`);
        // Call onPhotoTaken which will handle the upload and navigation
        onPhotoTaken(capturedImage, shouldMirror);
        // Don't wait for upload to complete - let user continue immediately
      } catch (error) {
        console.error('Error processing photo:', error);
        Alert.alert('Error', 'Failed to process photo. Please try again.');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setShouldMirror(false);
    if (isFromCamera) {
      setCameraActive(true);
    }
  };



  return (
    <View style={styles.container}>
      {/* Top Section - Photo Display */}
      <View style={styles.photoContainer}>
        {cameraActive && Platform.OS !== 'web' ? (
          <View style={styles.cameraWrapper}>
            <CameraView
              ref={cameraRef}
              style={styles.camera}
              facing={facing}
            />
            <View style={styles.cameraOverlay}>
              <View style={styles.faceGuide}>
                <View style={styles.faceOutline} />
              </View>
            </View>
          </View>
        ) : capturedImage ? (
          <Image
            source={{ uri: capturedImage }}
            style={[
              styles.capturedPhoto,
              shouldMirror && { transform: [{ scaleX: -1 }] }
            ]}
            contentFit="cover"
          />
        ) : (
          <View style={styles.placeholderContainer}>
            <Image
              source={{ uri: exampleImageUrl }}
              style={styles.exampleImage}
              contentFit="cover"
            />
            <View style={styles.placeholderOverlay}>
              <Upload size={32} color={colors.text.light} />
            </View>
          </View>
        )}
      </View>

      {/* Bottom Section - Instructions and Buttons */}
      <View style={styles.instructionsContainer}>
        <View style={styles.instructionCard}>
          {/* Only show instructions when no camera active and no image captured */}
          {!cameraActive && !capturedImage && (
            <View style={styles.instructionHeader}>
              <View style={styles.examplesContainer}>
                <View style={styles.exampleItem}>
                  <View style={styles.exampleImageContainer}>
                    <Image
                      source={{ uri: badExampleUrl }}
                      style={styles.exampleImageSmall}
                      contentFit="cover"
                    />
                  </View>
                  <Body style={styles.exampleLabel}>❌ Bad</Body>
                </View>
                <View style={styles.exampleItem}>
                  <View style={styles.exampleImageContainer}>
                    <Image
                      source={{ uri: exampleImageUrl }}
                      style={styles.exampleImageSmall}
                      contentFit="cover"
                    />
                  </View>
                  <Body style={styles.exampleLabel}>✅ Good</Body>
                </View>
              </View>
              <View style={styles.instructionText}>
                <Body style={styles.instructionDescription}>
                  {description}
                </Body>
              </View>
            </View>
          )}

          <View style={styles.buttonContainer}>
            {cameraActive ? (
              <View style={styles.cameraActions}>
                <Button
                  title="Take Photo"
                  onPress={takePicture}
                  style={styles.takePhotoButton}
                  icon={<Camera size={20} color={colors.text.light} />}
                />
                <Button
                  title="Flip Camera"
                  onPress={toggleCameraFacing}
                  variant="outline"
                  style={styles.flipButton}
                  icon={<FlipHorizontal size={20} color={colors.primary} />}
                />
              </View>
            ) : !capturedImage ? (
              <Button
                title="Upload or Take Photo"
                onPress={showImagePicker}
                style={styles.uploadButton}
                icon={<Camera size={20} color={colors.text.light} />}
              />
            ) : (
              <View style={styles.photoActions}>
                <Button
                  title="Use Another"
                  onPress={retakePhoto}
                  variant="outline"
                  style={styles.actionButton}
                  icon={<RotateCcw size={20} color={colors.primary} />}
                />
                <Button
                  title={isProcessing ? "Processing..." : "Continue"}
                  onPress={usePhoto}
                  style={styles.actionButton}
                  disabled={isProcessing}
                  icon={<Check size={20} color={colors.text.light} />}
                />
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  photoContainer: {
    flex: 1,
    backgroundColor: colors.card,
    margin: spacing.m,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...shadows.medium,
  },
  cameraWrapper: {
    flex: 1,
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  faceGuide: {
    width: width * 0.6,
    height: width * 0.75,
    justifyContent: 'center',
    alignItems: 'center',
  },
  faceOutline: {
    width: '100%',
    height: '100%',
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: borderRadius.xl,
    backgroundColor: 'transparent',
  },
  capturedPhoto: {
    flex: 1,
  },
  placeholderContainer: {
    flex: 1,
    position: 'relative',
  },
  exampleImage: {
    flex: 1,
    opacity: 0.7,
  },
  placeholderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructionsContainer: {
    padding: spacing.m,
  },
  instructionCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    ...shadows.light,
  },
  instructionHeader: {
    marginBottom: spacing.l,
  },
  examplesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.m,
  },
  exampleItem: {
    alignItems: 'center',
  },
  exampleImageContainer: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.m,
    overflow: 'hidden',
    marginBottom: spacing.xs,
    ...shadows.light,
  },
  exampleImageSmall: {
    width: '100%',
    height: '100%',
  },
  exampleLabel: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: colors.text.secondary,
  },
  instructionText: {
    alignItems: 'center',
  },
  instructionTitle: {
    color: colors.text.primary,
    marginBottom: spacing.xs,
    textAlign: 'center' as const,
  },
  instructionDescription: {
    color: colors.text.secondary,
    fontSize: 14,
    textAlign: 'center' as const,
    lineHeight: 20,
  },
  buttonContainer: {
    gap: spacing.m,
  },
  uploadButton: {
    backgroundColor: colors.primary,
  },
  cameraActions: {
    flexDirection: 'row',
    gap: spacing.m,
  },
  takePhotoButton: {
    flex: 2,
    backgroundColor: colors.primary,
  },
  flipButton: {
    flex: 1,
  },
  photoActions: {
    flexDirection: 'row',
    gap: spacing.m,
  },
  actionButton: {
    flex: 1,
  },
});