import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Moon, Sun, User, Plus, TrendingUp } from 'lucide-react-native';
import Typography from './Typography';
import { THEME, COLORS, LIGHT_COLORS, DARK_COLORS } from '../theme/theme';
import { useTransactionStore } from '../store/useTransactionStore';

interface BrandHeaderProps {
  onProfilePress?: () => void;
  onAnalyticsPress?: () => void;
  onAddPress?: () => void;
}

const BrandHeader: React.FC<BrandHeaderProps> = ({ onProfilePress, onAnalyticsPress, onAddPress }) => {
  const { theme, toggleTheme } = useTransactionStore();
  const colors = theme === 'light' ? LIGHT_COLORS : DARK_COLORS;

  return (
    <View style={styles.navHeader}>
      <Typography variant="h2" style={styles.brandText}>EXPENZO</Typography>
      <View style={styles.headerActions}>
        {onAddPress && (
          <TouchableOpacity onPress={onAddPress} style={styles.iconButton}>
            <Plus size={20} color={COLORS.primary} />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={toggleTheme} style={styles.iconButton}>
          {theme === 'dark' ? (
            <Moon size={20} color={COLORS.primary} />
          ) : (
            <Sun size={20} color={COLORS.secondary} />
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={onAnalyticsPress} style={styles.iconButton}>
          <TrendingUp size={20} color={COLORS.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={onProfilePress}>
          <User size={20} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: THEME.spacing.md,
    paddingHorizontal: THEME.spacing.lg,
  },
  brandText: {
    fontSize: 14,
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  headerActions: {
    flexDirection: 'row',
    gap: THEME.spacing.md,
  },
  iconButton: {
    padding: 4,
  }
});

export default BrandHeader;
