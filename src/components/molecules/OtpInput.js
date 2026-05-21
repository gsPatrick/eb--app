import React, { useRef } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import EBText from '../atoms/Text';
import { colors, radius, spacing, typography } from '../../theme/variables';

const OTP_LENGTH = 5;

export default function OtpInput({ value, onChange, error }) {
  const inputsRef = useRef([]);

  const digits = Array.from({ length: OTP_LENGTH }, (_, index) => value[index] || '');

  const updateValue = (nextDigits) => {
    onChange(nextDigits.join('').slice(0, OTP_LENGTH));
  };

  const handleChange = (text, index) => {
    const sanitized = text.replace(/\D/g, '');
    const nextDigits = [...digits];

    if (sanitized.length > 1) {
      sanitized.split('').forEach((char, offset) => {
        const target = index + offset;
        if (target < OTP_LENGTH) nextDigits[target] = char;
      });
      updateValue(nextDigits);
      const nextIndex = Math.min(index + sanitized.length, OTP_LENGTH - 1);
      inputsRef.current[nextIndex]?.focus();
      return;
    }

    nextDigits[index] = sanitized;
    updateValue(nextDigits);

    if (sanitized && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = ({ nativeEvent }, index) => {
    if (nativeEvent.key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <View>
      <View style={styles.row}>
        {digits.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => {
              inputsRef.current[index] = ref;
            }}
            value={digit}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={(event) => handleKeyPress(event, index)}
            keyboardType="number-pad"
            maxLength={OTP_LENGTH}
            autoFocus={index === 0}
            style={[styles.box, digit && styles.boxFilled, error && styles.boxError]}
            selectionColor={colors.primary}
            accessibilityLabel={`OTP digit ${index + 1}`}
          />
        ))}
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  box: {
    flex: 1,
    minHeight: 56,
    maxWidth: 56,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bgMuted,
    alignItems: 'center',
    justifyContent: 'center',
    ...typography.heading,
    fontSize: 24,
    color: colors.textPrimary,
    textAlign: 'center',
    paddingVertical: spacing.sm,
  },
  boxFilled: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  boxError: {
    borderColor: colors.error,
  },
  error: {
    marginTop: spacing.sm,
  },
});
