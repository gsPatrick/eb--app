import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { ChevronLeft } from 'lucide-react-native';
import EBText from '../components/atoms/Text';
import LanguageSelector from '../components/molecules/LanguageSelector';
import { colors, radius, shadows, spacing } from '../theme/variables';

export default function SettingsScreen({ navigation }) {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <View style={styles.backRow}>
            <ChevronLeft size={20} color={colors.primary} />
            <EBText variant="caption" color="brand">
              {t('common.back')}
            </EBText>
          </View>
        </Pressable>

        <EBText variant="title" color="brand">
          {t('settings.title')}
        </EBText>
        <EBText variant="body" color="secondary" style={styles.sub}>
          {t('settings.subtitle')}
        </EBText>

        <View style={styles.card}>
          <LanguageSelector />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { padding: spacing.xxl, paddingBottom: 120 },
  backBtn: { alignSelf: 'flex-start', marginBottom: spacing.lg, paddingHorizontal: 0 },
  backRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  sub: { marginTop: spacing.sm, marginBottom: spacing.xxl },
  card: {
    backgroundColor: colors.bgElevated,
    borderRadius: radius.xl,
    padding: spacing.xxl,
    ...shadows.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
