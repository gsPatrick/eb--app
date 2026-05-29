import React, { useCallback, useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Button from '../../components/atoms/Button';
import EBText from '../../components/atoms/Text';
import { useApi } from '../../hooks/useApi';
import { useRealtime } from '../../context/RealtimeContext';
import * as messagesApi from '../../api/messages';
import { colors, radius, spacing } from '../../theme/variables';

export default function ClientMessagesScreen() {
  const { t } = useTranslation();
  const [form, setForm] = useState({ subject: '', body: '' });
  const [sending, setSending] = useState(false);

  const fetchMessages = useCallback(
    () => messagesApi.list({ limit: 100 }).then((response) => response.items),
    []
  );
  const { data: messages = [], loading, refetch } = useApi(fetchMessages, []);
  const { subscribe } = useRealtime();

  React.useEffect(() => subscribe('messages', refetch), [subscribe, refetch]);

  const sorted = useMemo(
    () => [...messages].sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt))),
    [messages]
  );

  const handleSend = async () => {
    if (!form.subject.trim() || !form.body.trim()) return;
    setSending(true);
    try {
      await messagesApi.create(form);
      setForm({ subject: '', body: '' });
      await refetch();
      Alert.alert(t('client.messages.sent'), t('client.messages.sentMessage'));
    } catch (error) {
      Alert.alert(t('common.error'), error.message || t('common.error'));
    } finally {
      setSending(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container}>
        <EBText variant="title">{t('client.messages.title')}</EBText>
        <EBText variant="body" color="secondary">
          {t('client.messages.subtitle')}
        </EBText>

        <View style={styles.composeCard}>
          <TextInput
            style={styles.input}
            placeholder={t('client.messages.subject')}
            value={form.subject}
            onChangeText={(subject) => setForm((prev) => ({ ...prev, subject }))}
          />
          <TextInput
            style={[styles.input, styles.textarea]}
            placeholder={t('client.messages.body')}
            value={form.body}
            onChangeText={(body) => setForm((prev) => ({ ...prev, body }))}
            multiline
          />
          <Button loading={sending} onPress={handleSend}>
            {t('client.messages.sendToAdmin')}
          </Button>
        </View>

        {loading ? (
          <EBText variant="body" color="secondary">
            {t('common.loading')}
          </EBText>
        ) : (
          sorted.map((message) => (
            <View key={message.id} style={styles.messageCard}>
              <EBText variant="bodyMedium">{message.subject}</EBText>
              <EBText variant="body" color="secondary">
                {message.body}
              </EBText>
              <EBText variant="caption" color="secondary">
                {message.sender?.role === 'admin'
                  ? t('client.messages.fromAdmin')
                  : t('client.messages.fromYou')}
              </EBText>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.lg, gap: spacing.md },
  composeCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.sm,
    backgroundColor: colors.background,
  },
  textarea: { minHeight: 100, textAlignVertical: 'top' },
  messageCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.xs,
  },
});
