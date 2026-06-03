import React from 'react';
import { View, StyleSheet } from 'react-native';
import Typography from './Typography';
import { THEME, LIGHT_COLORS, DARK_COLORS } from '../theme/theme';

import { useTransactionStore } from '../store/useTransactionStore';

const WeeklySpending = () => {
  const { transactions, theme } = useTransactionStore();
  const colors = theme === 'light' ? LIGHT_COLORS : DARK_COLORS;

  const daysLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  
  // Get last 5 days for the UI (as per original design which showed 5)
  const last5Days = Array.from({ length: 5 }, (_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - (4 - i));
    return {
      day: daysLabels[d.getDay()],
      dateStr: d.toDateString(),
      value: 0
    };
  });

  // Aggregate expenses
  (transactions || []).forEach(t => {
    if (t.type === 'expense') {
      const tDate = new Date(t.date).toDateString();
      const dayObj = last5Days.find(d => d.dateStr === tDate);
      if (dayObj) {
        dayObj.value += t.amount;
      }
    }
  });

  const maxValue = Math.max(...last5Days.map(d => d.value), 1);
  const weekData = last5Days.map(d => ({
    ...d,
    percentage: (d.value / maxValue) * 100,
    color: d.value === maxValue && d.value > 0 ? colors.secondary : colors.primary
  }));

  return (
    <View style={styles.container}>
      <Typography variant="label" style={styles.title}>This Week</Typography>
      
      <View style={styles.chart}>
        {weekData.map((item, index) => (
          <View key={index} style={styles.row}>
            <View style={styles.info}>
              <Typography variant="caption" style={[styles.day, { color: colors.textSecondary }]}>{item.day}</Typography>
              <View style={[styles.barContainer, { backgroundColor: colors.border }]}>
                <View 
                  style={[
                    styles.bar, 
                    { width: `${item.percentage}%`, backgroundColor: item.color }
                  ]} 
                />
              </View>
              <Typography variant="caption" bold style={styles.value}>
                ₹{item.value.toLocaleString('en-IN')}
              </Typography>
            </View>
          </View>
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
  chart: {
    gap: THEME.spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing.md,
  },
  day: {
    width: 30,
  },
  barContainer: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: 4,
  },
  value: {
     width: 60,
     textAlign: 'right',
  }
});

export default WeeklySpending;
