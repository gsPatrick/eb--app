import React from 'react';
import { StyleSheet, View } from 'react-native';
import Skeleton from '../atoms/Skeleton';
import { colors, radius, spacing } from '../../theme/variables';

function ScheduleCardSkeleton() {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={styles.flex}>
          <Skeleton width="65%" height={20} style={styles.mb} />
          <Skeleton width="90%" height={14} />
        </View>
        <Skeleton width={72} height={24} borderRadius={radius.full} />
      </View>
      <Skeleton width="50%" height={12} style={styles.mt} />
      <Skeleton width="40%" height={12} style={styles.mtSm} />
      <View style={styles.actions}>
        <Skeleton width={100} height={14} />
        <Skeleton width={88} height={40} borderRadius={radius.md} />
      </View>
    </View>
  );
}

export default function ScheduleSkeletonList({ count = 3 }) {
  return (
    <View>
      <Skeleton width="45%" height={28} style={styles.title} />
      <Skeleton width="75%" height={14} style={styles.subtitle} />
      {Array.from({ length: count }).map((_, i) => (
        <ScheduleCardSkeleton key={i} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bgElevated,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.md },
  flex: { flex: 1 },
  mb: { marginBottom: spacing.sm },
  mt: { marginTop: spacing.lg },
  mtSm: { marginTop: spacing.sm },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  title: { marginBottom: spacing.sm },
  subtitle: { marginBottom: spacing.xl },
});
