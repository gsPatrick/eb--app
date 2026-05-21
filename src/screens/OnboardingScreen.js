import React, { useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MapPin, Camera, ClipboardList } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import Button from '../components/atoms/Button';
import EBText from '../components/atoms/Text';
import { useAuth } from '../context/AuthContext';
import { colors, spacing } from '../theme/variables';

const { width } = Dimensions.get('window');

const SLIDE_META = [
  { id: '1', icon: MapPin, gradient: ['#082567', '#0B3A8C'], titleKey: 'onboarding.slide1Title', subtitleKey: 'onboarding.slide1Subtitle' },
  { id: '2', icon: Camera, gradient: ['#061D4D', '#082567'], titleKey: 'onboarding.slide2Title', subtitleKey: 'onboarding.slide2Subtitle' },
  { id: '3', icon: ClipboardList, gradient: ['#0B3A8C', '#54CC8B'], titleKey: 'onboarding.slide3Title', subtitleKey: 'onboarding.slide3Subtitle' },
];

export default function OnboardingScreen({ navigation }) {
  const { t } = useTranslation();
  const { completeOnboarding } = useAuth();
  const [index, setIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);

  const handleNext = async () => {
    if (index < SLIDE_META.length - 1) {
      flatListRef.current?.scrollToIndex({ index: index + 1 });
      return;
    }
    await completeOnboarding();
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <Animated.FlatList
        ref={flatListRef}
        data={SLIDE_META}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
          useNativeDriver: false,
        })}
        onMomentumScrollEnd={(e) => {
          setIndex(Math.round(e.nativeEvent.contentOffset.x / width));
        }}
        renderItem={({ item }) => {
          const Icon = item.icon;
          return (
            <LinearGradient colors={item.gradient} style={[styles.slide, { width }]}>
              <View style={styles.iconWrap}>
                <Icon size={40} color={colors.textInverse} strokeWidth={1.5} />
              </View>
              <EBText variant="display" color="inverse" style={styles.title}>
                {t(item.titleKey)}
              </EBText>
              <EBText variant="body" color="inverse" style={styles.subtitle}>
                {t(item.subtitleKey)}
              </EBText>
            </LinearGradient>
          );
        }}
      />

      <View style={styles.footer}>
        <View style={styles.dots}>
          {SLIDE_META.map((_, i) => (
            <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
          ))}
        </View>
        <Button fullWidth onPress={handleNext}>
          {index === SLIDE_META.length - 1 ? t('onboarding.start') : t('onboarding.next')}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  slide: {
    flex: 1,
    paddingHorizontal: spacing.xxxl,
    paddingTop: 120,
    paddingBottom: 160,
    justifyContent: 'center',
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xxxl,
  },
  title: { fontSize: 30, marginBottom: spacing.lg },
  subtitle: { opacity: 0.9, lineHeight: 24 },
  footer: {
    position: 'absolute',
    bottom: 48,
    left: spacing.xxl,
    right: spacing.xxl,
  },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: spacing.xl },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.borderStrong },
  dotActive: { width: 24, backgroundColor: colors.primary },
});
