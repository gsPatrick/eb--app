import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { MapPin, Camera, ShieldCheck } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import Button from '../components/atoms/Button';
import EBText from '../components/atoms/Text';
import { useAuth } from '../context/AuthContext';
import { colors, radius, shadows, spacing } from '../theme/variables';

export default function PermissionsScreen({ navigation }) {
  const { t } = useTranslation();
  const { completePermissions, onboardingDone, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const permissions = [
    { icon: MapPin, titleKey: 'permissions.locationTitle', descKey: 'permissions.locationDesc' },
    { icon: Camera, titleKey: 'permissions.cameraTitle', descKey: 'permissions.cameraDesc' },
  ];

  const handleContinue = async () => {
    setLoading(true);
    setError('');
    try {
      const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();

      if (locationStatus !== 'granted' || cameraStatus !== 'granted') {
        setError(t('permissions.denied'));
        setLoading(false);
        return;
      }

      await completePermissions();

      if (isAuthenticated) {
        navigation.replace('Main');
        return;
      }

      navigation.replace(onboardingDone ? 'AuthChoice' : 'AuthIntro');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <View style={styles.iconHero}>
            <ShieldCheck size={32} color={colors.primary} />
          </View>
          <EBText variant="title" color="brand">
            {t('permissions.title')}
          </EBText>
          <EBText variant="body" color="secondary" style={styles.sub}>
            {t('permissions.subtitle')}
          </EBText>
        </View>

        {permissions.map((item) => {
          const Icon = item.icon;
          return (
            <View key={item.titleKey} style={styles.card}>
              <View style={styles.cardIcon}>
                <Icon size={22} color={colors.primary} />
              </View>
              <View style={styles.cardBody}>
                <EBText variant="heading">{t(item.titleKey)}</EBText>
                <EBText variant="caption" color="secondary" style={styles.cardDesc}>
                  {t(item.descKey)}
                </EBText>
              </View>
            </View>
          );
        })}

        {error ? (
          <View style={styles.errorBanner}>
            <EBText variant="caption" color="error">
              {error}
            </EBText>
          </View>
        ) : null}

        <Button fullWidth loading={loading} onPress={handleContinue} style={styles.btn}>
          {t('permissions.submit')}
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: spacing.xxl, paddingBottom: 48 },
  header: { marginBottom: spacing.xxxl },
  iconHero: {
    width: 64,
    height: 64,
    borderRadius: radius.lg,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  sub: { marginTop: spacing.sm, lineHeight: 22 },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.bgElevated,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.bgMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  cardBody: { flex: 1 },
  cardDesc: { marginTop: 4, lineHeight: 18 },
  errorBanner: {
    backgroundColor: colors.errorSoft,
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.lg,
  },
  btn: { marginTop: spacing.md },
});
