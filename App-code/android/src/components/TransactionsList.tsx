import React from 'react';
import { View, StyleSheet } from 'react-native';
import Typography from './Typography';
import TransactionItem from './TransactionItem';
import { THEME } from '../theme/theme';
import { useTransactionStore } from '../store/useTransactionStore';

interface TransactionsListProps {
  onPressTransaction?: (transaction: any) => void;
}

const TransactionsList: React.FC<TransactionsListProps> = ({ onPressTransaction }) => {
  const { transactions } = useTransactionStore();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    if (date.toDateString() === today.toDateString()) return 'Today';
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  return (
    <View style={styles.container}>
      <Typography variant="label" style={styles.title}>Recent Transactions</Typography>
      <View style={styles.list}>
        {transactions.slice(0, 5).map((item, index) => (
          <TransactionItem 
            key={item.id} 
            {...item} 
            date={formatDate(item.date)}
            iconName={item.iconName as any}
            type={item.type as any}
            onPress={() => onPressTransaction?.(item)}
            hideBorder={index === Math.min(transactions.length, 5) - 1}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: THEME.spacing.xl,
    paddingHorizontal: THEME.spacing.lg,
  },
  title: {
    marginBottom: THEME.spacing.md,
  },
  list: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: THEME.borderRadius.lg,
    paddingHorizontal: THEME.spacing.md,
    overflow: 'hidden', // Contain all transaction items
  }
});

export default TransactionsList;
