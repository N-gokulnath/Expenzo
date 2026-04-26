import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, G, Text as SvgText } from 'react-native-svg';
import Typography from './Typography';
import { THEME, LIGHT_COLORS, DARK_COLORS } from '../theme/theme';

import { useTransactionStore } from '../store/useTransactionStore';

const SpendingBreakdown = () => {
  const { transactions, getTotalExpenses, theme } = useTransactionStore();
  const colors = theme === 'light' ? LIGHT_COLORS : DARK_COLORS;
  const radius = 40;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;

  // Filter for current week expenses
  const today = new Date();
  const firstDayOfWeek = new Date(today);
  firstDayOfWeek.setDate(today.getDate() - today.getDay()); // Sunday
  firstDayOfWeek.setHours(0, 0, 0, 0);

  const expenses = (transactions || []).filter(t => {
    const txDate = new Date(t.date);
    return t.type === 'expense' && txDate >= firstDayOfWeek;
  });

  const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
  const safeTotal = totalExpenses || 1; 

  const breakdown = expenses.reduce((acc: any, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {});

  const data = Object.entries(breakdown).map(([label, value]: any) => {
    const iconKey = label.toLowerCase();
    const color = (colors.chart as any)[iconKey] || colors.chart.other;
    return {
      label,
      value: (value / safeTotal) * 100,
      amount: value,
      color,
    };
  }).sort((a, b) => b.value - a.value);

  // If no data, show empty state or just a placeholder item
  const hasData = totalExpenses > 0;
  const displayData = hasData ? data : [];

  let accumulatedPercentage = 0;

  const formattedTotal = totalExpenses > 1000 
    ? `₹${(totalExpenses / 1000).toFixed(1)}k`
    : `₹${totalExpenses}`;

  return (
    <View style={styles.container}>
      <Typography variant="label" style={styles.title}>Spending Breakdown</Typography>
      
      <View style={styles.content}>
        <View style={styles.chartContainer}>
          <Svg width={120} height={120} viewBox="0 0 100 100">
            <G transform="rotate(-90 50 50)">
              {!hasData ? (
                <Circle
                  cx="50"
                  cy="50"
                  r={radius}
                  stroke={colors.border}
                  strokeWidth={strokeWidth}
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={0}
                />
              ) : (
                displayData.map((item, index) => {
                  const strokeDashoffset = circumference - (item.value / 100) * circumference;
                  const rotation = (accumulatedPercentage / 100) * 360;
                  accumulatedPercentage += item.value;

                  return (
                    <Circle
                      key={index}
                      cx="50"
                      cy="50"
                      r={radius}
                      stroke={item.color}
                      strokeWidth={strokeWidth}
                      fill="transparent"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      transform={`rotate(${rotation} 50 50)`}
                    />
                  );
                })
              )}
            </G>
            <SvgText
                x="50"
                y="48"
                fill={colors.textPrimary}
                fontSize="10"
                fontWeight="bold"
                textAnchor="middle"
              >
                {formattedTotal}
              </SvgText>
              <SvgText
                x="50"
                y="60"
                fill={colors.textSecondary}
                fontSize="6"
                textAnchor="middle"
              >
                spent
              </SvgText>
          </Svg>
        </View>

        <View style={styles.legend}>
          {hasData ? (
            displayData.map((item, index) => (
              <View key={index} style={styles.legendItem}>
                <View style={styles.legendRow}>
                  <View style={[styles.dot, { backgroundColor: item.color }]} />
                  <Typography variant="caption" style={styles.label}>{item.label}</Typography>
                </View>
                <Typography variant="caption" bold>{Math.round(item.value)}%</Typography>
              </View>
            ))
          ) : (
            <View style={styles.legendItem}>
              <View style={styles.legendRow}>
                <View style={[styles.dot, { backgroundColor: colors.border }]} />
                <Typography variant="caption" style={[styles.label, { color: colors.textSecondary }]}>No expenses logged</Typography>
              </View>
              <Typography variant="caption" bold>0%</Typography>
            </View>
          )}
        </View>
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
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing.xl,
  },
  chartContainer: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  legend: {
    flex: 1,
    gap: THEME.spacing.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  label: {
     // Dynamic color set inline
  }
});

export default SpendingBreakdown;
