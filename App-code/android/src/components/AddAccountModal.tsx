import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  TextInput, 
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { X, Landmark, Wallet, CreditCard, Save } from 'lucide-react-native';
import Typography from './Typography';
import { COLORS, THEME, LIGHT_COLORS, DARK_COLORS } from '../theme/theme';
import { useTransactionStore } from '../store/useTransactionStore';

interface AddAccountModalProps {
  visible: boolean;
  onClose: () => void;
}

const Icons = [
  { id: 'landmark', icon: Landmark },
  { id: 'wallet', icon: Wallet },
  { id: 'credit-card', icon: CreditCard },
];

const AddAccountModal: React.FC<AddAccountModalProps> = ({ visible, onClose }) => {
  const { addAccount, theme } = useTransactionStore();
  const colors = theme === 'light' ? LIGHT_COLORS : DARK_COLORS;
  
  const [name, setName] = useState('');
  const [initialBalance, setInitialBalance] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('landmark');

  const handleSave = () => {
    if (name.trim()) {
      const accountId = Math.random().toString(36).substring(7);
      const balance = parseFloat(initialBalance) || 0;

      addAccount({
        id: accountId,
        name: name.trim(),
        icon: selectedIcon,
      } as any);

      if (balance !== 0) {
        useTransactionStore.getState().addTransaction({
          title: 'Opening Balance',
          amount: Math.abs(balance),
          category: 'Adjustment',
          date: new Date().toISOString(),
          type: balance >= 0 ? 'income' : 'expense',
          iconName: 'landmark',
          accountId: accountId
        });
      }

      setName('');
      setInitialBalance('');
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
            <View>
              <Typography variant="h2">Add Account</Typography>
              <Typography variant="caption" color={colors.textSecondary}>Create a new fund source</Typography>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
              <Typography variant="label" style={styles.sectionLabel}>Account Name</Typography>
              <View style={[styles.inputContainer, { backgroundColor: colors.surfaceLight }]}>
                <TextInput
                  style={[styles.input, { color: colors.textPrimary }]}
                  value={name}
                  onChangeText={setName}
                  placeholder="e.g. Savings, HDFC, Pocket"
                  placeholderTextColor={colors.textMuted}
                />
              </View>
            </View>

            <View style={styles.section}>
              <Typography variant="label" style={styles.sectionLabel}>Initial Balance</Typography>
              <View style={[styles.inputContainer, { backgroundColor: colors.surfaceLight }]}>
                <TextInput
                  style={[styles.input, { color: colors.textPrimary }]}
                  value={initialBalance}
                  onChangeText={setInitialBalance}
                  placeholder="0.00"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.section}>
              <Typography variant="label" style={styles.sectionLabel}>Select Icon</Typography>
              <View style={styles.iconBatch}>
                {Icons.map((item) => {
                  const Icon = item.icon;
                  const isSelected = selectedIcon === item.id;
                  return (
                    <TouchableOpacity
                      key={item.id}
                      onPress={() => setSelectedIcon(item.id)}
                      style={[
                        styles.iconOption,
                        { backgroundColor: colors.surfaceLight },
                        isSelected && { borderColor: colors.primary, borderWidth: 2 }
                      ]}
                    >
                      <Icon size={24} color={isSelected ? colors.primary : colors.textSecondary} />
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.saveButton, { backgroundColor: COLORS.primary }]} 
              onPress={handleSave}
              disabled={!name.trim()}
            >
              <Save size={20} color="#000" />
              <Typography variant="body" bold color="#000" style={{ marginLeft: 8 }}>Save Account</Typography>
            </TouchableOpacity>
            
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
    padding: THEME.spacing.lg,
    maxHeight: '80%',
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
    height: 56,
    borderRadius: 16,
    paddingHorizontal: THEME.spacing.md,
    justifyContent: 'center',
  },
  input: {
    fontSize: 16,
    fontWeight: '600',
  },
  iconBatch: {
    flexDirection: 'row',
    gap: 12,
  },
  iconOption: {
    width: 60,
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  saveButton: {
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: THEME.spacing.md,
  },
});

export default AddAccountModal;
