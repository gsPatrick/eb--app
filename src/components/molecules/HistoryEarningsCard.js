import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { TrendingUp } from 'lucide-react-native';
import EBText from '../atoms/Text';
import { colors, radius, shadows, spacing } from '../../theme/variables';

export default function HistoryEarningsCard({ total, orderCount }) {
  const { t } = useTranslation();

  return (
    <LinearGradient colors={[colors.primary, '#0B3A8C']} style={styles.card}>
      <View style={styles.glow} />
      <View style={styles.row}>
        <View>
          <EBText variant="caption" color="inverse" style={styles.label}>
            {t('history.totalEarned')}
          </EBText>
          <EBText variant="display" color="inverse" style={styles.amount}>
            {total}
          </EBText>
          <EBText variant="caption" color="inverse" style={styles.meta}>
            {t('history.completedCount', { count: orderCount })}
          </EBText>
        </View>
        <View style={styles.iconWrap}>
          <TrendingUp size={28} color={colors.accent} />
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.xl,
    padding: spacing.xxl,
    marginBottom: spacing.xl,
    overflow: 'hidden',
    ...shadows.glow,
  },
  glow: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(79, 124, 255, 0.2)',
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { opacity: 0.85, letterSpacing: 1, textTransform: 'uppercase', fontSize: 11 },
  amount: { fontSize: 32, marginTop: spacing.xs, marginBottom: spacing.xs },
  meta: { opacity: 0.8 },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: radius.lg,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
