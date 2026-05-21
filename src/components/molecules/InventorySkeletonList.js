import React from 'react';
import { StyleSheet, View } from 'react-native';
import Skeleton from '../atoms/Skeleton';
import { colors, radius, spacing } from '../../theme/variables';

function InventoryRowSkeleton() {
  return (
    <View style={styles.row}>
      <View style={styles.flex}>
        <Skeleton width="60%" height={16} style={styles.mb} />
        <Skeleton width="40%" height={12} />
      </View>
      <Skeleton width={48} height={24} borderRadius={radius.full} />
    </View>
  );
}

export default function InventorySkeletonList({ count = 6 }) {
  return (
    <View>
      <Skeleton width="50%" height={28} style={styles.title} />
      <Skeleton width="80%" height={14} style={styles.subtitle} />
      {Array.from({ length: count }).map((_, i) => (
        <InventoryRowSkeleton key={i} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  title: { marginBottom: spacing.sm },
  subtitle: { marginBottom: spacing.xl },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.bgElevated,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  flex: { flex: 1 },
  mb: { marginBottom: spacing.sm },
});
