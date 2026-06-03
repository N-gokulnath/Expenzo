import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Svg, { Circle, G, Text as SvgText } from 'react-native-svg';
import Typography from './Typography';
import { THEME, COLORS, LIGHT_COLORS, DARK_COLORS } from '../theme/theme';
import { useTransactionStore } from '../store/useTransactionStore';
import * as LucideIcons from 'lucide-react-native';
import { getCategoryTheme } from '../utils/categoryTheme';
import CategoryIcon from './CategoryIcon';

interface AdvancedDonutChartProps {
  data: { label: string; value: number; amount: number }[];
  total: number;
  type: 'income' | 'expense';
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

const AdvancedDonutChart: React.FC<AdvancedDonutChartProps> = ({ 
  data, 
  total, 
  type,
  selectedCategory,
  onSelectCategory
}) => {
  const { theme } = useTransactionStore();
  const colors = theme === 'light' ? LIGHT_COLORS : DARK_COLORS;

  const radius = 40;
  const strokeWidth = 10;
  const activeStrokeWidth = 20;
  const circumference = 2 * Math.PI * radius;

  const formattedTotal = `₹${total.toLocaleString('en-IN')}`;
  const topCategories = [...data].sort((a, b) => b.value - a.value);

  // For pie chart segments
  let currentPos = 0;

  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
        <Svg width={220} height={220} viewBox="0 0 100 100">
          <G transform="rotate(-90 50 50)">
            {data.length === 0 ? (
              <Circle
                cx="50"
                cy="50"
                r={radius}
                stroke={colors.border}
                strokeWidth={strokeWidth}
                fill="transparent"
              />
            ) : (
              data.map((item, index) => {
                const strokeDashoffset = circumference - (item.value / 100) * circumference;
                const rotation = (currentPos / 100) * 360;
                currentPos += item.value;
                const { color } = getCategoryTheme(item.label, colors, type);
                const isSelected = selectedCategory === item.label;

                return (
                  <Circle
                    key={index}
                    cx="50"
                    cy="50"
                    r={radius}
                    stroke={color}
                    strokeWidth={isSelected ? activeStrokeWidth : strokeWidth}
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    transform={`rotate(${rotation} 50 50)`}
                    opacity={selectedCategory && !isSelected ? 0.3 : 1}
                    onPress={() => onSelectCategory(isSelected ? null : item.label)}
                  />
                );
              })
            )}
          </G>
          
          <G>
            <SvgText
              x="50"
              y="48"
              fill={colors.textPrimary}
              fontSize="8"
              fontWeight="bold"
              textAnchor="middle"
            >
              {formattedTotal}
            </SvgText>
            <SvgText
              x="50"
              y="58"
              fill={colors.textSecondary}
              fontSize="4"
              textAnchor="middle"
              letterSpacing="0.2"
            >
              {`Total ${type === 'income' ? 'Income' : 'Expense'}`}
            </SvgText>
          </G>
        </Svg>
      </View>

      {/* Categories Summary in Horizontal Row */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.rowContainer}
      >
        {topCategories.map((cat, idx) => {
          const isSelected = selectedCategory === cat.label;
          return (
            <TouchableOpacity 
              key={idx} 
              activeOpacity={0.7}
              onPress={() => onSelectCategory(isSelected ? null : cat.label)}
              style={[
                styles.pill, 
                { 
                  transform: [{ scale: isSelected ? 1.05 : 1 }],
                  backgroundColor: isSelected ? `${getCategoryTheme(cat.label, colors, type).color}15` : 'transparent',
                  borderRadius: 12,
                }
              ]}
            >
              <CategoryIcon 
                name={cat.label} 
                size={20} 
                color={isSelected ? (getCategoryTheme(cat.label, colors, type).color) : colors.textSecondary} 
              />
              <Typography variant="caption" bold style={{ color: isSelected ? colors.textPrimary : colors.textSecondary, marginLeft: 8 }}>
                {cat.label}
              </Typography>
              <Typography variant="tiny" style={{ marginLeft: 4, color: isSelected ? colors.textPrimary : colors.textMuted }}>
                {cat.value.toFixed(0)}%
              </Typography>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: THEME.spacing.md,
    alignItems: 'center',
  },
  chartContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: THEME.spacing.sm,
  },
  rowContainer: {
    paddingHorizontal: THEME.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing.sm,
    paddingBottom: THEME.spacing.sm,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
  }
});

export default AdvancedDonutChart;
