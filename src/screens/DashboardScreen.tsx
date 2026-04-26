import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import BrandHeader from '../components/BrandHeader';
import Header from '../components/Header';
import SummaryCards from '../components/SummaryCards';
import SpendingBreakdown from '../components/SpendingBreakdown';
import WeeklySpending from '../components/WeeklySpending';
import TransactionsList from '../components/TransactionsList';
import AccountSummary from '../components/AccountSummary';
import { COLORS, THEME, LIGHT_COLORS, DARK_COLORS } from '../theme/theme';
import EditTransactionModal from '../components/EditTransactionModal';
import { useTransactionStore, Transaction } from '../store/useTransactionStore';
import { formatMonthYear } from '../utils/formatters';

const DashboardScreen = ({ onProfilePress, onAnalyticsPress }: { onProfilePress?: () => void, onAnalyticsPress?: () => void }) => {
  const { 
    getTotalBalance, 
    theme,
    transactions,
    showDashboardAnalytics
  } = useTransactionStore();
  
  const [selectedTx, setSelectedTx] = React.useState<Transaction | null>(null);
  const [isModalVisible, setIsModalVisible] = React.useState(false);

  const colors = theme === 'light' ? LIGHT_COLORS : DARK_COLORS;
  const currentMonth = formatMonthYear(new Date()).split(' ')[0];

  const handlePressTransaction = (tx: Transaction) => {
    setSelectedTx(tx);
    setIsModalVisible(true);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <BrandHeader onProfilePress={onProfilePress} onAnalyticsPress={onAnalyticsPress} />
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Header 
          balance={getTotalBalance()} 
          month={currentMonth} 
        />

        <SummaryCards />
        
        <AccountSummary />

        {showDashboardAnalytics && (
          <>
            <SpendingBreakdown />
            <WeeklySpending />
          </>
        )}

        <TransactionsList onPressTransaction={handlePressTransaction} />
        
        {/* Spacing for bottom nav */}
        <View style={{ height: 100 }} />
      </ScrollView>

      <EditTransactionModal 
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        transaction={selectedTx}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 20,
  },
});

export default DashboardScreen;
