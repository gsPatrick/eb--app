import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { colors, radius } from '../../theme/variables';

export default function Skeleton({ width = '100%', height = 14, style, borderRadius = radius.sm }) {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 900, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  const opacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.45, 1] });

  return (
    <Animated.View style={[{ opacity, width, height, borderRadius }, styles.base, style]} />
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.skeletonBase,
    overflow: 'hidden',
  },
});
