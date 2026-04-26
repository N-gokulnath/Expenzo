import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Typography from './Typography';
import CategoryIcon from './CategoryIcon';
import { THEME, LIGHT_COLORS, DARK_COLORS } from '../theme/theme';
import { useTransactionStore } from '../store/useTransactionStore';
import { formatCurrency } from '../utils/formatters';

interface TransactionItemProps {
  id: string;
  title: string;
  category: string;
  date: string;
  amount: number;
  type: 'income' | 'expense';
  iconName: string;
  accountId?: string;
  isCustomCategory?: boolean;
  onPress?: () => void;
  hideBorder?: boolean;
}

const TransactionItem: React.FC<TransactionItemProps> = ({
  title,
  category,
  date,
  amount,
  type,
  iconName,
  accountId,
  onPress,
  hideBorder,
  isCustomCategory,
}) => {
  const { theme } = useTransactionStore();
  const colors = theme === 'light' ? LIGHT_COLORS : DARK_COLORS;
  
  const isIncome = type === 'income';
  const formattedAmount = `${isIncome ? '+' : '-'}${formatCurrency(amount)}`;

  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        { borderBottomColor: colors.border },
        hideBorder && { borderBottomWidth: 0 }
      ]} 
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      <View style={styles.left}>
        <View style={[styles.iconContainer, { backgroundColor: colors.surfaceLight }]}>
          <CategoryIcon 
            name={category} 
            iconName={iconName} 
            size={20} 
            color={colors.textPrimary} 
          />
        </View>
        <View style={styles.textContainer}>
          <Typography variant="body" bold numberOfLines={1}>{title}</Typography>
          <Typography variant="caption" color={colors.textSecondary} numberOfLines={1}>
            {category} • {date}
          </Typography>
        </View>
      </View>
      <Typography 
        variant="body" 
        bold 
        color={isIncome ? colors.primary : colors.secondary}
        style={styles.amount}
      >
        {formattedAmount}
      </Typography>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: THEME.spacing.sm,
    // Unified padding: handled by parent wrapper (TransactionsList list view)
    paddingHorizontal: 0, 
    borderBottomWidth: 1,
  },
  left: {
    flex: 1, // Take full space so textContainer can flex
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing.md,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: THEME.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    marginRight: THEME.spacing.sm, // Buffer between text and amount
  },
  amount: {
    marginLeft: 'auto',
    textAlign: 'right',
  },
});

export default TransactionItem;
