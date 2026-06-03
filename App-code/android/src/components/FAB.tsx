import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Plus } from 'lucide-react-native';
import { COLORS, THEME, DARK_COLORS, LIGHT_COLORS } from '../theme/theme';
import { useTransactionStore } from '../store/useTransactionStore';

interface FABProps {
  onPress?: () => void;
}

const FAB: React.FC<FABProps> = ({ onPress }) => {
  const { theme } = useTransactionStore();
  const colors = theme === 'light' ? LIGHT_COLORS : DARK_COLORS;
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity 
        style={styles.fab} 
        activeOpacity={0.8}
        onPress={onPress}
      >
        <Plus color={theme === 'light' ? '#FFFFFF' : '#000'} size={28} strokeWidth={3} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: THEME.spacing.lg,
    bottom: 80, // Above bottom nav
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
});

export default FAB;
