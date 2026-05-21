import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import {
  Activity,
  Briefcase,
  ChevronLeft,
  MapPin,
  Navigation,
} from 'lucide-react-native';
import Badge from '../components/atoms/Badge';
import Button from '../components/atoms/Button';
import EBText from '../components/atoms/Text';
import ExecutionStepSkeleton from '../components/molecules/ExecutionStepSkeleton';
import ExtraServiceRow from '../components/molecules/ExtraServiceRow';
import PhotoThumbnailGrid from '../components/molecules/PhotoThumbnailGrid';
import GeofenceAlert from '../components/organisms/GeofenceAlert';
import { useApi } from '../hooks/useApi';
import { useCamera } from '../hooks/useCamera';
import { useFormatters } from '../hooks/useFormatters';
import { useLocation } from '../hooks/useLocation';
import * as ordersApi from '../api/orders';
import { isWithinGeofence } from '../utils/geofence';
import { isNetworkError } from '../utils/network';
import { enqueueOfflineAction } from '../utils/offlineQueue';
import { colors, radius, shadows, spacing } from '../theme/variables';

const TOTAL_STEPS = 4;

function SectionCard({ icon: Icon, title, children, style }) {
  return (
    <View style={[styles.sectionCard, style]}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionIconWrap}>
          <Icon size={18} color={colors.primary} />
        </View>
        <EBText variant="heading">{title}</EBText>
      </View>
      {children}
    </View>
  );
}

function InfoRow({ label, value, valueColor = 'primary' }) {
  return (
    <View style={styles.infoRow}>
      <EBText variant="caption" color="secondary">
        {label}
      </EBText>
      <EBText variant="body" color={valueColor} style={styles.infoValue}>
        {value}
      </EBText>
    </View>
  );
}

function StepProgress({ current, total }) {
  return (
    <View style={styles.progressTrack}>
      {Array.from({ length: total }, (_, index) => {
        const stepNumber = index + 1;
        const isDone = stepNumber < current;
        const isActive = stepNumber === current;
        return (
          <View
            key={stepNumber}
            style={[
              styles.progressSegment,
              isDone && styles.progressSegmentDone,
              isActive && styles.progressSegmentActive,
            ]}
          />
        );
      })}
    </View>
  );
}

function buildSelectedExtras(order) {
  return (order?.extras || []).reduce((acc, extra) => {
    const extraId = extra.extraId || extra.id;
    if (extraId) acc[extraId] = true;
    return acc;
  }, {});
}

