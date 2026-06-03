import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Typography from './Typography';
import { THEME, DARK_COLORS, LIGHT_COLORS } from '../theme/theme';
import { useTransactionStore } from '../store/useTransactionStore';
import { formatCurrency } from '../utils/formatters';

interface BudgetOverviewProps {
  onPress?: () => void;
}

const BudgetOverview: React.FC<BudgetOverviewProps> = ({ onPress }) => {
  const { budgets, getMonthlyExpensesTotal, monthlyBudget, theme } = useTransactionStore();
  
  const totalSpent = getMonthlyExpensesTotal();
  const totalBudget = monthlyBudget;
  
  const percentage = totalBudget > 0 ? Math.min((totalSpent / totalBudget) * 100, 100) : 0;
  const remaining = totalBudget - totalSpent;

  return (
    <TouchableOpacity 
      activeOpacity={0.7}
      onPress={onPress}
      style={[
        styles.container,
        theme === 'light' && styles.containerLight
      ]}
    >
      <Typography variant="label" style={styles.label}>Monthly Budget</Typography>
      <View style={styles.row}>
        <Typography variant="h1" style={styles.amount}>{formatCurrency(totalSpent)}</Typography>
        <Typography variant="body" style={styles.totalAmount}> / {formatCurrency(totalBudget)}</Typography>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBarBackground}>
          <View 
            style={[
              styles.progressBarFill, 
              { width: `${percentage}%` }
            ]} 
          />
        </View>
      </View>

      <View style={styles.footer}>
        <Typography variant="caption" style={styles.footerText}>
          {remaining >= 0 ? `${formatCurrency(remaining)} left` : `${formatCurrency(Math.abs(remaining))} over`}
        </Typography>
        <Typography variant="caption" style={styles.footerText}>{Math.round(percentage)}%</Typography>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#064E3B', // Dark Emerald
    marginHorizontal: THEME.spacing.lg,
    marginTop: THEME.spacing.md,
    padding: THEME.spacing.lg,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  containerLight: {
    // Keep dark green for impact even in light mode, or slightly soften it?
    // User asked for "Monthly overview card (dark green)", so keeping it consistent.
    elevation: 2,
  },
  label: {
    color: '#ECFDF5',
    opacity: 0.8,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 4,
  },
  amount: {
    color: '#FFFFFF',
    fontSize: 32,
  },
  totalAmount: {
    color: '#A7F3D0',
    fontSize: 16,
    opacity: 0.7,
  },
  progressContainer: {
    marginTop: THEME.spacing.md,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#00C853', // Vibrant Emerald
    borderRadius: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: THEME.spacing.sm,
  },
  footerText: {
    color: '#A7F3D0',
    opacity: 0.9,
  }
});

export default BudgetOverview;
