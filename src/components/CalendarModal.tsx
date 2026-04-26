import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  ScrollView,
  Dimensions
} from 'react-native';
import { ChevronLeft, ChevronRight, X, Edit2 } from 'lucide-react-native';
import { THEME, DARK_COLORS, LIGHT_COLORS } from '../theme/theme';
import Typography from './Typography';
import { useTransactionStore } from '../store/useTransactionStore';

const YEARS_TO_SHOW = 10;

interface CalendarModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSelectDate: (date: Date) => void;
  selectedDate: Date;
}

const { width } = Dimensions.get('window');

export const CalendarModal = ({ isVisible, onClose, onSelectDate, selectedDate }: CalendarModalProps) => {
  const { theme } = useTransactionStore();
  const colors = theme === 'light' ? LIGHT_COLORS : DARK_COLORS;
  const [viewDate, setViewDate] = useState(new Date(selectedDate));
  const [isYearPickerVisible, setIsYearPickerVisible] = useState(false);

  const daysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const firstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const renderDays = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const totalDays = daysInMonth(year, month);
    const startDay = firstDayOfMonth(year, month);
    const days = [];

    // Empty spaces for previous month
    for (let i = 0; i < startDay; i++) {
      days.push(<View key={`empty-${i}`} style={styles.dayBox} />);
    }

    // Actual days
    for (let d = 1; d <= totalDays; d++) {
      const isSelected = selectedDate.getDate() === d && 
                         selectedDate.getMonth() === month && 
                         selectedDate.getFullYear() === year;
      
      const isToday = new Date().getDate() === d &&
                      new Date().getMonth() === month &&
                      new Date().getFullYear() === year;

      days.push(
        <TouchableOpacity 
          key={d} 
          style={[
            styles.dayBox, 
            isSelected && styles.selectedDay,
            !isSelected && isToday && [styles.todayMarker, { borderColor: colors.primary }]
          ]}
          onPress={() => {
            const newDate = new Date(year, month, d);
            onSelectDate(newDate);
            onClose();
          }}
        >
          <Typography 
            variant="body" 
            style={[
              styles.dayText, 
              { color: colors.textPrimary },
              isSelected && styles.selectedDayText,
              isToday && !isSelected && { color: colors.primary }
            ]}
          >
            {d}
          </Typography>
        </TouchableOpacity>
      );
    }

    return days;
  };

  const changeMonth = (offset: number) => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1));
  };

  const changeYear = (year: number) => {
    setViewDate(new Date(year, viewDate.getMonth(), 1));
    setIsYearPickerVisible(false);
  };

  const currentYear = viewDate.getFullYear();
  const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.modalContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <Typography variant="h3" color={colors.textPrimary}>Select Date</Typography>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.monthSelector}>
            <TouchableOpacity onPress={() => changeMonth(-1)} style={[styles.navButton, { backgroundColor: colors.primary + '20' }]}>
              <ChevronLeft size={24} color={colors.primary} />
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => setIsYearPickerVisible(true)} style={styles.monthTitle}>
              <View style={styles.monthTitleContent}>
                <Typography variant="h3" color={colors.textPrimary}>
                  {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
                </Typography>
                <Edit2 size={16} color={colors.textPrimary} style={{ marginLeft: 6, opacity: 0.8 }} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => changeMonth(1)} style={[styles.navButton, { backgroundColor: colors.primary + '20' }]}>
              <ChevronRight size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.weekDaysRow}>
            {weekDays.map(day => (
              <View key={day} style={styles.dayBox}>
                <Typography variant="caption" style={[styles.weekDayText, { color: colors.textMuted }]}>{day}</Typography>
              </View>
            ))}
          </View>

          <View style={styles.daysGrid}>
            {renderDays()}
          </View>

          <View style={styles.footer}>
            <TouchableOpacity 
              style={[styles.todayButton, { borderColor: colors.primary }]} 
              onPress={() => {
                onSelectDate(new Date());
                onClose();
              }}
            >
              <Typography variant="body" bold style={{ color: colors.primary }}>Go to Today</Typography>
            </TouchableOpacity>
          </View>
        </View>

        <Modal
          visible={isYearPickerVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setIsYearPickerVisible(false)}
        >
          <View style={styles.overlay}>
            <View style={[styles.yearPickerContainer, { backgroundColor: colors.surface }]}>
              <View style={styles.header}>
                <Typography variant="h3" color={colors.textPrimary}>Select Year</Typography>
                <TouchableOpacity onPress={() => setIsYearPickerVisible(false)}>
                  <X size={24} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>
              <ScrollView contentContainerStyle={styles.yearGrid}>
                {years.map(y => (
                  <TouchableOpacity 
                    key={y} 
                    style={[
                      styles.yearBox, 
                      y === viewDate.getFullYear() && { backgroundColor: colors.primary }
                    ]}
                    onPress={() => changeYear(y)}
                  >
                    <Typography 
                      variant="body" 
                      bold={y === viewDate.getFullYear()}
                      color={y === viewDate.getFullYear() ? '#000' : colors.textPrimary}
                    >
                      {y}
                    </Typography>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: THEME.spacing.lg,
  },
  modalContainer: {
    width: '100%',
    borderRadius: THEME.borderRadius.xxl,
    padding: THEME.spacing.xl,
    borderWidth: 1,
  },
  yearPickerContainer: {
    width: '80%',
    maxHeight: '60%',
    borderRadius: THEME.borderRadius.xl,
    padding: THEME.spacing.xl,
  },
  yearGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingVertical: THEME.spacing.md,
  },
  yearBox: {
    width: '30%',
    paddingVertical: THEME.spacing.md,
    margin: '1.5%',
    alignItems: 'center',
    borderRadius: THEME.borderRadius.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.xl,
  },
  closeButton: {
    padding: 4,
  },
  monthSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.lg,
  },
  monthTitle: {
    flex: 1,
  },
  monthTitleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 200, 83, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  weekDaysRow: {
    flexDirection: 'row',
    marginBottom: THEME.spacing.sm,
  },
  weekDayText: {
    fontWeight: '700',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayBox: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: THEME.borderRadius.sm,
  },
  dayText: {
    fontWeight: '500',
  },
  selectedDay: {
    backgroundColor: THEME.colors.primary,
  },
  selectedDayText: {
    color: '#000000',
    fontWeight: '700',
  },
  todayMarker: {
    borderWidth: 1,
  },
  footer: {
    marginTop: THEME.spacing.xl,
    alignItems: 'center',
  },
  todayButton: {
    paddingVertical: THEME.spacing.sm,
    paddingHorizontal: THEME.spacing.lg,
    borderRadius: THEME.borderRadius.round,
    borderWidth: 1,
  }
});
