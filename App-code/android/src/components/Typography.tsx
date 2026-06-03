import React from 'react';
import { Text, TextStyle, StyleSheet, StyleProp } from 'react-native';
import { COLORS, DARK_COLORS, LIGHT_COLORS } from '../theme/theme';
import { useTransactionStore } from '../store/useTransactionStore';

interface TypographyProps {
  children: React.ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'label' | 'tiny';
  color?: string;
  style?: StyleProp<TextStyle>;
  bold?: boolean;
}

const Typography: React.FC<TypographyProps & { numberOfLines?: number; ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip' }> = ({ 
  children, 
  variant = 'body', 
  color,
  style,
  bold = false,
  ...rest
}) => {
  const { theme } = useTransactionStore();
  const colors = theme === 'light' ? LIGHT_COLORS : DARK_COLORS;
  
  const finalColor = color || (variant === 'caption' ? colors.textSecondary : 
                             variant === 'label' ? colors.textMuted : 
                             variant === 'tiny' ? colors.textMuted :
                             colors.textPrimary);
  return (
    <Text 
      style={[
        styles[variant as keyof typeof styles], 
        { color: finalColor }, 
        bold && styles.bold,
        style
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  h1: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 24,
    fontWeight: '600',
  },
  h3: {
    fontSize: 18,
    fontWeight: '600',
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
  },
  caption: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: COLORS.textMuted,
  },
  tiny: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  bold: {
    fontWeight: 'bold',
  },
});


export default Typography;
