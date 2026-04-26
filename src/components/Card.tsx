import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, THEME, DARK_COLORS, LIGHT_COLORS } from '../theme/theme';
import { useTransactionStore } from '../store/useTransactionStore';


interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'outline';
}

const Card: React.FC<CardProps> = ({ 
  children, 
  style,
  variant = 'default' 
}) => {
  const { theme } = useTransactionStore();
  const colors = theme === 'light' ? LIGHT_COLORS : DARK_COLORS;

  return (
    <View style={[
      styles.card, 
      { backgroundColor: colors.surface, borderColor: colors.border },
      styles[variant],
      style
    ]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.md,
  },
  default: {},
  elevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  outline: {
    borderWidth: 1,
  },
});

export default Card;
