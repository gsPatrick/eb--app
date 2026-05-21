import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, Minus, Plus } from 'lucide-react-native';
import Badge from '../atoms/Badge';
import EBText from '../atoms/Text';
import { colors, radius, spacing } from '../../theme/variables';

const STATUS_STYLES = {
  ok: { border: colors.border, bg: colors.bgElevated, badge: 'success' },
  low: { border: colors.warning, bg: colors.warningSoft, badge: 'warning' },
  critical: { border: colors.error, bg: colors.errorSoft, badge: 'error' },
};

export default function InventoryItemRow({
  item,
  formatQuantity,
  statusLabel,
  editable = false,
  saving = false,
  onSave,
}) {
  const { t } = useTranslation();
  const style = STATUS_STYLES[item.status] || STATUS_STYLES.ok;
  const [quantity, setQuantity] = useState(String(item.quantity));

  useEffect(() => {
    setQuantity(String(item.quantity));
  }, [item.id, item.quantity]);

  const adjustQuantity = (delta) => {
    const next = Math.max(0, Number(quantity || 0) + delta);
    setQuantity(String(next));
  };

  const handleSave = () => {
    const next = Number(quantity);
    if (!Number.isFinite(next) || next < 0) return;
    onSave?.(next);
  };

  return (
    <View style={[styles.row, { borderColor: style.border, backgroundColor: style.bg }]}>
      <View style={styles.info}>
        <EBText variant="bodyMedium">{item.item}</EBText>
        <EBText variant="caption" color="secondary" style={styles.property}>
          {item.property}
        </EBText>
        <EBText variant="caption" color="secondary">
          {formatQuantity(Number(quantity) || 0, item.unit, item.minQuantity)}
        </EBText>
      </View>

      <View style={styles.side}>
        {item.status === 'critical' ? <AlertTriangle size={16} color={colors.error} /> : null}
        <Badge variant={style.badge}>{statusLabel}</Badge>

        {editable ? (
          <View style={styles.editor}>
            <View style={styles.stepper}>
              <Pressable
                style={styles.stepBtn}
                onPress={() => adjustQuantity(-1)}
                disabled={saving}
                accessibilityLabel="Diminuir quantidade"
              >
                <Minus size={16} color={colors.primary} />
              </Pressable>
              <TextInput
                style={styles.input}
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="decimal-pad"
                editable={!saving}
              />
              <Pressable
                style={styles.stepBtn}
                onPress={() => adjustQuantity(1)}
                disabled={saving}
                accessibilityLabel="Aumentar quantidade"
              >
                <Plus size={16} color={colors.primary} />
              </Pressable>
            </View>
            <Pressable
              style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
              onPress={handleSave}
              disabled={saving || Number(quantity) === item.quantity}
            >
              {saving ? (
                <ActivityIndicator size="small" color={colors.textInverse} />
              ) : (
                <EBText variant="caption" color="inverse">
                  {t('inventory.save')}
                </EBText>
              )}
            </Pressable>
          </View>
        ) : (
          <EBText variant="caption" color="muted" style={styles.readOnly}>
            {t('inventory.readOnlyItem')}
          </EBText>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
  },
  info: { flex: 1, paddingRight: spacing.md },
  property: { marginTop: 2, marginBottom: 4 },
  side: { alignItems: 'flex-end', gap: spacing.sm, minWidth: 120 },
  editor: { alignItems: 'stretch', gap: spacing.sm, width: '100%' },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  stepBtn: {
    width: 32,
    height: 32,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bgElevated,
  },
  input: {
    minWidth: 52,
    height: 32,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bgElevated,
    textAlign: 'center',
    color: colors.textPrimary,
    paddingHorizontal: spacing.xs,
  },
  saveBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 32,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
  },
  saveBtnDisabled: {
    opacity: 0.7,
  },
  readOnly: {
    marginTop: spacing.xs,
    textAlign: 'right',
    maxWidth: 140,
  },
});
