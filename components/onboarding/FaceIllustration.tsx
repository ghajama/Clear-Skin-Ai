import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Ellipse } from 'react-native-svg';
import { colors } from '@/constants/theme';

interface FaceIllustrationProps {
  type: 'front' | 'left' | 'right';
  size?: number;
}

export const FaceIllustration: React.FC<FaceIllustrationProps> = ({ type, size = 60 }) => {
  const renderFrontFace = () => (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      {/* Face outline */}
      <Ellipse cx="50" cy="55" rx="30" ry="35" fill="none" stroke={colors.primary} strokeWidth="2" />
      {/* Eyes */}
      <Circle cx="42" cy="45" r="3" fill={colors.primary} />
      <Circle cx="58" cy="45" r="3" fill={colors.primary} />
      {/* Nose */}
      <Path d="M50 50 L48 58 L52 58 Z" fill="none" stroke={colors.primary} strokeWidth="1.5" />
      {/* Mouth */}
      <Path d="M45 65 Q50 70 55 65" fill="none" stroke={colors.primary} strokeWidth="1.5" />
    </Svg>
  );

  const renderLeftProfile = () => (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      {/* Face outline - left profile */}
      <Path 
        d="M30 25 Q45 20 60 30 Q65 40 65 55 Q65 70 60 80 Q45 85 30 75 Q25 65 25 55 Q25 40 30 25" 
        fill="none" 
        stroke={colors.primary} 
        strokeWidth="2" 
      />
      {/* Eye */}
      <Circle cx="45" cy="45" r="3" fill={colors.primary} />
      {/* Nose */}
      <Path d="M55 45 L60 52 L55 58" fill="none" stroke={colors.primary} strokeWidth="1.5" />
      {/* Mouth */}
      <Path d="M45 65 Q50 68 52 65" fill="none" stroke={colors.primary} strokeWidth="1.5" />
    </Svg>
  );

  const renderRightProfile = () => (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      {/* Face outline - right profile */}
      <Path 
        d="M70 25 Q55 20 40 30 Q35 40 35 55 Q35 70 40 80 Q55 85 70 75 Q75 65 75 55 Q75 40 70 25" 
        fill="none" 
        stroke={colors.primary} 
        strokeWidth="2" 
      />
      {/* Eye */}
      <Circle cx="55" cy="45" r="3" fill={colors.primary} />
      {/* Nose */}
      <Path d="M45 45 L40 52 L45 58" fill="none" stroke={colors.primary} strokeWidth="1.5" />
      {/* Mouth */}
      <Path d="M55 65 Q50 68 48 65" fill="none" stroke={colors.primary} strokeWidth="1.5" />
    </Svg>
  );

  const renderFace = () => {
    switch (type) {
      case 'front':
        return renderFrontFace();
      case 'left':
        return renderLeftProfile();
      case 'right':
        return renderRightProfile();
      default:
        return renderFrontFace();
    }
  };

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {renderFace()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 8,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
});