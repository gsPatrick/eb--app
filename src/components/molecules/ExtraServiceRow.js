import React from 'react';
import { ActivityIndicator, StyleSheet, Switch, View } from 'react-native';
import EBText from '../atoms/Text';
import { colors, radius, spacing } from '../../theme/variables';

export default function ExtraServiceRow({ extra, checked, disabled, loading, onToggle, formatCurrency }) {
  return (
    <View style={styles.row}>
      <View style={styles.info}>
        <EBText variant="bodyMedium">{extra.name}</EBText>
        <EBText variant="caption" color="secondary">
          {formatCurrency(extra.defaultPrice)}
          {extra.estimatedTime ? ` · ${extra.estimatedTime} min` : ''}
        </EBText>
      </View>
      {loading ? (
        <ActivityIndicator color={colors.primary} />
      ) : (
        <Switch
          value={checked}
          disabled={disabled}
          onValueChange={onToggle}
          trackColor={{ false: colors.borderStrong, true: colors.accentSoft }}
          thumbColor={checked ? colors.accent : colors.bgElevated}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  info: { flex: 1, paddingRight: spacing.md },
});
