import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Modal, ActivityIndicator } from 'react-native';
import { ChevronLeft, FileText, Download, CheckCircle2 } from 'lucide-react-native';
import * as LucideIcons from 'lucide-react-native';
import Typography from '../components/Typography';
import { THEME, COLORS, DARK_COLORS, LIGHT_COLORS } from '../theme/theme';
import { useTransactionStore } from '../store/useTransactionStore';
import DateRangeSelector from '../components/DateRangeSelector';
import AdvancedDonutChart from '../components/AdvancedDonutChart';
import AnalyticsHistogram from '../components/AnalyticsHistogram';
import { getCategoryTheme } from '../utils/categoryTheme';
import CategoryIcon from '../components/CategoryIcon';

const AnalyticsScreen = ({ onBack }: { onBack: () => void }) => {
  const { theme, getFilteredTransactions, getCategoryBreakdown, getTrendData } = useTransactionStore();
  const colors = theme === 'light' ? LIGHT_COLORS : DARK_COLORS;

  const [rangeType, setRangeType] = useState<'all' | 'month' | 'year' | 'custom'>('month');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [customRange, setCustomRange] = useState<{ start: Date, end: Date } | undefined>(undefined);
  const [activeType, setActiveType] = useState<'income' | 'expense'>('expense');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isListCollapsed, setIsListCollapsed] = useState(false);

  const handleDownloadReport = () => {
    setIsGenerating(true);
    setGenerationProgress(0);
    
    // Simulate data gathering based on filter
    const filterText = rangeType === 'all' ? 'All Time' : 
                      rangeType === 'month' ? `monthly (${selectedDate.toLocaleString('default', { month: 'short', year: 'numeric' })})` :
                      rangeType === 'year' ? `Yearly (${selectedDate.getFullYear()})` :
                      'Custom Range';

    const interval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsGenerating(false);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
          }, 500);
          return 100;
        }
        return prev + 5;
      });
    }, 80);
  };

  // Memoized analytics data
  const filteredTransactions = useMemo(() => 
    getFilteredTransactions(rangeType, selectedDate, customRange),
    [rangeType, selectedDate, customRange, getFilteredTransactions]
  );

  const typeSpecificTxs = useMemo(() => 
    filteredTransactions.filter(t => t.type === activeType),
    [filteredTransactions, activeType]
  );

  const breakdownData = useMemo(() => 
    getCategoryBreakdown(typeSpecificTxs),
    [typeSpecificTxs, getCategoryBreakdown]
  );

  const totalAmount = useMemo(() => 
    typeSpecificTxs.reduce((sum, t) => sum + t.amount, 0),
    [typeSpecificTxs]
  );

  const trendData = useMemo(() => 
    getTrendData(rangeType, selectedDate, customRange),
    [rangeType, selectedDate, customRange, getTrendData]
  );

  const maxTrendValue = useMemo(() => {
    const vals = trendData.flatMap(d => [d.income, d.expense]);
    return Math.max(...vals, 1000);
  }, [trendData]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={[styles.backButton, { backgroundColor: colors.surface }]}>
          <ChevronLeft size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Typography variant="h2" bold style={{ color: colors.textPrimary }}>Analytics</Typography>
        <View style={{ width: 40 }} /> 
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.typeToggle}>
           <TouchableOpacity 
             onPress={() => setActiveType('income')}
             style={[
               styles.toggleBtn, 
               { borderBottomColor: activeType === 'income' ? COLORS.primary : 'transparent' }
             ]}
           >
              <Typography variant="body" bold style={{ color: activeType === 'income' ? colors.textPrimary : colors.textSecondary }}>Income (Credit)</Typography>
           </TouchableOpacity>
           <TouchableOpacity 
             onPress={() => setActiveType('expense')}
             style={[
               styles.toggleBtn, 
               { borderBottomColor: activeType === 'expense' ? COLORS.secondary : 'transparent' }
             ]}
           >
              <Typography variant="body" bold style={{ color: activeType === 'expense' ? colors.textPrimary : colors.textSecondary }}>Expense (Debit)</Typography>
           </TouchableOpacity>
        </View>

        <DateRangeSelector 
          rangeType={rangeType}
          setRangeType={setRangeType}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          customRange={customRange}
          setCustomRange={setCustomRange}
        />

        <AdvancedDonutChart 
          data={breakdownData}
          total={totalAmount}
          type={activeType}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Breakdown List placed immediately after Donut Chart */}
        <View style={styles.collapsibleSection}>
          <TouchableOpacity 
            style={styles.collapseHeader} 
            onPress={() => setIsListCollapsed(!isListCollapsed)}
            activeOpacity={0.7}
          >
            <Typography variant="caption" bold style={{ color: colors.textSecondary }}>
              {isListCollapsed ? 'EXPAND BREAKDOWN' : 'COLLAPSE BREAKDOWN'}
            </Typography>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Typography variant="tiny" color={colors.textMuted}>{isListCollapsed ? 'Show Details' : 'Hide Details'}</Typography>
              {isListCollapsed ? (
                 <LucideIcons.ChevronDown size={14} color={colors.textSecondary} />
              ) : (
                 <LucideIcons.ChevronUp size={14} color={colors.textSecondary} />
              )}
            </View>
          </TouchableOpacity>
          
          {!isListCollapsed && (
            <View style={styles.listWrapper}>
              {breakdownData.map((item, index) => {
                const { color } = getCategoryTheme(item.label, colors);
                
                return (
                  <TouchableOpacity 
                    key={index} 
                    style={[
                      styles.listItem,
                    ]}
                    onPress={() => setSelectedCategory(selectedCategory === item.label ? null : item.label)}
                  >
                    <View style={styles.itemLeft}>
                      <View style={styles.iconBox}>
                         <CategoryIcon 
                           name={item.label} 
                           size={20} 
                           color={selectedCategory === item.label ? color : colors.textPrimary} 
                         />
                      </View>
                      <Typography 
                        variant="caption" 
                        bold 
                        style={{ 
                          color: selectedCategory === item.label ? color : colors.textPrimary, 
                          marginLeft: 10 
                        }}
                      >
                        {item.label}
                      </Typography>
                    </View>
                    
                    <View style={styles.itemRight}>
                      <View style={[styles.colorDot, { backgroundColor: color }]} />
                      <Typography variant="caption" style={{ color: colors.textSecondary, width: 45, textAlign: 'right' }}>
                        {item.value.toFixed(1)}%
                      </Typography>
                      <Typography variant="caption" bold style={{ color: colors.textPrimary, width: 75, textAlign: 'right' }}>
                        ₹{item.amount.toLocaleString('en-IN')}
                      </Typography>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>

        <AnalyticsHistogram 
          data={trendData}
          maxValue={maxTrendValue}
        />

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Action Button (FAB) */}
      <TouchableOpacity 
        style={[styles.fab, { backgroundColor: COLORS.primary }]}
        onPress={handleDownloadReport}
        activeOpacity={0.8}
      >
        <LucideIcons.FileText size={18} color="#000" strokeWidth={2} />
      </TouchableOpacity>

      {/* Progress Modal */}
      <Modal transparent visible={isGenerating} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Typography variant="h3" bold style={styles.modalTitle}>Generating Report...</Typography>
            <Typography variant="caption" style={{ color: colors.textSecondary, marginBottom: 20 }}>
               Exporting {rangeType === 'all' ? 'All Time' : 
                          rangeType === 'month' ? `${selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })}` :
                          rangeType === 'year' ? `${selectedDate.getFullYear()}` :
                          'Custom Range'} {activeType} data
            </Typography>
            <View style={[styles.progressBarBg, { backgroundColor: colors.surfaceLight }]}>
              <View style={[styles.progressBarFill, { width: `${generationProgress}%` }]} />
            </View>
            <Typography variant="caption" color={colors.textSecondary}>{generationProgress}% Complete</Typography>
          </View>
        </View>
      </Modal>

      {/* Success Notification */}
      {showSuccess && (
        <View style={[styles.successToast, { backgroundColor: colors.surface, borderColor: colors.success }]}>
          <CheckCircle2 color={colors.success} size={20} />
          <Typography variant="body" bold style={{ marginLeft: 8 }}>Report ready for export!</Typography>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: THEME.spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  typeToggle: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
    marginHorizontal: THEME.spacing.lg,
    marginBottom: THEME.spacing.md,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: THEME.spacing.md,
    alignItems: 'center',
    borderBottomWidth: 3,
  },
  collapsibleSection: {
    paddingHorizontal: THEME.spacing.lg,
    marginBottom: THEME.spacing.lg,
  },
  collapseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: THEME.spacing.md,
  },
  listWrapper: {
    marginTop: THEME.spacing.sm,
  },
  listSubtitle: {
    color: '#8B9B91',
    textAlign: 'center',
    marginBottom: THEME.spacing.lg,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: THEME.spacing.sm, // More compact
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.03)',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing.md,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 100, // Positioned near navigation but clear of it
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    padding: THEME.spacing.xl,
    borderRadius: THEME.borderRadius.xl,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalTitle: {
    marginTop: THEME.spacing.lg,
    marginBottom: THEME.spacing.md,
  },
  progressBarBg: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    marginBottom: THEME.spacing.sm,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },
  successToast: {
    position: 'absolute',
    bottom: 100,
    left: THEME.spacing.lg,
    right: THEME.spacing.lg,
    padding: THEME.spacing.md,
    borderRadius: THEME.borderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  }
});

export default AnalyticsScreen;
