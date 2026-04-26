import React from 'react';
import { View, StyleSheet, ViewStyle, SafeAreaView, StatusBar } from 'react-native';
import { DARK_COLORS, LIGHT_COLORS } from '../theme/theme';

interface ContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

import { useTransactionStore } from '../store/useTransactionStore';

const Container: React.FC<ContainerProps> = ({ children, style }) => {
  const { theme } = useTransactionStore();
  const colors = theme === 'light' ? LIGHT_COLORS : DARK_COLORS;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }, style]}>
      <StatusBar 
        barStyle={theme === 'light' ? 'dark-content' : 'light-content'} 
        backgroundColor={colors.background}
      />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Container;
