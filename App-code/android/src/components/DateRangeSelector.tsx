import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react-native';
import Typography from './Typography';
import { THEME, COLORS, DARK_COLORS, LIGHT_COLORS } from '../theme/theme';
import { useTransactionStore } from '../store/useTransactionStore';

type RangeType = 'all' | 'month' | 'year' | 'custom';

interface DateRangeSelectorProps {
  rangeType: RangeType;
  setRangeType: (type: RangeType) => void;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  customRange?: { start: Date, end: Date };
  setCustomRange?: (range: { start: Date, end: Date } | undefined) => void;
}

const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({
  rangeType,
  setRangeType,
  selectedDate,
  setSelectedDate,
  customRange,
  setCustomRange,
}) => {
  const { theme } = useTransactionStore();
  const colors = theme === 'light' ? LIGHT_COLORS : DARK_COLORS;
  
  const [showPicker, setShowPicker] = useState(false);
  const [calendarViewDate, setCalendarViewDate] = useState(new Date());

  const handlePrev = () => {
    const newDate = new Date(selectedDate);
    if (rangeType === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (rangeType === 'year') {
      newDate.setFullYear(newDate.getFullYear() - 1);
    }
    setSelectedDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(selectedDate);
    if (rangeType === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (rangeType === 'year') {
      newDate.setFullYear(newDate.getFullYear() + 1);
    }
    setSelectedDate(newDate);
  };

  const formatDisplayDate = () => {
    if (rangeType === 'all') return 'All Time';
    if (rangeType === 'custom' && customRange) {
      const startStr = customRange.start.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      const endStr = customRange.end.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
      return `${startStr} - ${endStr}`;
    }
    if (rangeType === 'year') return selectedDate.getFullYear().toString();
    return selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  const ranges: { label: string; value: RangeType }[] = [
    { label: 'All time', value: 'all' },
    { label: 'Monthly', value: 'month' },
    { label: 'Yearly', value: 'year' },
  ];

  // Calendar Helpers
  const daysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const handleDatePress = (day: number) => {
    const clickedDate = new Date(calendarViewDate.getFullYear(), calendarViewDate.getMonth(), day);
    
    if (!customRange || (customRange.start && customRange.end)) {
      // Start new selection
      if (setCustomRange) setCustomRange({ start: clickedDate, end: clickedDate });
    } else {
      // Complete range
      if (clickedDate < customRange.start) {
        if (setCustomRange) setCustomRange({ start: clickedDate, end: customRange.start });
      } else {
        if (setCustomRange) setCustomRange({ ...customRange, end: clickedDate });
      }
      setRangeType('custom');
    }
  };

  const isSelected = (day: number) => {
    if (!customRange) return false;
    const d = new Date(calendarViewDate.getFullYear(), calendarViewDate.getMonth(), day).getTime();
    const start = customRange.start.getTime();
    const end = customRange.end.getTime();
    return d >= start && d <= end;
  };

  const renderCalendar = () => {
    const totalDays = daysInMonth(calendarViewDate);
    const startDay = firstDayOfMonth(calendarViewDate);
    const days = [];

    // Empty spaces for previous month
    for (let i = 0; i < startDay; i++) {
      days.push(<View key={`empty-${i}`} style={styles.dayCell} />);
    }

    // Days of current month
    for (let d = 1; d <= totalDays; d++) {
      const dateObj = new Date(calendarViewDate.getFullYear(), calendarViewDate.getMonth(), d);
      const dateTime = dateObj.getTime();
      
      const isStart = customRange?.start && dateTime === customRange.start.getTime();
      const isEnd = customRange?.end && dateTime === customRange.end.getTime();
      const inRange = customRange && dateTime >= customRange.start.getTime() && dateTime <= customRange.end.getTime();

      days.push(
        <TouchableOpacity 
          key={d} 
          style={[
            styles.dayCell, 
            inRange && { backgroundColor: `${COLORS.primary}15` },
            isStart && { backgroundColor: COLORS.primary, borderTopLeftRadius: 10, borderBottomLeftRadius: 10 },
            isEnd && { backgroundColor: COLORS.primary, borderTopRightRadius: 10, borderBottomRightRadius: 10 }
          ]}
          onPress={() => handleDatePress(d)}
          activeOpacity={0.7}
        >
          <Typography 
            variant="caption" 
            bold 
            style={{ color: (isStart || isEnd) ? '#fff' : inRange ? COLORS.primary : colors.textPrimary }}
          >
            {d}
          </Typography>
        </TouchableOpacity>
      );
    }
    return days;
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.tabContainer}>
          {ranges.map((r) => (
            <TouchableOpacity
              key={r.value}
              onPress={() => {
                setRangeType(r.value);
                if (r.value !== 'custom' && setCustomRange) setCustomRange(undefined);
              }}
              style={[
                styles.tab,
                { backgroundColor: rangeType === r.value ? colors.surfaceLight : 'transparent' },
                rangeType === r.value && styles.activeTab
              ]}
            >
              <Typography
                variant="caption"
                style={{
                  color: rangeType === r.value ? colors.textPrimary : colors.textSecondary,
                  fontWeight: rangeType === r.value ? '700' : '400'
                }}
              >
                {r.label}
              </Typography>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
              onPress={() => {
                setRangeType('custom');
                if (!customRange) setShowPicker(true);
              }}
              style={[
                styles.tab,
                { backgroundColor: rangeType === 'custom' ? colors.surfaceLight : 'transparent' },
                rangeType === 'custom' && styles.activeTab
              ]}
            >
              <Typography
                variant="caption"
                style={{
                  color: rangeType === 'custom' ? colors.textPrimary : colors.textSecondary,
                  fontWeight: rangeType === 'custom' ? '700' : '400'
                }}
              >
                Custom
              </Typography>
            </TouchableOpacity>
        </View>
      </View>

      {rangeType !== 'all' && (
        <TouchableOpacity 
          onPress={() => setShowPicker(true)}
          style={styles.selectorContainer}
          activeOpacity={0.7}
        >
          <View style={[styles.dateDisplay, { backgroundColor: colors.surface }]}>
             <Typography variant="body" bold style={{ color: colors.textPrimary }}>
               {formatDisplayDate()}
             </Typography>
          </View>
        </TouchableOpacity>
      )}

      {/* Dedicated Calendar Modal */}
      <Modal transparent visible={showPicker} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.background, borderTopColor: colors.border, borderTopWidth: 1 }]}>
            <View style={styles.calendarHeader}>
              <TouchableOpacity onPress={() => {
                const d = new Date(calendarViewDate);
                d.setMonth(d.getMonth() - 1);
                setCalendarViewDate(d);
              }}>
                <ChevronLeft color={colors.textPrimary} />
              </TouchableOpacity>
              <Typography variant="h3" bold>
                {calendarViewDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </Typography>
              <TouchableOpacity onPress={() => {
                const d = new Date(calendarViewDate);
                d.setMonth(d.getMonth() + 1);
                setCalendarViewDate(d);
              }}>
                <ChevronRight color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <View style={styles.calendarPills}>
               <View style={[styles.datePill, { backgroundColor: colors.surface }]}>
                  <Typography variant="tiny" style={{ opacity: 0.6 }}>START DATE</Typography>
                  <Typography variant="caption" bold>{customRange?.start?.toLocaleDateString() || '--/--/--'}</Typography>
               </View>
               <View style={styles.pillArrow}>
                  <ChevronRight size={16} color={colors.textSecondary} />
               </View>
               <View style={[styles.datePill, { backgroundColor: colors.surface }]}>
                  <Typography variant="tiny" style={{ opacity: 0.6 }}>END DATE</Typography>
                  <Typography variant="caption" bold>{customRange?.end?.toLocaleDateString() || '--/--/--'}</Typography>
               </View>
            </View>

            <View style={styles.weekHeader}>
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                <Typography key={i} variant="tiny" style={styles.weekDay}>{d}</Typography>
              ))}
            </View>

            <View style={styles.calendarGrid}>
              {renderCalendar()}
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={[styles.clearBtn, { borderColor: colors.border }]} 
                onPress={() => {
                  if (setCustomRange) setCustomRange(undefined);
                }}
              >
                <Typography variant="body" bold color={colors.error || '#FF5252'}>Clear</Typography>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.applyBtn, { backgroundColor: COLORS.primary }]} 
                onPress={() => setShowPicker(false)}
              >
                <Typography variant="body" bold color="#fff">Apply Selection</Typography>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: THEME.spacing.md,
    gap: THEME.spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing.sm,
  },
  tabContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: THEME.borderRadius.md,
    padding: 2,
  },
  calendarBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tab: {
    flex: 1,
    paddingVertical: THEME.spacing.sm,
    alignItems: 'center',
    borderRadius: THEME.borderRadius.sm,
  },
  activeTab: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  selectorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: THEME.spacing.sm,
  },
  arrowButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateDisplay: {
    flex: 1,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: THEME.borderRadius.sm,
    maxWidth: 220,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: THEME.spacing.xl,
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: THEME.spacing.xl,
  },
  calendarPills: {
    flexDirection: 'row',
    gap: THEME.spacing.md,
    marginBottom: THEME.spacing.xl,
  },
  datePill: {
    flex: 1,
    padding: THEME.spacing.sm,
    borderRadius: THEME.borderRadius.md,
    alignItems: 'center',
  },
  weekHeader: {
    flexDirection: 'row',
    marginBottom: THEME.spacing.sm,
  },
  weekDay: {
    flex: 1,
    textAlign: 'center',
    opacity: 0.5,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: THEME.spacing.xl,
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    gap: THEME.spacing.md,
  },
  clearBtn: {
    flex: 1,
    paddingVertical: THEME.spacing.md,
    borderRadius: THEME.borderRadius.lg,
    alignItems: 'center',
    borderWidth: 1,
  },
  pillArrow: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyBtn: {
    flex: 2,
    paddingVertical: THEME.spacing.md,
    borderRadius: THEME.borderRadius.lg,
    alignItems: 'center',
  }
});


export default DateRangeSelector;
