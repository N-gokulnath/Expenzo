import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, TouchableOpacity } from 'react-native';
import { Plus } from 'lucide-react-native';
import Typography from '../components/Typography';
import BudgetListItem from '../components/BudgetListItem';
import BudgetOverview from '../components/BudgetOverview';
import BrandHeader from '../components/BrandHeader';
import EditBudgetModal from '../components/EditBudgetModal';
import AddBudgetModal from '../components/AddBudgetModal';
import EditTotalBudgetModal from '../components/EditTotalBudgetModal';
import { useTransactionStore } from '../store/useTransactionStore';
import { THEME, COLORS, LIGHT_COLORS, DARK_COLORS } from '../theme/theme';
import { DEFAULT_CATEGORIES, Category } from '../constants/categories';

const BudgetScreen = ({ onProfilePress, onAnalyticsPress }: { onProfilePress?: () => void, onAnalyticsPress?: () => void }) => {
  const { budgets, monthlyBudget, getCategorySpending, theme, customCategories } = useTransactionStore();
  const colors = theme === 'light' ? LIGHT_COLORS : DARK_COLORS;

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isTotalBudgetModalVisible, setIsTotalBudgetModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const allCategories: Category[] = [
    ...DEFAULT_CATEGORIES.filter(c => c.type === 'expense'),
    ...customCategories.filter(c => c.type === 'expense').map(c => ({ 
      id: c.id, 
      name: c.name, 
      icon: c.name.charAt(0).toUpperCase(),
      type: 'expense' as const 
    }))
  ];
  
  const existingBudgetNames = Object.keys(budgets);
  const availableCategories = allCategories.filter(
    (c: Category) => !existingBudgetNames.includes(c.name) && 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = Object.keys(budgets);

  const handleEditBudget = (category: string) => {
    setSelectedCategory(category);
    setIsEditModalVisible(true);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <BrandHeader 
        onProfilePress={onProfilePress} 
        onAnalyticsPress={onAnalyticsPress}
        onAddPress={() => setIsAddModalVisible(true)} 
      />
      
      <EditBudgetModal 
        visible={isEditModalVisible}
        onClose={() => {
          setIsEditModalVisible(false);
          setSelectedCategory(null);
        }}
        category={selectedCategory}
        currentLimit={selectedCategory ? (budgets[selectedCategory] ?? 0) : 0}
      />

      <AddBudgetModal 
        visible={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
      />

      <EditTotalBudgetModal
        visible={isTotalBudgetModalVisible}
        onClose={() => setIsTotalBudgetModalVisible(false)}
        currentLimit={monthlyBudget}
      />

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <BudgetOverview onPress={() => setIsTotalBudgetModalVisible(true)} />

        <View style={styles.sectionHeader}>
          <Typography variant="label">Budgets Categories</Typography>
        </View>

        <View style={styles.listContainer}>
          {categories.length > 0 ? (
            categories.map((cat) => (
              <BudgetListItem 
                key={cat}
                category={cat}
                limit={budgets[cat]}
                spent={getCategorySpending(cat)}
                onPress={() => handleEditBudget(cat)}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Typography variant="body" color={colors.textMuted}>No budgets set yet.</Typography>
            </View>
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 40,
  },
  sectionHeader: {
    marginTop: THEME.spacing.xl,
    marginBottom: THEME.spacing.md,
    paddingHorizontal: THEME.spacing.lg,
  },
  listContainer: {
    paddingHorizontal: THEME.spacing.lg,
  },
  emptyState: { 
    alignItems: 'center',
    marginTop: THEME.spacing.xl,
    padding: THEME.spacing.xl,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 20,
  }
});

export default BudgetScreen;
