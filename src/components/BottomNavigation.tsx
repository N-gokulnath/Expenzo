import React from 'react';
import { View, StyleSheet, TouchableOpacity, TextStyle } from 'react-native';
import { LayoutDashboard, Wallet, ArrowLeftRight, Trophy, Settings } from 'lucide-react-native';
import Typography from './Typography';
import { COLORS, THEME, DARK_COLORS, LIGHT_COLORS } from '../theme/theme';
import { useTransactionStore } from '../store/useTransactionStore';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'budget', label: 'Budget', icon: Wallet },
  { id: 'txns', label: 'Txns', icon: ArrowLeftRight },
  { id: 'goals', label: 'Goals', icon: Trophy },
  { id: 'settings', label: 'Settings', icon: Settings },
];

interface BottomNavigationProps {
  activeTab: string;
  onTabPress: (tabId: string) => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab, onTabPress }) => {
  const { theme } = useTransactionStore();
  const colors = theme === 'light' ? LIGHT_COLORS : DARK_COLORS;

  return (
    <View style={[
      styles.container,
      { backgroundColor: colors.surface, borderTopColor: colors.border }
    ]}>
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = item.id === activeTab;

        return (
          <TouchableOpacity 
            key={item.id} 
            style={styles.navItem} 
            onPress={() => onTabPress(item.id)}
          >
            <Icon 
              size={20} 
              color={isActive ? colors.primary : colors.textMuted} 
              strokeWidth={isActive ? 2.5 : 2}
            />
            <View style={{ height: 4 }} />
            <Typography 
              variant="label" 
              style={[styles.label, { color: isActive ? colors.primary : colors.textMuted } as TextStyle]}
            >
              {item.label}
            </Typography>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    paddingTop: THEME.spacing.sm,
    paddingBottom: 24, // Account for home indicator
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    justifyContent: 'space-around',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    alignItems: 'center',
    gap: 4,
  },
  label: {
    fontSize: 10,
    textTransform: 'none',
    letterSpacing: 0,
  }
});

export default BottomNavigation;
