import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  TextInput, 
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Alert
} from 'react-native';
import { X, Plus, Search } from 'lucide-react-native';
import Typography from './Typography';
import { COLORS, THEME, DARK_COLORS, LIGHT_COLORS } from '../theme/theme';
import { useTransactionStore } from '../store/useTransactionStore';
import { DEFAULT_CATEGORIES, Category } from '../constants/categories';
import CategoryIcon from './CategoryIcon';

interface AddBudgetModalProps {
  visible: boolean;
  onClose: () => void;
}

const AddBudgetModal: React.FC<AddBudgetModalProps> = ({ visible, onClose }) => {
  const { setBudget, budgets, monthlyBudget, getTotalAllocatedBudget, theme, customCategories, addCustomCategory } = useTransactionStore();
  const [selectedCategory, setSelectedCategory] = useState<Category | { id: string, name: string, isCustom: boolean } | null>(null);
  const [customName, setCustomName] = useState('');
  const [limit, setLimit] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showError, setShowError] = useState(false);
  
  const colors = theme === 'light' ? LIGHT_COLORS : DARK_COLORS;

  const handleSave = () => {
    const numericLimit = parseFloat(limit);
    const finalCategoryName = selectedCategory && 'isCustom' in selectedCategory ? customName.trim() : selectedCategory?.name;

    if (!finalCategoryName) {
      Alert.alert("Error", "Please provide a category name");
      return;
    }

    if (isNaN(numericLimit) || numericLimit <= 0) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }

    if (budgets[finalCategoryName]) {
      Alert.alert("Error", "A budget for this category already exists.");
      return;
    }

    const currentTotalAllocated = getTotalAllocatedBudget();
    if (currentTotalAllocated + numericLimit > monthlyBudget) {
      Alert.alert(
        "Budget Limit Exceeded",
        `Your total monthly budget is ₹${monthlyBudget.toLocaleString()}. Adding this would bring your total allocated budget to ₹${(currentTotalAllocated + numericLimit).toLocaleString()}, which exceeds your limit.\n\nPlease increase your total monthly budget or reduce this amount.`
      );
      return;
    }

    // Register custom category if it doesn't exist
    const isActuallyNewCustom = selectedCategory && 'isCustom' in selectedCategory && 
      !DEFAULT_CATEGORIES.some(c => c.name.toLowerCase() === finalCategoryName.toLowerCase()) &&
      !customCategories.some(c => c.name.toLowerCase() === finalCategoryName.toLowerCase());

    if (isActuallyNewCustom) {
      addCustomCategory({
        name: finalCategoryName,
        type: 'expense'
      });
    }

    setBudget(finalCategoryName, numericLimit);
    resetAndClose();
  };

  const resetAndClose = () => {
    setSelectedCategory(null);
    setCustomName('');
    setLimit('');
    setSearchQuery('');
    setShowError(false);
    onClose();
  };

  const allCategories: Category[] = [
    ...DEFAULT_CATEGORIES.filter(c => c.type === 'expense'),
    ...customCategories.filter(c => c.type === 'expense').map(c => ({
      id: c.id,
      name: c.name,
      icon: 'Tag', // Uniform icon for custom categories for now
      type: 'expense' as const
    }))
  ];

  const availableCategories = allCategories
    .filter(c => !budgets[c.name])
    .filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const isCustomSelected = selectedCategory && 'isCustom' in selectedCategory;
  const currentCategoryName = isCustomSelected ? (customName || 'New Budget') : selectedCategory?.name;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={resetAndClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <TouchableWithoutFeedback onPress={resetAndClose}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>
        
        <View style={[styles.content, { backgroundColor: colors.surface }]}>
          <View style={styles.header}>
            <View>
              <Typography variant="h2">Select Category</Typography>
              <Typography variant="caption" color={colors.textSecondary}>
                Choose a category to set a budget
              </Typography>
            </View>
            <TouchableOpacity onPress={resetAndClose} style={styles.closeButton}>
              <X size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <View style={[styles.searchContainer, { backgroundColor: colors.surfaceLight }]}>
            <Search size={20} color={colors.textMuted} />
            <TextInput
              style={[styles.searchInput, { color: colors.textPrimary }]}
              placeholder="Search categories..."
              placeholderTextColor={colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.categoryList}>
            {!selectedCategory ? (
              <View style={styles.grid}>
                {/* Custom Category Option (Moved to first) */}
                <TouchableOpacity
                  style={[styles.categoryCard, { backgroundColor: colors.surfaceLight, borderStyle: 'dashed', borderWidth: 1, borderColor: COLORS.primary }]}
                  onPress={() => setSelectedCategory({ id: 'custom', name: 'Custom', isCustom: true })}
                >
                  <View style={[styles.iconContainer, { backgroundColor: colors.surface }]}>
                    <Plus size={22} color={COLORS.primary} />
                  </View>
                  <Typography variant="caption" color={COLORS.primary} bold>Custom</Typography>
                </TouchableOpacity>

                {availableCategories.map(cat => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[styles.categoryCard, { backgroundColor: colors.surfaceLight }]}
                    onPress={() => setSelectedCategory(cat)}
                  >
                    <View style={[styles.iconContainer, { backgroundColor: colors.surface }]}>
                      <CategoryIcon 
                        name={cat.name} 
                        iconName={cat.icon} 
                        color={COLORS.primary} 
                        size={22} 
                      />
                    </View>
                    <Typography variant="caption" numberOfLines={1} style={{ textAlign: 'center' }}>{cat.name}</Typography>
                  </TouchableOpacity>
                ))}

                {availableCategories.length === 0 && searchQuery === '' && (
                  <View style={styles.emptyState}>
                    <Typography color={colors.textMuted}>No more categories available</Typography>
                  </View>
                )}
              </View>
            ) : (
              <View>
                <TouchableOpacity 
                  onPress={() => setSelectedCategory(null)}
                  style={styles.backButton}
                >
                  <Typography color={COLORS.primary}>← Back to Categories</Typography>
                </TouchableOpacity>

                <View style={styles.section}>
                  <Typography variant="label" style={styles.sectionLabel}>
                    Budget for {currentCategoryName}
                  </Typography>

                  {isCustomSelected && (
                    <View style={[styles.inputContainer, { backgroundColor: colors.surfaceLight, marginBottom: 16 }]}>
                      <TextInput
                        style={[styles.nameInput, { color: colors.textPrimary }]}
                        value={customName}
                        onChangeText={setCustomName}
                        placeholder="Enter category name"
                        placeholderTextColor={colors.textMuted}
                        autoFocus={isCustomSelected}
                      />
                    </View>
                  )}

                  <View style={[styles.inputContainer, { backgroundColor: colors.surfaceLight }]}>
                    <Typography variant="h2" style={styles.currencyPrefix}>₹</Typography>
                    <TextInput
                      style={[styles.input, { color: colors.textPrimary }]}
                      value={limit}
                      onChangeText={setLimit}
                      keyboardType="numeric"
                      placeholder="0"
                      placeholderTextColor={colors.textMuted}
                      autoFocus={!isCustomSelected}
                    />
                  </View>
                </View>

                <TouchableOpacity 
                  style={[styles.saveButton, { backgroundColor: COLORS.primary }]} 
                  onPress={handleSave}
                >
                  <Plus size={20} color="#000" />
                  <Typography variant="body" bold color="#000" style={{ marginLeft: 8 }}>Set Budget</Typography>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  content: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    height: '80%', // Fixed height for consistency
    padding: THEME.spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.xl,
  },
  closeButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing.md,
    borderRadius: 12,
    marginBottom: THEME.spacing.lg,
    height: 48,
  },
  iconPreview: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  categoryList: {
    flex: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  section: {
    marginBottom: THEME.spacing.xl,
  },
  sectionLabel: {
    marginBottom: THEME.spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: THEME.spacing.md,
    borderRadius: 16,
  },
  currencyPrefix: {
    marginRight: 8,
    opacity: 0.5,
  },
  input: {
    flex: 1,
    fontSize: 28,
    fontWeight: '700',
    padding: 0,
  },
  saveButton: {
    height: 50,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    alignItems: 'center',
    padding: 8,
    marginBottom: 20,
  },
  nameInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    padding: 0,
  }
});

export default AddBudgetModal;
