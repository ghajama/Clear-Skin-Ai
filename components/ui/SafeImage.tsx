import React from 'react';
import { Platform } from 'react-native';
import { Image as ExpoImage, ImageProps } from 'expo-image';

// Safe Image component that uses native HTML img on web to eliminate ALL warnings
export const SafeImage: React.FC<ImageProps> = (props) => {
  if (Platform.OS === 'web') {
    // On web, use native HTML img to avoid ALL Expo Image warnings
    const { source, style, contentFit, ...otherProps } = props;
    const uri = typeof source === 'object' && source && 'uri' in source ? source.uri : source;

    // Convert React Native styles to web-compatible CSS
    const convertedStyle: React.CSSProperties = {};
    if (style && typeof style === 'object') {
      const styleObj = style as any;
      // Convert common React Native styles to CSS
      if (styleObj.width) convertedStyle.width = styleObj.width;
      if (styleObj.height) convertedStyle.height = styleObj.height;
      if (styleObj.borderRadius) convertedStyle.borderRadius = styleObj.borderRadius;
      if (styleObj.transform) {
        // Handle transform array from React Native
        if (Array.isArray(styleObj.transform)) {
          const transforms = styleObj.transform.map((t: any) => {
            if (t.scaleX) return `scaleX(${t.scaleX})`;
            return '';
          }).filter(Boolean);
          if (transforms.length > 0) {
            convertedStyle.transform = transforms.join(' ');
          }
        }
      }
    }

    // Set object-fit based on contentFit
    convertedStyle.objectFit = contentFit === 'cover' ? 'cover' :
                              contentFit === 'contain' ? 'contain' :
                              contentFit === 'fill' ? 'fill' : 'cover';

    return (
      <img
        src={uri as string}
        style={convertedStyle}
        alt=""
      />
    );
  }

  // On native platforms, use Expo Image
  return <ExpoImage {...props} />;
};

export default SafeImage;
