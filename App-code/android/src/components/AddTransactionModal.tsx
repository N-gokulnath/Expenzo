import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  TextInput, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView
} from 'react-native';
import { X, Landmark, Wallet, CreditCard, Calendar } from 'lucide-react-native';
import Typography from './Typography';
import { COLORS, THEME, DARK_COLORS, LIGHT_COLORS, SPACING } from '../theme/theme';
import { useTransactionStore, TransactionType, IconName } from '../store/useTransactionStore';
import { CalendarModal } from './CalendarModal';
import { formatDate } from '../utils/formatters';
import CategorySelectModal from './CategorySelectModal';
import * as LucideIcons from 'lucide-react-native';

interface AddTransactionModalProps {
  visible: boolean;
  onClose: () => void;
}

// Removed static CATEGORIES constant

const AccountIcon = ({ name, color, size = 16 }: { name: string, color: string, size?: number }) => {
  switch (name) {
    case 'landmark': return <Landmark color={color} size={size} />;
    case 'wallet': return <Wallet color={color} size={size} />;
    default: return <CreditCard color={color} size={size} />;
  }
};

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ visible, onClose }) => {
  const { addTransaction, accounts, theme } = useTransactionStore();
  const colors = theme === 'light' ? LIGHT_COLORS : DARK_COLORS;
  
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [date, setDate] = useState(new Date());
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [category, setCategory] = useState({ name: 'None', icon: 'Minus', isCustom: false });
  const [selectedAccountId, setSelectedAccountId] = useState(accounts[0]?.id || 'bank');

  const CategoryIcon = (LucideIcons as any)[category.icon] || LucideIcons.HelpCircle;

  const handleSave = () => {
    if (!title || !amount) return;

    addTransaction({
      title,
      amount: parseFloat(amount),
      type,
      category: category.name,
      date: date.toISOString(),
      iconName: category.icon,
      accountId: selectedAccountId,
      isCustomCategory: category.isCustom
    });

    // Reset and close
    setTitle('');
    setAmount('');
    setDate(new Date());
    setCategory({ name: 'None', icon: 'Minus', isCustom: false });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <View style={[
            styles.content,
            { backgroundColor: colors.surface }
          ]}>
            <View style={styles.header}>
              <Typography variant="h3">Add Transaction</Typography>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <X color={colors.textSecondary} size={24} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={[
                styles.typeSelector,
                { backgroundColor: colors.surfaceLight }
              ]}>
                <TouchableOpacity 
                  style={[
                    styles.typeButton, 
                    type === 'expense' && { backgroundColor: colors.secondary }
                  ]}
                  onPress={() => setType('expense')}
                >
                  <Typography 
                    variant="body" 
                    bold 
                    color={type === 'expense' ? '#000' : colors.textSecondary}
                  >
                    Expense
                  </Typography>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[
                    styles.typeButton, 
                    type === 'income' && { backgroundColor: colors.primary }
                  ]}
                  onPress={() => setType('income')}
                >
                  <Typography 
                    variant="body" 
                    bold 
                    color={type === 'income' ? '#000' : colors.textSecondary}
                  >
                    Income
                  </Typography>
                </TouchableOpacity>
              </View>

              <View style={styles.inputGroup}>
                <Typography variant="label" style={[styles.label, { color: colors.textSecondary }]}>SOURCE ACCOUNT</Typography>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.accountSelector}
                >
                  {accounts.map((acc) => (
                    <TouchableOpacity
                      key={acc.id}
                      style={[
                        styles.accountChip,
                        { backgroundColor: colors.surfaceLight },
                        selectedAccountId === acc.id && { borderColor: colors.primary, borderWidth: 1 }
                      ]}
                      onPress={() => setSelectedAccountId(acc.id)}
                    >
                      <AccountIcon 
                        name={acc.icon} 
                        color={selectedAccountId === acc.id ? colors.primary : colors.textSecondary} 
                      />
                      <Typography 
                        variant="caption" 
                        bold
                        style={{ marginLeft: 6 }}
                        color={selectedAccountId === acc.id ? colors.primary : colors.textSecondary}
                      >
                        {acc.name}
                      </Typography>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.inputGroup}>
                <Typography variant="label" style={[styles.label, { color: colors.textSecondary }]}>TITLE</Typography>
                <TextInput
                  style={[
                    styles.input,
                    { backgroundColor: colors.surfaceLight, color: colors.textPrimary }
                  ]}
                  placeholder="What was this for?"
                  placeholderTextColor={colors.textMuted}
                  value={title}
                  onChangeText={setTitle}
                />
              </View>

              <View style={styles.inputGroup}>
                <Typography variant="label" style={[styles.label, { color: colors.textSecondary }]}>AMOUNT</Typography>
                <TextInput
                  style={[
                    styles.input,
                    styles.amountInput,
                    { backgroundColor: colors.surfaceLight, color: type === 'income' ? colors.primary : colors.secondary }
                  ]}
                  placeholder="₹0"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="numeric"
                  value={amount}
                  onChangeText={setAmount}
                />
              </View>

              <View style={styles.inputGroup}>
                <Typography variant="label" style={[styles.label, { color: colors.textSecondary }]}>DATE</Typography>
                <TouchableOpacity 
                  style={[
                    styles.input,
                    { backgroundColor: colors.surfaceLight, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }
                  ]}
                  onPress={() => setIsCalendarVisible(true)}
                >
                  <Typography variant="body" color={colors.textPrimary}>
                    {formatDate(date)}
                  </Typography>
                  <Calendar size={20} color={colors.primary} />
                </TouchableOpacity>
              </View>

              <View style={styles.inputGroup}>
                <Typography variant="label" style={[styles.label, { color: colors.textSecondary }]}>CATEGORY</Typography>
                <TouchableOpacity 
                  style={[
                    styles.input,
                    { backgroundColor: colors.surfaceLight, flexDirection: 'row', alignItems: 'center', gap: 12 }
                  ]}
                  onPress={() => setIsCategoryModalVisible(true)}
                >
                  <View style={[styles.selectedCategoryIcon, { backgroundColor: colors.surface }]}>
                    {category.isCustom && category.icon.length === 1 ? (
                      <Typography variant="body" bold>{category.icon}</Typography>
                    ) : (
                      <CategoryIcon size={20} color={colors.primary} />
                    )}
                  </View>
                  <Typography variant="body" color={colors.textPrimary}>
                    {category.name}
                  </Typography>
                </TouchableOpacity>
              </View>

              <TouchableOpacity 
                style={[styles.saveButton, { backgroundColor: colors.primary }]} 
                onPress={handleSave}
              >
                <Typography variant="body" bold color="#000">Save Transaction</Typography>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>

      <CalendarModal
        isVisible={isCalendarVisible}
        onClose={() => setIsCalendarVisible(false)}
        selectedDate={date}
        onSelectDate={setDate}
      />

      <CategorySelectModal
        visible={isCategoryModalVisible}
        onClose={() => setIsCategoryModalVisible(false)}
        onSelect={(cat) => {
          setCategory({
            name: cat.name,
            icon: cat.icon,
            isCustom: !!cat.isCustom
          });
          setIsCategoryModalVisible(false);
        }}
        type={type}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  content: {
    borderTopLeftRadius: THEME.borderRadius.xl,
    borderTopRightRadius: THEME.borderRadius.xl,
    padding: THEME.spacing.lg,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.xl,
  },
  closeButton: {
    padding: 4,
  },
  typeSelector: {
    flexDirection: 'row',
    borderRadius: THEME.borderRadius.md,
    padding: 4,
    marginBottom: THEME.spacing.xl,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: THEME.borderRadius.sm,
  },
  accountSelector: {
    flexDirection: 'row',
    gap: THEME.spacing.sm,
    paddingBottom: 4,
  },
  accountChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputGroup: {
    marginBottom: THEME.spacing.lg,
  },
  label: {
    marginBottom: THEME.spacing.sm,
    fontSize: 10,
    letterSpacing: 1,
  },
  input: {
    borderRadius: THEME.borderRadius.md,
    padding: 12,
    paddingRight: THEME.spacing.xl,
    fontSize: 16,
  },
  amountInput: {
    fontSize: 22,
    fontWeight: 'bold',
    paddingRight: THEME.spacing.xl,
  },
  selectedCategoryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButton: {
    paddingVertical: 16,
    borderRadius: THEME.borderRadius.lg,
    alignItems: 'center',
    marginTop: THEME.spacing.sm,
  },
});

export default AddTransactionModal;
