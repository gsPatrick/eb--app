import React, { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import EBText from './Text';
import { colors, radius, spacing, typography } from '../../theme/variables';

export default function Input({
  label,
  error,
  style,
  inputStyle,
  variant = 'boxed',
  secureTextEntry,
  ...props
}) {
  const [visible, setVisible] = useState(false);
  const isPlain = variant === 'plain';
  const isPassword = Boolean(secureTextEntry);

  return (
    <View style={style}>
      {label ? (
        <EBText variant="caption" color="secondary" style={styles.label}>
          {label}
        </EBText>
      ) : null}

      <View
        style={[
          isPassword ? styles.fieldWrap : null,
          isPassword && (isPlain ? styles.fieldWrapPlain : styles.fieldWrapBoxed),
          isPassword && error && (isPlain ? styles.fieldWrapPlainError : styles.fieldWrapBoxedError),
        ]}
      >
        <TextInput
          placeholderTextColor={colors.textMuted}
          secureTextEntry={isPassword && !visible}
          style={[
            styles.input,
            isPlain ? styles.inputPlain : styles.inputBoxed,
            !isPassword && error && (isPlain ? styles.inputPlainError : styles.inputError),
            isPassword && styles.inputWithToggle,
            isPassword && isPlain && styles.inputPlainInner,
            isPassword && !isPlain && styles.inputBoxedInner,
            inputStyle,
          ]}
          {...props}
        />

        {isPassword ? (
          <Pressable
            onPress={() => setVisible((current) => !current)}
            style={styles.toggleBtn}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={visible ? 'Ocultar senha' : 'Mostrar senha'}
          >
            {visible ? (
              <EyeOff size={22} color={colors.textSecondary} strokeWidth={1.8} />
            ) : (
              <Eye size={22} color={colors.textSecondary} strokeWidth={1.8} />
            )}
          </Pressable>
        ) : null}
      </View>

      {error ? (
        <EBText variant="caption" color="error" style={styles.error}>
          {error}
        </EBText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: { marginBottom: spacing.sm, fontWeight: '600' },
  fieldWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fieldWrapBoxed: {
    backgroundColor: colors.bgElevated,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    minHeight: 52,
  },
  fieldWrapPlain: {
    borderBottomWidth: 1.5,
    borderBottomColor: colors.borderStrong,
    minHeight: 52,
  },
  fieldWrapBoxedError: { borderColor: colors.error },
  fieldWrapPlainError: { borderBottomColor: colors.error },
  input: {
    ...typography.body,
    fontSize: 18,
    color: colors.textPrimary,
    minHeight: 52,
    paddingVertical: spacing.md,
  },
  inputBoxed: {
    backgroundColor: colors.bgElevated,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
  },
  inputPlain: {
    backgroundColor: 'transparent',
    borderBottomWidth: 1.5,
    borderBottomColor: colors.borderStrong,
    paddingHorizontal: 0,
    paddingBottom: spacing.sm,
  },
  inputWithToggle: {
    flex: 1,
    borderWidth: 0,
    borderBottomWidth: 0,
    backgroundColor: 'transparent',
  },
  inputBoxedInner: {
    paddingRight: spacing.sm,
    paddingLeft: spacing.lg,
  },
  inputPlainInner: {
    paddingRight: spacing.sm,
    paddingLeft: 0,
    paddingBottom: spacing.sm,
  },
  inputError: { borderColor: colors.error },
  inputPlainError: { borderBottomColor: colors.error },
  toggleBtn: {
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: { marginTop: spacing.xs },
});
