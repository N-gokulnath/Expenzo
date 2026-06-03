import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Typography from './Typography';
import { COLORS, THEME, LIGHT_COLORS, DARK_COLORS } from '../theme/theme';
import { useTransactionStore } from '../store/useTransactionStore';
import { DEFAULT_CATEGORIES } from '../constants/categories';
import CategoryIcon from './CategoryIcon';

interface BudgetListItemProps {
  category: string;
  limit: number;
  spent: number;
  onPress?: () => void;
}

const CATEGORY_COLORS: { [key: string]: string } = {
  'Food': '#FF9500',
  'Transport': '#5856D6',
  'Utilities': '#32ADE6',
  'Housing': '#AF52DE',
  'Shopping': '#FF2D55',
  'Health': '#FF3B30',
  'Entertainment': '#34C759',
  'Income': '#00C853',
};

const BudgetListItem: React.FC<BudgetListItemProps> = ({ category, limit, spent, onPress }) => {
  const { theme } = useTransactionStore();
  const colors = theme === 'light' ? LIGHT_COLORS : DARK_COLORS;

  const safeLimit = limit || 0;
  const safeSpent = spent || 0;
  const percentage = safeLimit > 0 ? (safeSpent / safeLimit) * 100 : 0;
  const isOverBudget = safeSpent > safeLimit;
  
  // Color logic: Green < 80%, Amber 80-99%, Red >= 100%
  let barColor = colors.primary;
  if (percentage >= 100) {
    barColor = colors.secondary;
  } else if (percentage >= 80) {
    barColor = colors.warning;
  }

  const categoryData = DEFAULT_CATEGORIES.find(c => c.name === category);
  const logoColor = CATEGORY_COLORS[category] || COLORS.primary;

  return (
    <TouchableOpacity 
      style={[
        styles.container,
        { backgroundColor: colors.surface, borderColor: colors.border }
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.categoryInfo}>
          <View style={[styles.logoContainer, { backgroundColor: colors.surfaceLight }]}>
            <CategoryIcon 
              name={category} 
              iconName={categoryData?.icon} 
              size={22} 
              color={logoColor} 
            />
          </View>
          <Typography variant="h3" style={styles.categoryName}>{category}</Typography>
        </View>
        <View style={styles.amountInfo}>
          <Typography variant="body" bold color={isOverBudget ? colors.secondary : colors.textPrimary}>
            ₹{safeSpent.toLocaleString()}
          </Typography>
          <Typography variant="label" color={colors.textMuted}>
            {' / ₹'}{safeLimit.toLocaleString()}
          </Typography>
        </View>
      </View>
      
      <View style={[styles.barContainer, { backgroundColor: colors.surfaceLight }]}>
        <View 
          style={[
            styles.bar, 
            { 
              width: `${Math.min(percentage, 100)}%`, 
              backgroundColor: barColor 
            }
          ]} 
        />
      </View>

      <View style={styles.footer}>
        <Typography variant="caption" color={colors.textSecondary}>
          {isOverBudget ? 'Over by ' : 'Remaining: '}
          <Typography variant="caption" bold color={isOverBudget ? colors.secondary : colors.primary}>
             ₹{Math.abs(safeLimit - safeSpent).toLocaleString()}
          </Typography>
        </Typography>
        <Typography variant="caption" color={colors.textSecondary}>{Math.round(percentage)}% used</Typography>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: THEME.spacing.md,
    borderRadius: 20,
    marginBottom: THEME.spacing.md,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.md,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryName: {
    fontSize: 16,
  },
  amountInfo: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  barContainer: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: THEME.spacing.xs,
  },
  bar: {
    height: '100%',
    borderRadius: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  }
});

export default BudgetListItem;
