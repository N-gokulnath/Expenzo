import React, { useState, useMemo } from 'react';
import { 
  View, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  TextInput 
} from 'react-native';
import { Search, SlidersHorizontal, Trash2, Edit3 } from 'lucide-react-native';
import Typography from '../components/Typography';
import BrandHeader from '../components/BrandHeader';
import TransactionItem from '../components/TransactionItem';
import EditTransactionModal from '../components/EditTransactionModal';
import DateRangeSelector from '../components/DateRangeSelector';
import { useTransactionStore, Transaction } from '../store/useTransactionStore';
import { THEME, COLORS, LIGHT_COLORS, DARK_COLORS } from '../theme/theme';
import { formatDate, formatTime } from '../utils/formatters';

const TransactionsScreen = ({ onProfilePress, onAnalyticsPress }: { onProfilePress?: () => void, onAnalyticsPress?: () => void }) => {
  const { theme, getFilteredTransactions } = useTransactionStore();
  const colors = theme === 'light' ? LIGHT_COLORS : DARK_COLORS;
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
  
  // Date filtering state - default to current month
  const [rangeType, setRangeType] = useState<'all' | 'month' | 'year' | 'custom'>('month');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [customRange, setCustomRange] = useState<{ start: Date, end: Date } | undefined>(undefined);
  const [isSelectorVisible, setIsSelectorVisible] = useState(false);
  
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handlePressTransaction = (tx: Transaction) => {
    setSelectedTx(tx);
    setIsModalVisible(true);
  };

  // Filtering logic
  const filteredTransactions = useMemo(() => {
    const dateFiltered = getFilteredTransactions(rangeType, selectedDate, customRange);
    
    return dateFiltered
      .filter(t => {
        const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             t.category.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = filter === 'all' || t.type === filter;
        return matchesSearch && matchesType;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [getFilteredTransactions, rangeType, selectedDate, customRange, searchQuery, filter]);

  // Grouping by date for sections
  const sections = filteredTransactions.reduce((acc: any[], transaction) => {
    const date = formatDate(transaction.date);
    
    const existingSection = acc.find(section => section.title === date);
    if (existingSection) {
      existingSection.data.push(transaction);
    } else {
      acc.push({ title: date, data: [transaction] });
    }
    return acc;
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <BrandHeader onProfilePress={onProfilePress} onAnalyticsPress={onAnalyticsPress} />
      
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: colors.surfaceLight }]}>
          <Search size={18} color={colors.textMuted} />
          <TextInput 
            style={[styles.searchInput, { color: colors.textPrimary }]}
            placeholder="Search transactions..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity 
          style={[
            styles.filterButton, 
            { backgroundColor: isSelectorVisible ? colors.primary : colors.surfaceLight }
          ]}
          onPress={() => setIsSelectorVisible(!isSelectorVisible)}
        >
          <SlidersHorizontal size={18} color={isSelectorVisible ? '#000' : colors.textPrimary} />
        </TouchableOpacity>
      </View>
      
      {isSelectorVisible && (
        <View style={styles.dateSelectorSection}>
          <DateRangeSelector 
            rangeType={rangeType}
            setRangeType={setRangeType}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            customRange={customRange}
            setCustomRange={setCustomRange}
          />
        </View>
      )}

      <View style={styles.tabFilter}>
        <TouchableOpacity 
          onPress={() => setFilter('all')}
          style={[styles.tab, filter === 'all' && { borderBottomColor: colors.primary }]}
        >
          <Typography variant="label" style={{ color: filter === 'all' ? colors.primary : colors.textMuted }}>All</Typography>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => setFilter('income')}
          style={[styles.tab, filter === 'income' && { borderBottomColor: colors.primary }]}
        >
          <Typography variant="label" style={{ color: filter === 'income' ? colors.primary : colors.textMuted }}>Income</Typography>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => setFilter('expense')}
          style={[styles.tab, filter === 'expense' && { borderBottomColor: colors.primary }]}
        >
          <Typography variant="label" style={{ color: filter === 'expense' ? colors.primary : colors.textMuted }}>Expenses</Typography>
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1 }}>
        <FlatList 
          data={sections}
          keyExtractor={item => item.title}
          renderItem={({ item }) => (
            <View>
              <View style={styles.dateHeader}>
                <Typography variant="label" color={colors.textMuted}>{item.title}</Typography>
              </View>
{item.data.map((t: Transaction, index: number) => (
  <TransactionItem 
    key={t.id} 
    {...t} 
    date={formatTime(t.date)}
    onPress={() => handlePressTransaction(t)}
    hideBorder={index === item.data.length - 1}
  />
))}
            </View>
          )}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Typography variant="body" color={colors.textMuted}>No transactions found.</Typography>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      </View>

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
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: THEME.spacing.lg,
    gap: THEME.spacing.sm,
    marginBottom: THEME.spacing.md,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing.md,
    height: 48,
    borderRadius: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateSelectorSection: {
    paddingHorizontal: THEME.spacing.lg,
    marginBottom: THEME.spacing.md,
  },
  tabFilter: {
    flexDirection: 'row',
    paddingHorizontal: THEME.spacing.lg,
    marginBottom: THEME.spacing.md,
  },
  tab: {
    paddingVertical: 8,
    marginRight: 24,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  listContent: {
    paddingHorizontal: THEME.spacing.xl, // Increased for a safer boundary
    paddingBottom: 120,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
  },
  dateHeader: {
    paddingVertical: THEME.spacing.sm,
    marginTop: THEME.spacing.lg,
  },
  list: {
    borderRadius: THEME.borderRadius.lg,
    overflow: 'hidden',
  }
});

export default TransactionsScreen;
