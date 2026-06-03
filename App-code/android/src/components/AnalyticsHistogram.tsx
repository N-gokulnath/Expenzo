import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Typography from './Typography';
import { THEME, COLORS, LIGHT_COLORS, DARK_COLORS } from '../theme/theme';
import { useTransactionStore } from '../store/useTransactionStore';

interface AnalyticsHistogramProps {
  data: { 
    label: string; 
    income: number; 
    expense: number;
    incomeCategories: { name: string, amount: number }[];
    expenseCategories: { name: string, amount: number }[];
  }[];
  maxValue: number;
}

const AnalyticsHistogram: React.FC<AnalyticsHistogramProps> = ({ data, maxValue }) => {
  const { theme } = useTransactionStore();
  const colors = theme === 'light' ? LIGHT_COLORS : DARK_COLORS;

  const safeMax = maxValue || 1000;
  
  // Professional color palette from screenshot
  const SALMON = '#FF7A6E';
  const EMERALD = '#00C853';

  return (
    <View style={styles.container}>
      {/* Scrollable Chart Area */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.chartContainer}>
          {/* Y-Axis Grid Lines */}
          <View style={styles.gridContainer}>
            {[100, 80, 60, 40, 20, 0].map((tick, i) => (
               <View key={i} style={styles.gridRow}>
                 <Typography variant="caption" style={[styles.gridLabel, { color: colors.textMuted }]}>
                   {tick === 100 ? `${Math.round(safeMax/1000)}K` : ''}
                   {tick === 0 ? '0' : ''}
                   {tick === 80 ? '800' : ''}
                   {tick === 60 ? '600' : ''}
                   {tick === 40 ? '400' : ''}
                   {tick === 20 ? '200' : ''}
                 </Typography>
                 <View style={[styles.gridLine, { borderBottomColor: colors.border }]} />
               </View>
            ))}
          </View>

          {/* Bars Area */}
          <View style={styles.barsArea}>
            {data.map((item, index) => {
              const incomeHeight = (item.income / safeMax) * 100;
              const expenseHeight = (item.expense / safeMax) * 100;

              return (
                <View key={index} style={styles.barColumn}>
                  <View style={styles.dualBarContainer}>
                    {/* Income Bar */}
                    <View 
                      style={[
                        styles.bar, 
                        { 
                          height: `${Math.min(incomeHeight, 100)}%`, 
                          backgroundColor: EMERALD,
                          borderTopLeftRadius: 4,
                          borderTopRightRadius: 4,
                        }
                      ]} 
                    />
                    {/* Expense Bar */}
                    <View 
                      style={[
                        styles.bar, 
                        { 
                          height: `${Math.min(expenseHeight, 100)}%`, 
                          backgroundColor: SALMON,
                          borderTopLeftRadius: 4,
                          borderTopRightRadius: 4,
                        }
                      ]} 
                    />
                  </View>
                  <Typography variant="caption" style={[styles.dayLabel, { color: colors.textMuted }]}>
                    {item.label}
                  </Typography>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Legend Block */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: EMERALD }]} />
          <Typography variant="caption" style={{ color: colors.textSecondary }}>Income (Credit)</Typography>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: SALMON }]} />
          <Typography variant="caption" style={{ color: colors.textSecondary }}>Expense (Debit)</Typography>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: THEME.spacing.lg,
  },
  scrollContent: {
    paddingBottom: THEME.spacing.md,
  },
  chartContainer: {
    height: 220,
    minWidth: 500,
    position: 'relative',
  },
  gridContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    paddingBottom: 25, // Space for labels
  },
  gridRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 38,
  },
  gridLabel: {
    width: 30,
    fontSize: 10,
    textAlign: 'right',
    marginRight: 8,
  },
  gridLine: {
    flex: 1,
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    opacity: 0.2,
  },
  barsArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingLeft: 40, // Space for Y-axis labels
    paddingRight: 20,
    height: 195,
    zIndex: 2,
  },
  barColumn: {
    alignItems: 'center',
    width: 30,
  },
  dualBarContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: '100%',
    width: '100%',
    gap: 4,
  },
  bar: {
    flex: 1,
    minHeight: 2,
  },
  dayLabel: {
    fontSize: 9,
    marginTop: 8,
    width: 40,
    textAlign: 'center',
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing.lg,
    marginTop: THEME.spacing.lg,
    paddingLeft: THEME.spacing.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing.xs,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  }
});

export default AnalyticsHistogram;
