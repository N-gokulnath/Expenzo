import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  TextInput,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useTransactionStore } from '../store/useTransactionStore';
import { DARK_COLORS, LIGHT_COLORS } from '../theme/theme';
import Typography from './Typography';
import { X } from 'lucide-react-native';

interface AddCategoryModalProps {
  visible: boolean;
  onClose: () => void;
  initialType?: 'expense' | 'income';
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({ visible, onClose, initialType = 'expense' }) => {
  const { theme, addCustomCategory } = useTransactionStore();
  const colors = theme === 'light' ? LIGHT_COLORS : DARK_COLORS;

  const [newCatName, setNewCatName] = useState('');
  const [newCatType, setNewCatType] = useState<'expense' | 'income'>(initialType);

  // Sync initialType when modal becomes visible
  React.useEffect(() => {
    if (visible) {
      setNewCatType(initialType);
      setNewCatName('');
    }
  }, [visible, initialType]);

  const handleAddCategory = () => {
    if (!newCatName.trim()) return;
    addCustomCategory({
      name: newCatName.trim(),
      type: newCatType,
    });
    setNewCatName('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <Typography variant="h3" bold>New Category</Typography>
              <TouchableOpacity onPress={onClose}>
                <X size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.typeToggle}>
              <TouchableOpacity 
                style={[
                  styles.typeBtn, 
                  newCatType === 'expense' && { backgroundColor: colors.surfaceLight, borderColor: colors.primary, borderWidth: 1 }
                ]}
                onPress={() => setNewCatType('expense')}
              >
                <Typography variant="caption" bold color={newCatType === 'expense' ? colors.primary : colors.textSecondary}>EXPENSE</Typography>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.typeBtn, 
                  newCatType === 'income' && { backgroundColor: colors.surfaceLight, borderColor: colors.primary, borderWidth: 1 }
                ]}
                onPress={() => setNewCatType('income')}
              >
                <Typography variant="caption" bold color={newCatType === 'income' ? colors.primary : colors.textSecondary}>INCOME</Typography>
              </TouchableOpacity>
            </View>

            <TextInput
              style={[styles.catInput, { backgroundColor: colors.surfaceLight, color: colors.textPrimary }]}
              placeholder="Name (e.g. Side Project)"
              placeholderTextColor={colors.textMuted}
              value={newCatName}
              onChangeText={setNewCatName}
              autoFocus
            />

            <Typography variant="caption" color={colors.textSecondary} style={{ marginBottom: 16 }}>
              The first letter will be used as the icon.
            </Typography>

            <TouchableOpacity 
              style={[styles.addBtn, { backgroundColor: colors.primary }]}
              onPress={handleAddCategory}
            >
              <Typography variant="body" bold color="#000">Create Category</Typography>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    paddingBottom: 40,
    minHeight: '40%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  typeToggle: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  typeBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  catInput: {
    height: 56,
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 8,
  },
  addBtn: {
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default AddCategoryModal;
