import React, { useCallback } from 'react';
import { Alert, FlatList, Linking, Pressable, RefreshControl, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, FileText } from 'lucide-react-native';
import Button from '../../components/atoms/Button';
import EBText from '../../components/atoms/Text';
import { useApi } from '../../hooks/useApi';
import { useFormatters } from '../../hooks/useFormatters';
import * as contractsApi from '../../api/contracts';
import { API_ORIGIN } from '../../api/api-client';
import { colors, radius, shadows, spacing } from '../../theme/variables';

export default function ClientContractsScreen({ navigation }) {
  const { t } = useTranslation();
  const { formatDate } = useFormatters();

  const fetchContracts = useCallback(() => contractsApi.listWithAcceptanceStatus(), []);
  const { data: contracts, loading, refetch } = useApi(fetchContracts, [], { initialData: [] });

  const handleAccept = async (contract) => {
    try {
      await contractsApi.accept(contract.id);
      Alert.alert(t('client.contracts.acceptSuccessTitle'), t('client.contracts.acceptSuccessMessage'));
      refetch();
    } catch (err) {
      Alert.alert(t('common.error'), err.message || t('client.contracts.acceptFailed'));
    }
  };

  const openPdf = async (contract) => {
    if (!contract.pdfUrl) {
      Alert.alert(t('common.error'), t('client.contracts.noPdf'));
      return;
    }
    const url = contract.pdfUrl.startsWith('http')
      ? contract.pdfUrl
      : `${API_ORIGIN}${contract.pdfUrl.startsWith('/') ? contract.pdfUrl : `/${contract.pdfUrl}`}`;
    await Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <FlatList
        data={contracts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} tintColor={colors.primary} />}
        ListHeaderComponent={
          <View style={styles.header}>
            <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
              <ChevronLeft size={20} color={colors.primary} />
              <EBText variant="caption" color="brand">
                {t('common.back')}
              </EBText>
            </Pressable>
            <EBText variant="title" color="brand">
              {t('client.contracts.title')}
            </EBText>
            <EBText variant="caption" color="secondary" style={styles.sub}>
              {t('client.contracts.subtitle')}
            </EBText>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <EBText variant="heading" color="secondary">
              {t('client.contracts.emptyTitle')}
            </EBText>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.iconWrap}>
                <FileText size={20} color={colors.primary} />
              </View>
              <View style={styles.flex}>
                <EBText variant="heading">{item.title}</EBText>
                <EBText variant="caption" color="secondary">
                  {t('client.contracts.version', { version: item.version })}
                </EBText>
              </View>
            </View>
            <EBText variant="caption" color={item.status === 'accepted' ? 'brand' : 'secondary'}>
              {item.status === 'accepted'
                ? t('client.contracts.acceptedAt', { date: formatDate(item.signedAt) })
                : t('client.contracts.pending')}
            </EBText>
            <View style={styles.actions}>
              <Button variant="secondary" onPress={() => openPdf(item)} style={styles.actionBtn}>
                {t('client.contracts.viewPdf')}
              </Button>
              {item.status !== 'accepted' ? (
                <Button onPress={() => handleAccept(item)} style={styles.actionBtn}>
                  {t('client.contracts.accept')}
                </Button>
              ) : null}
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { padding: spacing.xxl, paddingBottom: 48 },
  header: { marginBottom: spacing.lg },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: spacing.lg },
  sub: { marginTop: spacing.xs },
  card: {
    backgroundColor: colors.bgElevated,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  cardHeader: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flex: { flex: 1 },
  actions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg },
  actionBtn: { flex: 1 },
  empty: { alignItems: 'center', paddingVertical: 48 },
});
