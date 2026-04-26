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
import { X, Save, Trash2, Calendar, Tag, Info, Landmark, Wallet, CreditCard } from 'lucide-react-native';
import Typography from './Typography';
import { COLORS, THEME, DARK_COLORS, LIGHT_COLORS, SPACING } from '../theme/theme';
import { useTransactionStore, Transaction, IconName, Account, TransactionType } from '../store/useTransactionStore';
import { CalendarModal } from './CalendarModal';
import { formatDate } from '../utils/formatters';
import CategorySelectModal from './CategorySelectModal';
import * as LucideIcons from 'lucide-react-native';

interface EditTransactionModalProps {
  visible: boolean;
  onClose: () => void;
  transaction: Transaction | null;
}

// Removed static CATEGORIES constant

const AccountIcon = ({ name, color, size = 16 }: { name: string, color: string, size?: number }) => {
  switch (name) {
    case 'landmark': return <Landmark color={color} size={size} />;
    case 'wallet': return <Wallet color={color} size={size} />;
    default: return <CreditCard color={color} size={size} />;
  }
};

const EditTransactionModal: React.FC<EditTransactionModalProps> = ({ 
  visible, 
  onClose, 
  transaction 
}) => {
  const { updateTransaction, deleteTransaction, accounts, theme } = useTransactionStore();
  const colors = theme === 'light' ? LIGHT_COLORS : DARK_COLORS;

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [iconName, setIconName] = useState<IconName>('other');
  const [accountId, setAccountId] = useState('');
  const [date, setDate] = useState(new Date());
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [type, setType] = useState<TransactionType>('expense');

  const CategoryIcon = (LucideIcons as any)[iconName] || LucideIcons.HelpCircle;

  useEffect(() => {
    if (transaction) {
      setTitle(transaction.title);
      setAmount(transaction.amount.toString());
      setCategory(transaction.category);
      setIconName(transaction.iconName);
      setAccountId(transaction.accountId);
      setDate(new Date(transaction.date));
      setIsCustomCategory(!!transaction.isCustomCategory);
      setType(transaction.type);
    }
  }, [transaction, visible]);

  if (!transaction) return null;

  const handleUpdate = () => {
    const numericAmount = parseFloat(amount);
    if (!title || isNaN(numericAmount)) {
      Alert.alert('Error', 'Please enter a valid title and amount');
      return;
    }

    updateTransaction(transaction.id, {
      title,
      amount: numericAmount,
      category,
      iconName,
      accountId,
      date: date.toISOString(),
      isCustomCategory,
      type: type,
    });
    onClose();
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Transaction',
      'Are you sure you want to delete this transaction?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: () => {
            deleteTransaction(transaction.id);
            onClose();
          } 
        },
      ]
    );
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
              <Typography variant="h2">Edit Transaction</Typography>
              <Typography variant="caption" color={colors.textSecondary}>Modify details or remove entry</Typography>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Type Selector */}
            <View style={styles.section}>
              <Typography variant="label" style={styles.sectionLabel}>Transaction Type</Typography>
              <View style={[styles.typeSelector, { backgroundColor: colors.surfaceLight }]}>
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
            </View>

            {/* Amount Field */}
            <View style={styles.section}>
              <Typography variant="label" style={styles.sectionLabel}>Amount</Typography>
              <View style={[styles.inputRow, { backgroundColor: colors.surfaceLight }]}>
                <Typography variant="h2" style={styles.currency}>₹</Typography>
                <TextInput
                  style={[styles.mainInput, { color: type === 'income' ? colors.primary : colors.secondary }]}
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="numeric"
                  placeholder="0.00"
                  placeholderTextColor={colors.textMuted}
                />
              </View>
            </View>

            {/* Account Selector */}
            <View style={styles.section}>
              <Typography variant="label" style={styles.sectionLabel}>Source Account</Typography>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false} 
                style={styles.categoryScroll}
              >
                {accounts.map((acc) => (
                  <TouchableOpacity
                    key={acc.id}
                    onPress={() => setAccountId(acc.id)}
                    style={[
                      styles.accountChip,
                      { backgroundColor: colors.surfaceLight },
                      accountId === acc.id && { borderColor: colors.primary, borderWidth: 1 }
                    ]}
                  >
                    <AccountIcon 
                      name={acc.icon} 
                      color={accountId === acc.id ? colors.primary : colors.textPrimary} 
                    />
                    <Typography 
                      variant="caption" 
                      bold 
                      style={{ marginLeft: 6 }}
                      color={accountId === acc.id ? colors.primary : colors.textPrimary}
                    >
                      {acc.name}
                    </Typography>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Title Field */}
            <View style={styles.section}>
              <Typography variant="label" style={styles.sectionLabel}>Title / Description</Typography>
              <View style={[styles.inputRow, { backgroundColor: colors.surfaceLight }]}>
                <Info size={18} color={colors.textMuted} style={{ marginRight: 12 }} />
                <TextInput
                  style={[styles.smallInput, { color: colors.textPrimary }]}
                  value={title}
                  onChangeText={setTitle}
                  placeholder="What was this for?"
                  placeholderTextColor={colors.textMuted}
                />
              </View>
            </View>

            {/* Date Field */}
            <View style={styles.section}>
              <Typography variant="label" style={styles.sectionLabel}>Date</Typography>
              <TouchableOpacity 
                style={[styles.inputRow, { backgroundColor: colors.surfaceLight, justifyContent: 'space-between' }]}
                onPress={() => setIsCalendarVisible(true)}
              >
                <Typography variant="body" color={colors.textPrimary}>
                  {formatDate(date)}
                </Typography>
                <Calendar size={18} color={colors.primary} />
              </TouchableOpacity>
            </View>

            {/* Category selection */}
            <View style={styles.section}>
              <Typography variant="label" style={styles.sectionLabel}>Category</Typography>
              <TouchableOpacity 
                style={[
                  styles.inputRow,
                  { backgroundColor: colors.surfaceLight, justifyContent: 'space-between' }
                ]}
                onPress={() => setIsCategoryModalVisible(true)}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <View style={[styles.selectedCategoryIcon, { backgroundColor: colors.surface }]}>
                    {isCustomCategory && iconName.length === 1 ? (
                      <Typography variant="body" bold>{iconName}</Typography>
                    ) : (
                      <CategoryIcon size={20} color={colors.primary} />
                    )}
                  </View>
                  <Typography variant="body" color={colors.textPrimary}>
                    {category}
                  </Typography>
                </View>
                <Tag size={18} color={colors.primary} />
              </TouchableOpacity>
            </View>

            <View style={styles.actionFooter}>
              <TouchableOpacity 
                style={[styles.deleteButton, { borderColor: colors.error }]} 
                onPress={handleDelete}
              >
                <Trash2 size={20} color={colors.error} />
                <Typography variant="body" bold color={colors.error} style={{ marginLeft: 8 }}>Delete</Typography>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.saveButton, { backgroundColor: colors.primary }]} 
                onPress={handleUpdate}
              >
                <Save size={20} color="#000" />
                <Typography variant="body" bold color="#000" style={{ marginLeft: 8 }}>Save Changes</Typography>
              </TouchableOpacity>
            </View>

            <View style={{ height: 10 }} />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>

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
          setCategory(cat.name);
          setIconName(cat.icon);
          setIsCustomCategory(!!cat.isCustom);
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
  content: {
    borderTopLeftRadius: THEME.borderRadius.xl,
    borderTopRightRadius: THEME.borderRadius.xl,
    padding: THEME.spacing.lg,
    maxHeight: '90%',
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'flex-end',
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
  typeSelector: {
    flexDirection: 'row',
    borderRadius: THEME.borderRadius.md,
    padding: 4,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: THEME.borderRadius.sm,
  },
  section: {
    marginBottom: THEME.spacing.xl,
  },
  sectionLabel: {
    marginBottom: THEME.spacing.sm,
    opacity: 0.6,
    fontSize: 10,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: 12,
    borderRadius: 16,
  },
  currency: {
    marginRight: 8,
    opacity: 0.5,
  },
  mainInput: {
    flex: 1,
    fontSize: 22,
    fontWeight: '700',
    padding: 0,
    paddingRight: THEME.spacing.md,
  },
  smallInput: {
    flex: 1,
    fontSize: 16,
    padding: 0,
    paddingRight: THEME.spacing.md,
  },
  categoryScroll: {
    flexDirection: 'row',
    marginTop: 4,
  },
  categoryChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  accountChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedCategoryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionFooter: {
    flexDirection: 'row',
    gap: 12,
    marginTop: THEME.spacing.lg,
  },
  deleteButton: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButton: {
    flex: 2,
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default EditTransactionModal;
