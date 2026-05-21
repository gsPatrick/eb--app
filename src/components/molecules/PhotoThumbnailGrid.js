import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { X } from 'lucide-react-native';
import EBText from '../atoms/Text';
import { colors, radius, spacing } from '../../theme/variables';

export default function PhotoThumbnailGrid({ photos = [], label, onRemove }) {
  if (!photos.length) return null;

  return (
    <View style={styles.wrap}>
      {label ? (
        <EBText variant="caption" color="secondary" style={styles.label}>
          {label}
        </EBText>
      ) : null}
      <View style={styles.grid}>
        {photos.map((photo, index) => {
          const uri = typeof photo === 'string' ? photo : photo.uri;
          const key = uri || String(index);
          return (
            <View key={key} style={styles.thumbWrap}>
              <Image source={{ uri }} style={styles.thumb} />
              {onRemove ? (
                <Pressable style={styles.removeBtn} onPress={() => onRemove(index)} hitSlop={8}>
                  <X size={14} color={colors.textInverse} />
                </Pressable>
              ) : null}
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: spacing.lg },
  label: { marginBottom: spacing.sm },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  thumbWrap: { position: 'relative' },
  thumb: {
    width: 96,
    height: 96,
    borderRadius: radius.md,
    backgroundColor: colors.bgMuted,
  },
  removeBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
