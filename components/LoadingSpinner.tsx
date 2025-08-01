import React, { memo } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
  message?: string;
  overlay?: boolean;
}

export const LoadingSpinner = memo<LoadingSpinnerProps>(({
  size = 'large',
  color = '#3B82F6',
  message,
  overlay = false,
}) => {
  const containerClass = overlay
    ? 'absolute inset-0 bg-black/20 justify-center items-center z-50'
    : 'justify-center items-center py-8';

  return (
    <View className={containerClass}>
      <Text style={{ fontSize: 20 }}>📊</Text>
      {message && (
        <Text className="text-gray-600 mt-4 text-center">
          {message}
        </Text>
      )}
    </View>
  );
});

LoadingSpinner.displayName = 'LoadingSpinner';

// Skeleton loader for better UX
interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  className?: string;
}

export const Skeleton = memo<SkeletonProps>(({
  width = '100%',
  height = 20,
  borderRadius = 4,
  className = '',
}) => {
  return (
    <View
      className={`bg-gray-200 animate-pulse ${className}`}
      style={{
        width,
        height,
        borderRadius,
      }}
    />
  );
});

Skeleton.displayName = 'Skeleton';

// Card skeleton for consistent loading states
export const CardSkeleton = memo(() => (
  <View className="p-4 bg-white rounded-lg shadow-sm mb-4">
    <Skeleton height={20} className="mb-2" />
    <Skeleton height={16} width="80%" className="mb-2" />
    <Skeleton height={16} width="60%" />
  </View>
));

CardSkeleton.displayName = 'CardSkeleton';

// List skeleton
interface ListSkeletonProps {
  count?: number;
}

export const ListSkeleton = memo<ListSkeletonProps>(({ count = 3 }) => (
  <View>
    {Array.from({ length: count }, (_, index) => (
      <CardSkeleton key={index} />
    ))}
  </View>
));

ListSkeleton.displayName = 'ListSkeleton';
