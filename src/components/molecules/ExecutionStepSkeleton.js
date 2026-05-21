import React from 'react';
import { StyleSheet, View } from 'react-native';
import Skeleton from '../atoms/Skeleton';
import { colors, radius, spacing } from '../../theme/variables';

export default function ExecutionStepSkeleton({ compact = false }) {
  if (compact) {
    return (
      <View style={styles.compactPanel}>
        <Skeleton width="70%" height={22} />
        <Skeleton width="100%" height={14} style={styles.line} />
        <Skeleton width="90%" height={14} style={styles.line} />
        <Skeleton height={48} borderRadius={radius.md} style={styles.btn} />
      </View>
    );
  }

  return (
    <View style={styles.wrap}>
      <Skeleton height={120} borderRadius={radius.xl} style={styles.hero} />
      <Skeleton width={140} height={16} style={styles.step} />
      <View style={styles.panel}>
        <Skeleton width="70%" height={22} />
        <Skeleton width="100%" height={14} style={styles.line} />
        <Skeleton width="90%" height={14} style={styles.line} />
        <Skeleton height={48} borderRadius={radius.md} style={styles.btn} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.lg },
  hero: { marginBottom: spacing.sm },
  step: { alignSelf: 'center' },
  panel: {
    backgroundColor: colors.bgElevated,
    borderRadius: radius.lg,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  line: { marginTop: spacing.md },
  btn: { marginTop: spacing.xl },
  compactPanel: { gap: spacing.sm },
});
