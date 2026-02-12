import { StyleSheet } from 'react-native';

export const Colors = {
  backgroundPrimary: '#fff',
  backgroundAccent: '#10b981',
  backgroundAccent2: '#f59e0b',
  backgroundAccent3: '#a855f7',
  backgroundAccent4: '#f43f5e',
  backgroundAccent5: '#06b6d4',
  backgroundLight: '#eff6ff',
  backgroundLight2: '#f0fdf4',
  backgroundLight3: '#fffbeb',
  backgroundLight4: '#faf5ff',
  backgroundLight5: '#fff1f2',
  backgroundLight6: '#defaff',
  backgroundSecondary: '#f3f4f6',
  buttonColor: '#3B82F6',
  buttonColor2: '#2563eb',
  borderColor: '#e5e7eb',
  primary: '#3B82F6',
  textPrimary: '#111827',
  textSecondary: '#fff',
  textTertiary: '#94A3B8',
  textForeground: 'rgb(17 24 39 / 0.6)',
  placeholder: 'rgba(17,24,39,0.35)',
};

export const TextSizes = {
  xsmall: {
    fontSize: 12,
    lineHeight: 16,
  },
  small: {
    fontSize: 14,
    lineHeight: 20,
  },
  medium: {
    fontSize: 16,
    lineHeight: 24,
  },
  large: {
    fontSize: 18,
    lineHeight: 28,
  },
  xlarge: {
    fontSize: 20,
    lineHeight: 28,
  },
  xxlarge: {
    fontSize: 24,
    lineHeight: 32,
  },
};

export const FontWeights = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

export const layout = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundPrimary,
    padding: 16,
    gap: 24,
  },
  block: {
    padding: 16,
    borderRadius: 12,
  },
  header1: {
    ...TextSizes.xxlarge,
    fontWeight: FontWeights.bold,
  },
  header2: {
    ...TextSizes.xlarge,
    fontWeight: FontWeights.bold,
  },
  header3: {
    ...TextSizes.xlarge,
    fontWeight: FontWeights.bold,
  },
  flatList: {
     display: 'flex',
    flexDirection: 'column',
    gap: 12,
  }
});
