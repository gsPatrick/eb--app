import React, { useCallback, useState } from 'react';
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, X } from 'lucide-react-native';
import Badge from '../components/atoms/Badge';
import EBText from '../components/atoms/Text';
import { useApi } from '../hooks/useApi';
import { useFormatters } from '../hooks/useFormatters';
import * as ordersApi from '../api/orders';
import { colors, radius, shadows, spacing } from '../theme/variables';

export default function HistoryDetailScreen({ route, navigation }) {
  const { orderId, order: initialOrder } = route.params;
  const { t } = useTranslation();
  const { formatCurrency, formatDate, getOrderStatusLabel, getOrderStatusVariant } = useFormatters();
  const [previewUri, setPreviewUri] = useState(null);

  const fetchOrder = useCallback(async () => {
    if (initialOrder) return initialOrder;
    return ordersApi.getById(orderId);
  }, [orderId, initialOrder]);

  const { data: order, loading } = useApi(fetchOrder, [orderId], { initialData: initialOrder });

  if (loading && !order) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.container}>
          <EBText variant="body" color="secondary">
            {t('common.loading')}
          </EBText>
        </View>
      </SafeAreaView>
    );
  }

  if (!order) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.container}>
          <EBText variant="body">{t('history.notFound')}</EBText>
        </View>
      </SafeAreaView>
    );
  }

  const allPhotos = [
    ...(order.beforePhotos || []).map((uri) => ({ uri, label: t('common.before') })),
    ...(order.afterPhotos || []).map((uri) => ({ uri, label: t('common.after') })),
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft size={20} color={colors.primary} />
          <EBText variant="caption" color="brand">
            {t('common.back')}
          </EBText>
        </Pressable>

        <View style={styles.card}>
          <View style={styles.header}>
            <EBText variant="title" color="brand">
              {order.property}
            </EBText>
            <Badge variant={getOrderStatusVariant(order.status)}>
              {getOrderStatusLabel(order.status)}
            </Badge>
          </View>
          <EBText variant="caption" color="secondary" style={styles.address}>
            {order.propertyAddress}
          </EBText>
          <View style={styles.metaRow}>
            <EBText variant="caption" color="secondary">
              {formatDate(order.finishedAt || order.scheduledDate)}
            </EBText>
            <EBText variant="heading" color="brand">
              {formatCurrency(order.totalPrice)}
            </EBText>
          </View>
        </View>

        {order.beforePhotos?.length ? (
          <View style={styles.section}>
            <EBText variant="heading" style={styles.sectionTitle}>
              {t('common.before')}
            </EBText>
            <View style={styles.grid}>
              {order.beforePhotos.map((uri) => (
                <Pressable key={uri} onPress={() => setPreviewUri(uri)}>
                  <Image source={{ uri }} style={styles.thumb} />
                </Pressable>
              ))}
            </View>
          </View>
        ) : null}

        {order.afterPhotos?.length ? (
          <View style={styles.section}>
            <EBText variant="heading" style={styles.sectionTitle}>
              {t('common.after')}
            </EBText>
            <View style={styles.grid}>
              {order.afterPhotos.map((uri) => (
                <Pressable key={uri} onPress={() => setPreviewUri(uri)}>
                  <Image source={{ uri }} style={styles.thumb} />
                </Pressable>
              ))}
            </View>
          </View>
        ) : null}

        {!allPhotos.length ? (
          <EBText variant="body" color="secondary" style={styles.noPhotos}>
            {t('history.noPhotos')}
          </EBText>
        ) : null}
      </ScrollView>

      <Modal visible={Boolean(previewUri)} transparent animationType="fade" onRequestClose={() => setPreviewUri(null)}>
        <Pressable style={styles.modalOverlay} onPress={() => setPreviewUri(null)}>
          <Pressable style={styles.closeBtn} onPress={() => setPreviewUri(null)}>
            <X size={22} color={colors.textInverse} />
          </Pressable>
          {previewUri ? <Image source={{ uri: previewUri }} style={styles.preview} resizeMode="contain" /> : null}
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { padding: spacing.xxl, paddingBottom: 120 },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: spacing.lg },
  card: {
    backgroundColor: colors.bgElevated,
    borderRadius: radius.xl,
    padding: spacing.xxl,
    marginBottom: spacing.xl,
    ...shadows.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: spacing.md },
  address: { marginTop: spacing.sm, lineHeight: 20 },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  section: { marginBottom: spacing.xl },
  sectionTitle: { marginBottom: spacing.md },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  thumb: {
    width: 104,
    height: 104,
    borderRadius: radius.md,
    backgroundColor: colors.bgMuted,
  },
  noPhotos: { textAlign: 'center', marginTop: spacing.xl },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(8, 37, 103, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxl,
  },
  preview: { width: '100%', height: '80%' },
  closeBtn: {
    position: 'absolute',
    top: 56,
    right: spacing.xxl,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
