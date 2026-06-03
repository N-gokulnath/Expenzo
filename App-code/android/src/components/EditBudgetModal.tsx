import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  TextInput, 
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { X, Save, Trash2, History } from 'lucide-react-native';
import Typography from './Typography';
import TransactionItem from './TransactionItem';
import { COLORS, THEME, DARK_COLORS, LIGHT_COLORS } from '../theme/theme';
import { useTransactionStore } from '../store/useTransactionStore';
import { DEFAULT_CATEGORIES } from '../constants/categories';
import CategoryIcon from './CategoryIcon';

interface EditBudgetModalProps {
  visible: boolean;
  onClose: () => void;
  category: string | null;
  currentLimit: number;
}

const EditBudgetModal: React.FC<EditBudgetModalProps> = ({ 
  visible, 
  onClose, 
  category, 
  currentLimit 
}) => {
  const { setBudget, renameBudget, removeBudget, transactions, theme, monthlyBudget, getTotalAllocatedBudget } = useTransactionStore();
  const [limit, setLimit] = useState(currentLimit?.toString() || '0');
  const [name, setName] = useState(category || '');
  const [showError, setShowError] = useState(false);
  const colors = theme === 'light' ? LIGHT_COLORS : DARK_COLORS;

  useEffect(() => {
    if (visible) {
      setLimit(currentLimit?.toString() || '0');
      setName(category || '');
    }
  }, [currentLimit, category, visible]);

  if (!category) return null;

  const categoryTransactions = transactions
    .filter(t => t.category === category && t.type === 'expense')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const categoryData = DEFAULT_CATEGORIES.find(c => c.name === category);

  const handleSave = () => {
    const numericLimit = parseFloat(limit);
    const trimmedName = name.trim();

    if (!trimmedName) {
      setShowError(true);
      return;
    }
    
    setShowError(false);

    if (!isNaN(numericLimit) && category) {
      const currentTotalAllocated = getTotalAllocatedBudget();
      const oldLimit = currentLimit;
      const newTotalAfterChange = currentTotalAllocated - oldLimit + numericLimit;

      if (newTotalAfterChange > monthlyBudget) {
        Alert.alert(
          "Budget Limit Exceeded",
          `Your total monthly budget is ₹${monthlyBudget.toLocaleString()}. Increasing this would bring your total allocated budget to ₹${newTotalAfterChange.toLocaleString()}, which exceeds your limit.\n\nPlease increase your total monthly budget or reduce this amount.`
        );
        return;
      }

      if (trimmedName !== category) {
        renameBudget(category, trimmedName);
      }
      setBudget(trimmedName, numericLimit);
      onClose();
    }
  };

  const handleDelete = () => {
    if (!category) return;
    
    Alert.alert(
      "Delete Budget",
      `Are you sure you want to stop tracking the "${category}" budget? This will not delete your transactions.`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => {
            removeBudget(category);
            onClose();
          }
        }
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <View style={[styles.content, { backgroundColor: colors.surface }]}>
          <View style={styles.header}>
            <View style={styles.iconWrapper}>
              <CategoryIcon 
                name={category || ''} 
                iconName={categoryData?.icon} 
                size={22} 
                color={COLORS.primary} 
              />
            </View>
            <View style={{ flex: 1 }}>
              <View style={[
                styles.inputContainer, 
                { backgroundColor: colors.surfaceLight, marginBottom: 8 },
                showError && { borderColor: '#FF453A', borderWidth: 1 }
              ]}>
                <TextInput
                  style={[styles.headerInput, { color: colors.textPrimary, flex: 1 }]}
                  value={name}
                  onChangeText={(text) => {
                    setName(text);
                    if (text.trim()) setShowError(false);
                  }}
                  placeholder="Category Name"
                  placeholderTextColor={colors.textMuted}
                />
              </View>
              <Typography variant="caption" color={colors.textSecondary}>Adjust name and monthly limit</Typography>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
              <Typography variant="label" style={styles.sectionLabel}>Budget Limit</Typography>
              <View style={[styles.inputContainer, { backgroundColor: colors.surfaceLight }]}>
                <Typography variant="h2" style={styles.currencyPrefix}>₹</Typography>
                <TextInput
                  style={[styles.input, { color: colors.textPrimary }]}
                  value={limit}
                  onChangeText={setLimit}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor={colors.textMuted}
                  autoFocus
                />
              </View>
            </View>

            <View style={styles.actionRow}>
              <TouchableOpacity 
                style={[styles.saveButton, { backgroundColor: COLORS.primary }]} 
                onPress={handleSave}
              >
                <Save size={20} color="#000" />
                <Typography variant="body" bold color="#000" style={{ marginLeft: 8 }}>Update Budget</Typography>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.deleteButton, { backgroundColor: 'rgba(255, 69, 58, 0.1)' }]} 
                onPress={handleDelete}
              >
                <Trash2 size={20} color="#FF453A" />
              </TouchableOpacity>
            </View>

            <View style={styles.historyHeader}>
              <History size={18} color={colors.textSecondary} />
              <Typography variant="label" style={styles.historyTitle}>Spending History</Typography>
            </View>

            <View style={styles.historyList}>
              {categoryTransactions.length > 0 ? (
                categoryTransactions.map(item => (
                  <TransactionItem 
                    key={item.id}
                    {...item}
                    date={formatDate(item.date)}
                  />
                ))
              ) : (
                <View style={styles.emptyHistory}>
                  <Typography variant="caption" color={colors.textMuted}>No transactions in this category yet.</Typography>
                </View>
              )}
            </View>
            
            <View style={{ height: 40 }} />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  content: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    maxHeight: '85%',
    padding: THEME.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.xl,
    gap: 12,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.03)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    padding: 8,
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
  headerInput: {
    fontSize: 24,
    fontWeight: '700',
    padding: 0,
    marginBottom: 4,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: THEME.spacing.xxl,
  },
  saveButton: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: THEME.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
    paddingBottom: 8,
  },
  historyTitle: {
    opacity: 0.8,
  },
  historyList: {
    gap: 0, // TransactionItem handles its own padding? 
  },
  emptyHistory: {
    alignItems: 'center',
    paddingVertical: 32,
  }
});

export default EditBudgetModal;
