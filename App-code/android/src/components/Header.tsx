import React from 'react';
import { View, StyleSheet } from 'react-native';
import Typography from '../components/Typography';
import { COLORS, THEME } from '../theme/theme';
import { useTransactionStore } from '../store/useTransactionStore';

import { formatCurrency } from '../utils/formatters';

interface HeaderProps {
  balance: number;
  month: string;
}

const Header: React.FC<HeaderProps> = ({ balance, month }) => {
  const { theme } = useTransactionStore();
  const formattedBalance = formatCurrency(balance);

  return (
    <View style={[
      styles.container,
      theme === 'light' && {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      }
    ]}>
      <Typography variant="label" style={[styles.label, theme === 'light' && { color: '#64748B' }]}>Net Balance</Typography>
      <Typography variant="h1" style={[styles.balanceText, theme === 'light' && { color: '#0F172A' }]}>{formattedBalance}</Typography>
      <View style={styles.statusRow}>
        <Typography variant="caption" style={[styles.statusText, theme === 'light' && { color: '#94A3B8' }]}>{month} 2026</Typography>
        <Typography variant="caption" style={[styles.statusText, styles.separator, theme === 'light' && { color: '#94A3B8' }]}> • </Typography>
        <Typography variant="caption" style={[styles.statusText, theme === 'light' && { color: '#94A3B8' }]}>Updated just now</Typography>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: THEME.spacing.lg,
    marginTop: THEME.spacing.md,
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: THEME.spacing.md,
    backgroundColor: '#064E3B', // Dark Emerald / Forest Green
    borderRadius: 24,
    // Add subtle shadow for floating effect
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  label: {
    color: '#ECFDF5',
    fontWeight: '600',
    opacity: 0.9,
    fontSize: 12,
    letterSpacing: 0.5,
  },
  balanceText: {
    fontSize: 40,
    marginTop: THEME.spacing.xs,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  statusRow: {
    flexDirection: 'row',
    marginTop: THEME.spacing.sm,
    alignItems: 'center',
  },
  statusText: {
    color: '#A7F3D0',
    fontSize: 12,
    opacity: 0.8,
  },
  separator: {
    marginHorizontal: 4,
  }
});

export default Header;
