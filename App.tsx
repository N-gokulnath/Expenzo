import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Container from './src/components/Container';
import BottomNavigation from './src/components/BottomNavigation';
import FAB from './src/components/FAB';
import { useTransactionStore } from './src/store/useTransactionStore';
import AddTransactionModal from './src/components/AddTransactionModal';
import { THEME, COLORS, DARK_COLORS, LIGHT_COLORS } from './src/theme/theme';

import DashboardScreen from './src/screens/DashboardScreen';
import BudgetScreen from './src/screens/BudgetScreen';
import TransactionsScreen from './src/screens/TransactionsScreen';
import GoalsScreen from './src/screens/GoalsScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import AnalyticsScreen from './src/screens/AnalyticsScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import AddGoalModal from './src/components/AddGoalModal';

const ScreenContent = ({ 
  activeTab, 
  onProfilePress, 
  onAnalyticsPress, 
  onAddNew,
  onBack
}: { 
  activeTab: string, 
  onProfilePress: () => void, 
  onAnalyticsPress: () => void,
  onAddNew: () => void,
  onBack: () => void
}) => {
  switch (activeTab) {
    case 'dashboard':
      return <DashboardScreen onProfilePress={onProfilePress} onAnalyticsPress={onAnalyticsPress} />;
    case 'budget':
      return <BudgetScreen onProfilePress={onProfilePress} onAnalyticsPress={onAnalyticsPress} />;
    case 'txns':
      return <TransactionsScreen onProfilePress={onProfilePress} onAnalyticsPress={onAnalyticsPress} />;
    case 'goals':
      return <GoalsScreen onProfilePress={onProfilePress} onAnalyticsPress={onAnalyticsPress} onAddNew={onAddNew} />;
    case 'settings':
      return <SettingsScreen onProfilePress={onProfilePress} onAnalyticsPress={onAnalyticsPress} />;
    case 'analytics':
      return <AnalyticsScreen onBack={onBack} />;
    default:
      return <DashboardScreen onProfilePress={onProfilePress} onAnalyticsPress={onAnalyticsPress} />;
  }
};

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [modalVisible, setModalVisible] = useState(false);
  const [isAddGoalModalVisible, setIsAddGoalModalVisible] = useState(false);

  const { theme, isOnboarded } = useTransactionStore();
  const colors = theme === 'light' ? LIGHT_COLORS : DARK_COLORS;

  if (!isOnboarded) {
    return (
      <SafeAreaProvider>
        <OnboardingScreen />
      </SafeAreaProvider>
    );
  }

  const navigateToSettings = () => setActiveTab('settings');
  const navigateToAnalytics = () => setActiveTab('analytics');
  const navigateBack = () => setActiveTab('dashboard');

  return (
    <SafeAreaProvider>
      <Container>
        <SafeAreaView style={[
          styles.safeArea,
          { backgroundColor: colors.background }
        ]}>
          <ScreenContent 
            activeTab={activeTab}
            onProfilePress={navigateToSettings}
            onAnalyticsPress={navigateToAnalytics}
            onAddNew={() => setIsAddGoalModalVisible(true)}
            onBack={navigateBack}
          />

          {activeTab !== 'analytics' && <FAB onPress={() => setModalVisible(true)} />}
          <BottomNavigation activeTab={activeTab} onTabPress={setActiveTab} />
          
          <AddTransactionModal 
            visible={modalVisible} 
            onClose={() => setModalVisible(false)} 
          />
          
          <AddGoalModal 
            visible={isAddGoalModalVisible}
            onClose={() => setIsAddGoalModalVisible(false)}
          />
        </SafeAreaView>
      </Container>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
});

export default App;
