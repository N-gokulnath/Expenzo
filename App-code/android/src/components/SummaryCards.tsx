import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react-native';
import Card from './Card';
import Typography from './Typography';
import { COLORS, THEME, DARK_COLORS, LIGHT_COLORS } from '../theme/theme';
import { useTransactionStore } from '../store/useTransactionStore';
import { formatCurrency } from '../utils/formatters';

const SummaryCards = () => {
  const { getTotalIncome, getTotalExpenses, getMoMChange, theme } = useTransactionStore();
  const colors = theme === 'light' ? LIGHT_COLORS : DARK_COLORS;
  
  const incomeChange = getMoMChange('income');
  const expenseChange = getMoMChange('expense');

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <View style={styles.header}>
          <ArrowDownCircle size={16} color={colors.success} />
          <Typography variant="caption" style={[styles.label, { color: colors.textSecondary }]}>INCOME</Typography>
        </View>
        <Typography variant="h2" style={[styles.amount, { color: colors.textPrimary }]}>{formatCurrency(getTotalIncome())}</Typography>
        <Typography variant="caption" style={[styles.change, incomeChange >= 0 ? styles.positive : styles.negative]}>
          {incomeChange >= 0 ? '+' : ''}{incomeChange.toFixed(0)}% from last month
        </Typography>
      </Card>

      <Card style={styles.card}>
        <View style={styles.header}>
          <ArrowUpCircle size={16} color={colors.error} />
          <Typography variant="caption" style={[styles.label, { color: colors.textSecondary }]}>EXPENSES</Typography>
        </View>
        <Typography variant="h2" style={[styles.amount, { color: colors.textPrimary }]}>{formatCurrency(getTotalExpenses())}</Typography>
        <Typography variant="caption" style={[styles.change, expenseChange <= 0 ? styles.positive : styles.negative]}>
          {expenseChange >= 0 ? '+' : ''}{expenseChange.toFixed(0)}% from last month
        </Typography>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: THEME.spacing.lg,
    gap: THEME.spacing.md,
    marginTop: THEME.spacing.md,
  },
  card: {
    flex: 1,
    padding: THEME.spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing.xs,
    marginBottom: THEME.spacing.xs,
  },
  label: {
    color: '#D1FAE5', // Light green for Emerald mode
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  amount: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
    color: '#FFFFFF',
  },
  change: {
    fontSize: 11,
    fontWeight: '600',
  },
  positive: {
    color: COLORS.success,
  },
  negative: {
    color: COLORS.error,
  },
});

export default SummaryCards;
