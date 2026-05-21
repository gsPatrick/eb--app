import { useTranslation } from 'react-i18next';
import { useLocale } from '../context/I18nProvider';
import { formatCurrency, formatDate, formatTime, getOrderStatusVariant } from '../utils/formatters';

export function useFormatters() {
  const { t } = useTranslation();
  const { intlLocale } = useLocale();

  return {
    formatCurrency: (value) => formatCurrency(value, intlLocale),
    formatDate: (value) => formatDate(value, intlLocale),
    formatTime,
    getOrderStatusLabel: (status) => t(`status.order.${status}`, { defaultValue: status }),
    getOrderStatusVariant,
  };
}
