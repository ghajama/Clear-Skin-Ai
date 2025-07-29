import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Ellipse } from 'react-native-svg';
import { colors } from '@/constants/theme';

interface FaceGuideProps {
  type: 'front' | 'left' | 'right';
  size?: number;
}

export const FaceGuide: React.FC<FaceGuideProps> = ({ type, size = 60 }) => {
  const renderFrontFace = () => (
    <Svg width={size} height={size * 1.2} viewBox="0 0 60 72">
      {/* Face outline - more realistic oval */}
      <Path
        d="M30 6 C42 6, 50 14, 50 26 L50 42 C50 54, 42 66, 30 66 C18 66, 10 54, 10 42 L10 26 C10 14, 18 6, 30 6 Z"
        fill="rgba(255, 255, 255, 0.1)"
        stroke={colors.primary}
        strokeWidth="2.5"
        opacity="0.9"
      />
      {/* Hair line */}
      <Path
        d="M15 18 Q30 12 45 18"
        fill="none"
        stroke={colors.primary}
        strokeWidth="1.5"
        opacity="0.7"
      />
      {/* Eyebrows */}
      <Path d="M19 24 Q23 22 27 24" fill="none" stroke={colors.primary} strokeWidth="1.5" opacity="0.7" />
      <Path d="M33 24 Q37 22 41 24" fill="none" stroke={colors.primary} strokeWidth="1.5" opacity="0.7" />
      {/* Eyes */}
      <Ellipse cx="23" cy="28" rx="3" ry="2" fill="none" stroke={colors.primary} strokeWidth="1.5" opacity="0.8" />
      <Ellipse cx="37" cy="28" rx="3" ry="2" fill="none" stroke={colors.primary} strokeWidth="1.5" opacity="0.8" />
      <Circle cx="23" cy="28" r="1" fill={colors.primary} opacity="0.8" />
      <Circle cx="37" cy="28" r="1" fill={colors.primary} opacity="0.8" />
      {/* Nose */}
      <Path
        d="M30 32 L29 38 Q30 40 31 38 L30 32"
        fill="none"
        stroke={colors.primary}
        strokeWidth="1.5"
        opacity="0.7"
      />
      {/* Mouth */}
      <Path
        d="M25 48 Q30 52 35 48"
        fill="none"
        stroke={colors.primary}
        strokeWidth="2"
        opacity="0.8"
      />
      {/* Chin line */}
      <Path
        d="M20 58 Q30 62 40 58"
        fill="none"
        stroke={colors.primary}
        strokeWidth="1"
        opacity="0.5"
      />
    </Svg>
  );

  const renderLeftProfile = () => (
    <Svg width={size} height={size * 1.2} viewBox="0 0 60 72">
      {/* Face outline - left profile */}
      <Path
        d="M12 26 C12 14, 18 6, 28 6 C38 6, 48 10, 52 18 C54 22, 54 26, 52 30 L50 34 C52 38, 52 42, 50 46 C48 54, 42 62, 34 66 C26 66, 18 62, 14 54 C12 50, 12 46, 14 42 L12 38 C10 34, 10 30, 12 26 Z"
        fill="rgba(255, 255, 255, 0.1)"
        stroke={colors.primary}
        strokeWidth="2.5"
        opacity="0.9"
      />
      {/* Hair */}
      <Path
        d="M28 6 C35 4, 42 6, 48 12"
        fill="none"
        stroke={colors.primary}
        strokeWidth="1.5"
        opacity="0.7"
      />
      {/* Forehead */}
      <Path
        d="M20 20 C25 18, 35 18, 45 22"
        fill="none"
        stroke={colors.primary}
        strokeWidth="1"
        opacity="0.5"
      />
      {/* Eye */}
      <Ellipse cx="32" cy="28" rx="3" ry="2" fill="none" stroke={colors.primary} strokeWidth="1.5" opacity="0.8" />
      <Circle cx="32" cy="28" r="1" fill={colors.primary} opacity="0.8" />
      {/* Eyebrow */}
      <Path d="M28 24 Q32 22 36 24" fill="none" stroke={colors.primary} strokeWidth="1.5" opacity="0.7" />
      {/* Nose bridge and tip */}
      <Path
        d="M38 28 C42 30, 46 34, 48 38 C46 40, 44 40, 42 38"
        fill="none"
        stroke={colors.primary}
        strokeWidth="1.5"
        opacity="0.8"
      />
      {/* Nostril */}
      <Circle cx="44" cy="38" r="1" fill="none" stroke={colors.primary} strokeWidth="1" opacity="0.6" />
      {/* Mouth */}
      <Path
        d="M36 48 C40 50, 42 50, 40 52"
        fill="none"
        stroke={colors.primary}
        strokeWidth="2"
        opacity="0.8"
      />
      {/* Chin */}
      <Path
        d="M28 58 C32 62, 36 62, 38 60"
        fill="none"
        stroke={colors.primary}
        strokeWidth="1.5"
        opacity="0.7"
      />
      {/* Jaw line */}
      <Path
        d="M18 40 C22 50, 28 58, 36 60"
        fill="none"
        stroke={colors.primary}
        strokeWidth="1"
        opacity="0.5"
      />
    </Svg>
  );

  const renderRightProfile = () => (
    <Svg width={size} height={size * 1.2} viewBox="0 0 60 72">
      {/* Face outline - right profile (mirrored) */}
      <Path
        d="M48 26 C48 14, 42 6, 32 6 C22 6, 12 10, 8 18 C6 22, 6 26, 8 30 L10 34 C8 38, 8 42, 10 46 C12 54, 18 62, 26 66 C34 66, 42 62, 46 54 C48 50, 48 46, 46 42 L48 38 C50 34, 50 30, 48 26 Z"
        fill="rgba(255, 255, 255, 0.1)"
        stroke={colors.primary}
        strokeWidth="2.5"
        opacity="0.9"
      />
      {/* Hair */}
      <Path
        d="M32 6 C25 4, 18 6, 12 12"
        fill="none"
        stroke={colors.primary}
        strokeWidth="1.5"
        opacity="0.7"
      />
      {/* Forehead */}
      <Path
        d="M40 20 C35 18, 25 18, 15 22"
        fill="none"
        stroke={colors.primary}
        strokeWidth="1"
        opacity="0.5"
      />
      {/* Eye */}
      <Ellipse cx="28" cy="28" rx="3" ry="2" fill="none" stroke={colors.primary} strokeWidth="1.5" opacity="0.8" />
      <Circle cx="28" cy="28" r="1" fill={colors.primary} opacity="0.8" />
      {/* Eyebrow */}
      <Path d="M32 24 Q28 22 24 24" fill="none" stroke={colors.primary} strokeWidth="1.5" opacity="0.7" />
      {/* Nose bridge and tip */}
      <Path
        d="M22 28 C18 30, 14 34, 12 38 C14 40, 16 40, 18 38"
        fill="none"
        stroke={colors.primary}
        strokeWidth="1.5"
        opacity="0.8"
      />
      {/* Nostril */}
      <Circle cx="16" cy="38" r="1" fill="none" stroke={colors.primary} strokeWidth="1" opacity="0.6" />
      {/* Mouth */}
      <Path
        d="M24 48 C20 50, 18 50, 20 52"
        fill="none"
        stroke={colors.primary}
        strokeWidth="2"
        opacity="0.8"
      />
      {/* Chin */}
      <Path
        d="M32 58 C28 62, 24 62, 22 60"
        fill="none"
        stroke={colors.primary}
        strokeWidth="1.5"
        opacity="0.7"
      />
      {/* Jaw line */}
      <Path
        d="M42 40 C38 50, 32 58, 24 60"
        fill="none"
        stroke={colors.primary}
        strokeWidth="1"
        opacity="0.5"
      />
    </Svg>
  );

  return (
    <View style={styles.container}>
      {type === 'front' && renderFrontFace()}
      {type === 'left' && renderLeftProfile()}
      {type === 'right' && renderRightProfile()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 8,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});