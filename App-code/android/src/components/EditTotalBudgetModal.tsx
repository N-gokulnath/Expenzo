import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  TextInput, 
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { X, Save } from 'lucide-react-native';
import { Alert } from 'react-native';
import Typography from './Typography';
import { COLORS, THEME, DARK_COLORS, LIGHT_COLORS } from '../theme/theme';
import { useTransactionStore } from '../store/useTransactionStore';

interface EditTotalBudgetModalProps {
  visible: boolean;
  onClose: () => void;
  currentLimit: number;
}

const EditTotalBudgetModal: React.FC<EditTotalBudgetModalProps> = ({ 
  visible, 
  onClose, 
  currentLimit 
}) => {
  const { setMonthlyBudget, theme, getTotalAllocatedBudget } = useTransactionStore();
  const [limit, setLimit] = useState(currentLimit.toString());
  const colors = theme === 'light' ? LIGHT_COLORS : DARK_COLORS;

  useEffect(() => {
    setLimit(currentLimit.toString());
  }, [currentLimit, visible]);

  const handleSave = () => {
    const numericLimit = parseFloat(limit);
    if (!isNaN(numericLimit)) {
      const currentAllocated = getTotalAllocatedBudget();
      if (numericLimit < currentAllocated) {
        Alert.alert(
          "Unsafe Budget Limit",
          `You have already allocated ₹${currentAllocated.toLocaleString()} to your categories. You cannot set a total budget lower than your current allocations.\n\nPlease reduce your category budgets first.`
        );
        return;
      }

      setMonthlyBudget(numericLimit);
      onClose();
    }
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
            <View style={{ flex: 1 }}>
              <Typography variant="h2" style={{ color: colors.textPrimary }}>Edit Monthly Budget</Typography>
              <Typography variant="caption" color={colors.textSecondary}>Set your global spending limit</Typography>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Typography variant="label" style={styles.sectionLabel}>Total Budget Limit</Typography>
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
                selectTextOnFocus
              />
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.saveButton, { backgroundColor: COLORS.primary }]} 
            onPress={handleSave}
          >
            <Save size={20} color="#000" />
            <Typography variant="body" bold color="#000" style={{ marginLeft: 8 }}>Save Total Budget</Typography>
          </TouchableOpacity>
          
          <View style={{ height: 40 }} />
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
    padding: THEME.spacing.lg,
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
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  }
});

export default EditTotalBudgetModal;
