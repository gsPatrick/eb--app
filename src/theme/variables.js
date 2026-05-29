/** EB Services — Design Tokens (Mobile) */
export const colors = {
  bg: '#FCFCFC',
  bgElevated: '#FFFFFF',
  bgMuted: '#F4F6FC',
  primary: '#082567',
  primaryHover: '#061D4D',
  primarySoft: 'rgba(8, 37, 103, 0.08)',
  accent: '#4F7CFF',
  accentSoft: 'rgba(79, 124, 255, 0.12)',
  accentLight: '#93C5FD',
  success: '#2563EB',
  error: '#E03131',
  errorSoft: 'rgba(224, 49, 49, 0.12)',
  warning: '#F59E0B',
  warningSoft: 'rgba(245, 158, 11, 0.12)',
  textPrimary: '#272830',
  textSecondary: '#5B5E6F',
  textMuted: 'rgba(39, 40, 48, 0.5)',
  textInverse: '#FCFCFC',
  border: 'rgba(39, 40, 48, 0.08)',
  borderStrong: 'rgba(39, 40, 48, 0.16)',
  skeletonBase: '#ECEEF4',
  skeletonHighlight: '#F8F9FC',
  overlay: 'rgba(8, 37, 103, 0.85)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  full: 9999,
};

export const typography = {
  display: { fontSize: 32, fontWeight: '700', letterSpacing: -0.5 },
  title: { fontSize: 24, fontWeight: '700', letterSpacing: -0.3 },
  heading: { fontSize: 18, fontWeight: '600' },
  body: { fontSize: 15, fontWeight: '400', lineHeight: 22 },
  bodyMedium: { fontSize: 15, fontWeight: '500' },
  caption: { fontSize: 13, fontWeight: '400', lineHeight: 18 },
  label: { fontSize: 12, fontWeight: '600', letterSpacing: 0.4, textTransform: 'uppercase' },
};

export const shadows = {
  card: {
    shadowColor: '#323247',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 4,
  },
  glow: {
    shadowColor: '#082567',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 8,
  },
};
