import React from 'react';
import { StyleSheet, View } from 'react-native';
import Input from '../atoms/Input';
import { spacing } from '../../theme/variables';

export default function InputGroup({ fields }) {
  return (
    <View style={styles.group}>
      {fields.map((field) => (
        <Input key={field.key || field.label} {...field} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  group: { gap: spacing.lg },
});
