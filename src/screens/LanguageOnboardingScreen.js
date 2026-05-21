import React, { useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/atoms/Button';
import EBText from '../components/atoms/Text';
import { useLocale } from '../context/I18nProvider';
import { LOCALE_FLAG_IMAGES, LOCALE_LABELS, LOCALES } from '../i18n/config';
import { colors, radius, shadows, spacing } from '../theme/variables';

const { width } = Dimensions.get('window');

const LOCALE_COPY = {
  pt: {
    title: 'Escolha seu idioma',
    subtitle: 'Deslize para ver as opções e confirme sua preferência',
    confirm: 'Confirmar idioma',
  },
  en: {
    title: 'Choose your language',
    subtitle: 'Swipe to browse options and confirm your preference',
    confirm: 'Confirm language',
  },
  es: {
    title: 'Elige tu idioma',
    subtitle: 'Desliza para ver las opciones y confirma tu preferencia',
    confirm: 'Confirmar idioma',
  },
  fr: {
    title: 'Choisissez votre langue',
    subtitle: 'Faites glisser pour parcourir les options et confirmer',
    confirm: 'Confirmer la langue',
  },
  de: {
    title: 'Wählen Sie Ihre Sprache',
    subtitle: 'Wischen Sie durch die Optionen und bestätigen Sie Ihre Wahl',
    confirm: 'Sprache bestätigen',
  },
};

export default function LanguageOnboardingScreen({ navigation }) {
  const { completeLocaleOnboarding } = useLocale();
  const [index, setIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  const activeLocale = LOCALES[index];
  const copy = LOCALE_COPY[activeLocale];

  const handleConfirm = async () => {
    await completeLocaleOnboarding(activeLocale);
    navigation.replace('Permissions');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.header}>
        <EBText variant="display" color="brand" style={styles.title}>
          {copy.title}
        </EBText>
        <EBText variant="body" color="secondary" style={styles.subtitle}>
          {copy.subtitle}
        </EBText>
      </View>

      <View style={styles.carouselArea}>
        <Animated.FlatList
          data={LOCALES}
          keyExtractor={(code) => code}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
            useNativeDriver: false,
          })}
          onMomentumScrollEnd={(event) => {
            setIndex(Math.round(event.nativeEvent.contentOffset.x / width));
          }}
          renderItem={({ item: code }) => {
            const meta = LOCALE_LABELS[code];
            return (
              <View style={[styles.slide, { width }]}>
                <View style={styles.flagFrame}>
                  <Image
                    source={LOCALE_FLAG_IMAGES[code]}
                    style={styles.flagImage}
                    resizeMode="cover"
                    accessibilityLabel={meta.name}
                  />
                </View>
                <EBText variant="title" color="brand" style={styles.langName}>
                  {meta.name}
                </EBText>
                <EBText variant="caption" color="muted" style={styles.langCode}>
                  {code.toUpperCase()}
                </EBText>
              </View>
            );
          }}
        />
      </View>

      <View style={styles.dotsSection}>
        <View style={styles.dots}>
          {LOCALES.map((code, i) => {
            const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [8, 28, 8],
              extrapolate: 'clamp',
            });
            const dotOpacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.35, 1, 0.35],
              extrapolate: 'clamp',
            });

            return (
              <Animated.View
                key={code}
                style={[styles.dot, { width: dotWidth, opacity: dotOpacity }]}
              />
            );
          })}
        </View>
      </View>

      <View style={styles.footer}>
        <Button fullWidth size="lg" onPress={handleConfirm} style={styles.confirmBtn}>
          {copy.confirm}
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bgElevated,
  },
  header: {
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.xxxl,
    paddingBottom: spacing.lg,
  },
  title: {
    fontSize: 32,
    lineHeight: 38,
    letterSpacing: -0.6,
  },
  subtitle: {
    marginTop: spacing.md,
    lineHeight: 24,
  },
  carouselArea: {
    flex: 1,
    justifyContent: 'center',
  },
  slide: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxxl,
  },
  flagFrame: {
    width: 220,
    height: 148,
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bgMuted,
    marginBottom: spacing.xxl,
    ...shadows.card,
  },
  flagImage: {
    width: '100%',
    height: '100%',
  },
  langName: {
    fontSize: 28,
    textAlign: 'center',
  },
  langCode: {
    marginTop: spacing.sm,
    letterSpacing: 2,
  },
  dotsSection: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
  },
  dot: {
    height: 8,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
  },
  footer: {
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    backgroundColor: colors.bgElevated,
  },
  confirmBtn: {
    borderRadius: 999,
    minHeight: 56,
  },
});
