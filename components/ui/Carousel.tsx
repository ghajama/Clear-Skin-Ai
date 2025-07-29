import { colors, spacing } from '@/constants/theme';
import React, { useState, useRef } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  ViewStyle,
  StyleProp,
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

interface CarouselProps {
  children: React.ReactNode[];
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  showIndicators?: boolean;
  indicatorColor?: string;
  activeIndicatorColor?: string;
  indicatorSize?: number;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  onPageChange?: (index: number) => void;
}

export const Carousel: React.FC<CarouselProps> = ({
  children,
  style,
  contentContainerStyle,
  showIndicators = true,
  indicatorColor = colors.border,
  activeIndicatorColor = colors.primary,
  indicatorSize = 8,
  autoPlay = false,
  autoPlayInterval = 3000,
  onPageChange,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(contentOffsetX / screenWidth);
    
    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex);
      onPageChange?.(newIndex);
    }
  };

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (autoPlay && children.length > 1) {
      interval = setInterval(() => {
        const nextIndex = (activeIndex + 1) % children.length;
        scrollViewRef.current?.scrollTo({
          x: nextIndex * screenWidth,
          animated: true,
        });
        setActiveIndex(nextIndex);
        onPageChange?.(nextIndex);
      }, autoPlayInterval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeIndex, autoPlay, autoPlayInterval, children.length, onPageChange]);

  return (
    <View style={[styles.container, style]}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={contentContainerStyle}
      >
        {children.map((child, index) => (
          <View key={index} style={styles.slide}>
            {child}
          </View>
        ))}
      </ScrollView>
      
      {showIndicators && children.length > 1 && (
        <View style={styles.indicatorsContainer}>
          {children.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                {
                  width: indicatorSize,
                  height: indicatorSize,
                  borderRadius: indicatorSize / 2,
                  backgroundColor:
                    index === activeIndex ? activeIndicatorColor : indicatorColor,
                  marginHorizontal: indicatorSize / 3,
                },
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  slide: {
    width: screenWidth,
  },
  indicatorsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.m,
  },
  indicator: {
    marginHorizontal: 4,
  },
});