export default function ExecutionScreen({ route, navigation }) {
  const { orderId } = route.params;
  const { t, i18n } = useTranslation();
  const { formatCurrency, formatDate, getOrderStatusLabel, getOrderStatusVariant } = useFormatters();
  const { getCurrentPosition, loading: gpsLoading } = useLocation();
  const { takePhoto, pickPhotos } = useCamera();

  const fetchOrder = useCallback(() => ordersApi.getById(orderId), [orderId]);
  const { data: order, loading, setData: setOrder } = useApi(fetchOrder, [orderId]);

  const fetchExtras = useCallback(async () => {
    const { items } = await ordersApi.listExtras();
    return items.filter((e) => e.active !== false);
  }, []);
  const { data: extrasCatalog } = useApi(fetchExtras, [], { initialData: [] });

  const [step, setStep] = useState(1);
  const [stepTransition, setStepTransition] = useState(false);
  const [checkinCoords, setCheckinCoords] = useState(null);
  const [beforePhotos, setBeforePhotos] = useState([]);
  const [afterPhotos, setAfterPhotos] = useState([]);
  const [selectedExtras, setSelectedExtras] = useState({});
  const [loadingExtras, setLoadingExtras] = useState({});
  const [submittingCheckIn, setSubmittingCheckIn] = useState(false);
  const [submittingCheckOut, setSubmittingCheckOut] = useState(false);
  const [geofenceDistance, setGeofenceDistance] = useState(null);
  const [showGeofence, setShowGeofence] = useState(false);

  const geofenceRadius = order?.geofenceRadiusM ?? 200;

  const translateError = useCallback(
    (err) => {
      const map = {
        LOCATION_DENIED: t('errors.locationDenied'),
        CAMERA_DENIED: t('errors.cameraDenied'),
        GALLERY_DENIED: t('errors.galleryDenied'),
        ORDER_NOT_FOUND: t('execution.notFound'),
      };
      return map[err.code] || err.message;
    },
    [t, i18n.language]
  );

  useEffect(() => {
    if (!order) return;
    setSelectedExtras(buildSelectedExtras(order));
    if (order.status === 'completed') setStep(4);
    else if (order.status === 'in_progress') setStep(3);
  }, [order?.id, order?.status]);

  const goToStep = useCallback((next) => {
    setStepTransition(true);
    setTimeout(() => {
      setStep(next);
      setStepTransition(false);
    }, 400);
  }, []);

  const validateGeofence = useCallback(
    (coords) => {
      if (order?.propertyLat == null || order?.propertyLong == null) {
        return { within: true, distance: 0 };
      }
      return isWithinGeofence(coords.lat, coords.lng, order.propertyLat, order.propertyLong, geofenceRadius);
    },
    [order?.propertyLat, order?.propertyLong, geofenceRadius]
  );

  const handleGeofenceApiError = useCallback(
    (err, coords) => {
      if (err.code === 'OUT_OF_PROXIMITY') {
        const distance =
          err.details?.distanceMeters ?? (coords ? validateGeofence(coords).distance : geofenceRadius + 1);
        setGeofenceDistance(distance);
        setShowGeofence(true);
        return true;
      }
      Alert.alert(t('common.error'), translateError(err));
      return false;
    },
    [geofenceRadius, t, validateGeofence]
  );

  const handleOfflineEnqueue = useCallback(
    async (type, payload) => {
      await enqueueOfflineAction({ type, orderId, payload });
      Alert.alert(t('execution.offlineSaved'), t('execution.offlineSavedMessage'));
    },
    [orderId, t]
  );

  const handleStartCleaning = async () => {
    try {
      const coords = await getCurrentPosition();
      const { within, distance } = validateGeofence(coords);
      if (!within) {
        setGeofenceDistance(distance);
        setShowGeofence(true);
        return;
      }
      setCheckinCoords(coords);
      setShowGeofence(false);
      goToStep(2);
    } catch (err) {
      Alert.alert(t('common.error'), translateError(err));
    }
  };

  const handleAddBeforePhoto = async (fromGallery = false) => {
    try {
      const result = fromGallery ? await pickPhotos() : [await takePhoto()].filter(Boolean);
      if (!result?.length) return;
      setBeforePhotos((prev) => [...prev, ...result]);
    } catch (err) {
      Alert.alert(t('common.error'), translateError(err));
    }
  };

  const handleSubmitCheckIn = async () => {
    if (beforePhotos.length < 1) {
      Alert.alert(t('common.error'), t('execution.photosRequired'));
      return;
    }
    if (!checkinCoords) return;

    setSubmittingCheckIn(true);
    try {
      const updated = await ordersApi.checkIn(orderId, {
        lat: checkinCoords.lat,
        long: checkinCoords.lng,
        photos: beforePhotos,
      });
      setOrder(updated);
      setSelectedExtras(buildSelectedExtras(updated));
      goToStep(3);
    } catch (err) {
      if (isNetworkError(err)) {
        await handleOfflineEnqueue('check_in', {
          lat: checkinCoords.lat,
          long: checkinCoords.lng,
          photos: beforePhotos,
        });
      } else {
        handleGeofenceApiError(err, checkinCoords);
      }
    } finally {
      setSubmittingCheckIn(false);
    }
  };

  const handleExtraToggle = async (extraId, checked) => {
    if (!checked) {
      setSelectedExtras((prev) => ({ ...prev, [extraId]: false }));
      return;
    }

    setSelectedExtras((prev) => ({ ...prev, [extraId]: true }));
    setLoadingExtras((prev) => ({ ...prev, [extraId]: true }));

    try {
      const updated = await ordersApi.addExtra(orderId, extraId);
      setOrder(updated);
      setSelectedExtras(buildSelectedExtras(updated));
    } catch (err) {
      setSelectedExtras((prev) => ({ ...prev, [extraId]: false }));
      if (isNetworkError(err)) {
        await handleOfflineEnqueue('add_extra', { extraId });
      } else {
        Alert.alert(t('common.error'), translateError(err));
      }
    } finally {
      setLoadingExtras((prev) => ({ ...prev, [extraId]: false }));
    }
  };

  const handleAddAfterPhoto = async (fromGallery = false) => {
    try {
      const result = fromGallery ? await pickPhotos() : [await takePhoto()].filter(Boolean);
      if (!result?.length) return;
      setAfterPhotos((prev) => [...prev, ...result]);
    } catch (err) {
      Alert.alert(t('common.error'), translateError(err));
    }
  };

  const handleCompleteService = async () => {
    if (afterPhotos.length < 1) {
      Alert.alert(t('common.error'), t('execution.afterPhotosRequired'));
      return;
    }

    try {
      const coords = await getCurrentPosition();
      const { within, distance } = validateGeofence(coords);
      if (!within) {
        setGeofenceDistance(distance);
        setShowGeofence(true);
        return;
      }

      setSubmittingCheckOut(true);
      try {
        await ordersApi.checkOut(orderId, {
          lat: coords.lat,
          long: coords.lng,
          photos: afterPhotos,
        });
        Alert.alert(t('common.success'), t('execution.checkOutSuccess'));
        navigation.goBack();
      } catch (err) {
        if (isNetworkError(err)) {
          await handleOfflineEnqueue('check_out', {
            lat: coords.lat,
            long: coords.lng,
            photos: afterPhotos,
          });
        } else {
          handleGeofenceApiError(err, coords);
        }
      } finally {
        setSubmittingCheckOut(false);
      }
    } catch (err) {
      Alert.alert(t('common.error'), translateError(err));
    }
  };

  const stepContent = useMemo(() => {
    if (step === 1) {
      return (
        <View style={styles.panel}>
          <EBText variant="heading">{t('execution.step1Title')}</EBText>
          <EBText variant="body" color="secondary" style={styles.hint}>
            {t('execution.step1Hint')}
          </EBText>
          <Button
            fullWidth
            loading={gpsLoading}
            onPress={handleStartCleaning}
            style={styles.actionBtn}
          >
            {t('execution.startCleaning')}
          </Button>
        </View>
      );
    }

    if (step === 2) {
      return (
        <View style={styles.panel}>
          <EBText variant="heading">{t('execution.step2Title')}</EBText>
          <EBText variant="body" color="secondary" style={styles.hint}>
            {t('execution.step2Hint')}
          </EBText>
          <View style={styles.photoActions}>
            <Button variant="secondary" onPress={() => handleAddBeforePhoto(false)} style={styles.photoBtn}>
              {t('execution.takePhoto')}
            </Button>
            <Button variant="ghost" onPress={() => handleAddBeforePhoto(true)} style={styles.photoBtn}>
              {t('execution.pickGallery')}
            </Button>
          </View>
          <PhotoThumbnailGrid
            photos={beforePhotos}
            label={t('common.before')}
            onRemove={(index) => setBeforePhotos((prev) => prev.filter((_, i) => i !== index))}
          />
          <Button
            fullWidth
            loading={submittingCheckIn}
            disabled={beforePhotos.length < 1}
            onPress={handleSubmitCheckIn}
            style={styles.actionBtn}
          >
            {t('execution.submitCheckIn')}
          </Button>
        </View>
      );
    }

    if (step === 3) {
      return (
        <View style={styles.panel}>
          <EBText variant="heading">{t('execution.step3Title')}</EBText>
          <EBText variant="body" color="secondary" style={styles.hint}>
            {t('execution.step3Hint')}
          </EBText>
          {(extrasCatalog || []).map((extra) => (
            <ExtraServiceRow
              key={extra.id}
              extra={extra}
              checked={Boolean(selectedExtras[extra.id])}
              loading={loadingExtras[extra.id]}
              formatCurrency={formatCurrency}
              onToggle={(value) => handleExtraToggle(extra.id, value)}
            />
          ))}
          <Button fullWidth onPress={() => goToStep(4)} style={styles.actionBtn}>
            {t('common.continue')}
          </Button>
        </View>
      );
    }

    return (
      <View style={styles.panel}>
        <EBText variant="heading">{t('execution.step4Title')}</EBText>
        <EBText variant="body" color="secondary" style={styles.hint}>
          {t('execution.step4Hint')}
        </EBText>
        <View style={styles.photoActions}>
          <Button variant="secondary" onPress={() => handleAddAfterPhoto(false)} style={styles.photoBtn}>
            {t('execution.takePhoto')}
          </Button>
          <Button variant="ghost" onPress={() => handleAddAfterPhoto(true)} style={styles.photoBtn}>
            {t('execution.pickGallery')}
          </Button>
        </View>
        <PhotoThumbnailGrid
          photos={[...(order?.afterPhotos || []), ...afterPhotos]}
          label={t('common.after')}
          onRemove={
            afterPhotos.length
              ? (index) => {
                  if (index >= (order?.afterPhotos?.length || 0)) {
                    const localIndex = index - (order?.afterPhotos?.length || 0);
                    setAfterPhotos((prev) => prev.filter((_, i) => i !== localIndex));
                  }
                }
              : undefined
          }
        />
        <Button
          fullWidth
          loading={submittingCheckOut || gpsLoading}
          disabled={afterPhotos.length < 1 && !(order?.afterPhotos?.length)}
          onPress={handleCompleteService}
          style={styles.actionBtn}
        >
          {t('execution.completeService')}
        </Button>
      </View>
    );
  }, [
    step,
    t,
    i18n.language,
    checkinCoords,
    gpsLoading,
    beforePhotos,
    afterPhotos,
    submittingCheckIn,
    submittingCheckOut,
    extrasCatalog,
    selectedExtras,
    loadingExtras,
    order,
    formatCurrency,
  ]);

  if (loading && !order) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.container}>
          <ExecutionStepSkeleton />
        </View>
      </SafeAreaView>
    );
  }

  if (!order) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.container}>
          <EBText variant="body">{t('execution.notFound')}</EBText>
          <Button variant="secondary" onPress={() => navigation.goBack()} style={styles.actionBtn}>
            {t('execution.backToSchedule')}
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <GeofenceAlert
        visible={showGeofence}
        distanceMeters={geofenceDistance}
        radiusMeters={geofenceRadius}
        onDismiss={() => setShowGeofence(false)}
      />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <LinearGradient colors={[colors.primary, '#061D4D']} style={styles.hero}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
            <View style={styles.backRow}>
              <ChevronLeft size={20} color={colors.textInverse} />
              <EBText variant="caption" color="inverse">
                {t('execution.backToSchedule')}
              </EBText>
            </View>
          </Pressable>
          <EBText variant="title" color="inverse" style={styles.heroTitle}>
            {order.property}
          </EBText>
        </LinearGradient>

        <View style={styles.sections}>
          <SectionCard icon={Activity} title={t('execution.sections.status')}>
            <View style={styles.statusRow}>
              <Badge variant={getOrderStatusVariant(order.status)}>
                {getOrderStatusLabel(order.status)}
              </Badge>
              <EBText variant="caption" color="brand">
                {t('execution.stepOf', { current: step, total: TOTAL_STEPS })}
              </EBText>
            </View>
            <StepProgress current={step} total={TOTAL_STEPS} />
          </SectionCard>

          <SectionCard icon={MapPin} title={t('execution.sections.location')}>
            <EBText variant="body" style={styles.addressText}>
              {order.propertyAddress}
            </EBText>
            <InfoRow label={t('execution.geofenceRadius')} value={`${geofenceRadius} m`} />
            <InfoRow
              label={t('execution.gpsValidation')}
              value={
                checkinCoords
                  ? t('execution.locationValidated')
                  : t('execution.gpsPending')
              }
              valueColor={checkinCoords ? 'brand' : 'secondary'}
            />
            {checkinCoords ? (
              <EBText variant="caption" color="secondary" style={styles.gpsCoords}>
                {t('execution.gpsCoords', {
                  lat: checkinCoords.lat.toFixed(5),
                  lng: checkinCoords.lng.toFixed(5),
                })}
              </EBText>
            ) : null}
            <Pressable
              onPress={() => openDirections(order.propertyAddress)}
              style={styles.mapBtn}
            >
              <MapPin size={16} color={colors.primary} />
              <EBText variant="caption" color="brand">
                {t('schedule.openMaps')}
              </EBText>
            </Pressable>
          </SectionCard>

          <SectionCard icon={Briefcase} title={t('execution.sections.service')}>
            <InfoRow label={t('common.client')} value={order.client || '—'} />
            <InfoRow
              label={t('execution.scheduledFor')}
              value={`${formatDate(order.scheduledDate)}${
                order.scheduledTime ? ` · ${order.scheduledTime}` : ''
              }`}
            />
            <InfoRow
              label={t('common.total')}
              value={formatCurrency(order.totalPrice)}
              valueColor="brand"
            />
          </SectionCard>

          <View style={styles.actionPanel}>
            <View style={styles.actionHeader}>
              <Navigation size={16} color={colors.primary} />
              <EBText variant="caption" color="brand">
                {t('execution.sections.action')}
              </EBText>
            </View>
            {stepTransition ? (
              <View style={styles.panel}>
                <ExecutionStepSkeleton compact />
              </View>
            ) : (
              stepContent
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { paddingBottom: 120 },
  hero: {
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    borderBottomLeftRadius: radius.xxl,
    borderBottomRightRadius: radius.xxl,
    ...shadows.glow,
  },
  backBtn: { alignSelf: 'flex-start', marginBottom: spacing.md, paddingHorizontal: 0 },
  backRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  heroTitle: { lineHeight: 32 },
  sections: {
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.lg,
    gap: spacing.lg,
  },
  sectionCard: {
    backgroundColor: colors.bgElevated,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  sectionIconWrap: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  progressTrack: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  progressSegment: {
    flex: 1,
    height: 6,
    borderRadius: radius.full,
    backgroundColor: colors.border,
  },
  progressSegmentDone: {
    backgroundColor: colors.accent,
  },
  progressSegmentActive: {
    backgroundColor: colors.primary,
  },
  addressText: {
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.md,
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  infoValue: {
    flex: 1,
    textAlign: 'right',
  },
  gpsCoords: {
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
  },
  mapBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    alignSelf: 'flex-start',
    marginTop: spacing.sm,
    paddingVertical: spacing.sm,
  },
  actionPanel: {
    backgroundColor: colors.bgElevated,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  actionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  panel: {
    paddingTop: spacing.xs,
  },
  hint: { marginTop: spacing.sm, marginBottom: spacing.lg, lineHeight: 22 },
  photoActions: { flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' },
  photoBtn: { flex: 1, minWidth: 120 },
  actionBtn: { marginTop: spacing.xl },
});
