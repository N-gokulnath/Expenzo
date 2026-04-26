import React from 'react';
import { 
  View, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { X, Landmark, Wallet, CreditCard, ArrowUpRight, ArrowDownLeft, Check, Trash2, ChevronDown, ChevronUp } from 'lucide-react-native';
import Typography from './Typography';
import { COLORS, THEME, LIGHT_COLORS, DARK_COLORS, SPACING } from '../theme/theme';
import { useTransactionStore } from '../store/useTransactionStore';

interface AccountDetailModalProps {
  visible: boolean;
  onClose: () => void;
  accountId?: string | null;
}

const IconMap = {
  landmark: Landmark,
  wallet: Wallet,
  'credit-card': CreditCard,
};

const ICONS = ['landmark', 'wallet', 'credit-card'];

const AccountDetailModal: React.FC<AccountDetailModalProps> = ({ visible, onClose, accountId }) => {
  const { 
    accounts, 
    getAccountBalance, 
    theme, 
    getTotalIncome, 
    getTotalExpenses,
    updateAccount,
    adjustAccountBalance,
    deleteAccount
  } = useTransactionStore();
  const colors = theme === 'light' ? LIGHT_COLORS : DARK_COLORS;

  const [editName, setEditName] = React.useState('');
  const [editBalance, setEditBalance] = React.useState('');
  const [selectedIcon, setSelectedIcon] = React.useState('credit-card');

  const selectedAccount = React.useMemo(() => 
    accountId ? accounts.find(a => a.id === accountId) : null
  , [accountId, accounts]);

  React.useEffect(() => {
    if (selectedAccount) {
      setEditName(selectedAccount.name);
      setEditBalance(getAccountBalance(selectedAccount.id).toString());
      setSelectedIcon(selectedAccount.icon);
    }
  }, [selectedAccount, getAccountBalance]);

  const handleSave = () => {
    if (!selectedAccount) return;
    
    updateAccount(selectedAccount.id, { 
      name: editName,
      icon: selectedIcon
    });

    const newBalance = parseFloat(editBalance);
    if (!isNaN(newBalance)) {
      adjustAccountBalance(selectedAccount.id, newBalance);
    }

    onClose();
  };
  
  const handleDeleteAccount = () => {
    if (!selectedAccount) return;
    
    Alert.alert(
      'Delete Account?',
      `Are you sure you want to remove "${selectedAccount.name}"? Historical transactions will be preserved, and your net worth will be updated to reflect its removal.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            deleteAccount(selectedAccount.id);
            onClose();
          }
        }
      ]
    );
  };

  const renderAllAccounts = () => (
    <>
      <View style={styles.header}>
        <View>
          <Typography variant="h2">Account Details</Typography>
          <Typography variant="caption" color={colors.textSecondary}>Full breakdown of your funds</Typography>
        </View>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <X size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {accounts.map((account) => {
          const balance = getAccountBalance(account.id);
          const isNegative = balance < 0;
          const Icon = (IconMap as any)[account.icon] || CreditCard;

          return (
            <View 
              key={account.id} 
              style={[
                styles.accountItem, 
                { backgroundColor: colors.surfaceLight },
                account.isDeleted && { opacity: 0.6 }
              ]}
            >
              <View style={styles.accountRow}>
                <View style={[styles.iconContainer, account.isDeleted && { backgroundColor: 'rgba(0,0,0,0.1)' }]}>
                  <Icon size={24} color={account.isDeleted ? colors.textMuted : colors.primary} />
                </View>
                <View style={styles.accountInfo}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Typography 
                      variant="body" 
                      bold 
                      color={account.isDeleted ? colors.textMuted : colors.textPrimary}
                    >
                      {account.name}
                    </Typography>
                    {account.isDeleted && (
                      <View style={styles.archivedBadge}>
                        <Typography variant="caption" style={{ fontSize: 10, color: colors.textMuted }}>ARCHIVED</Typography>
                      </View>
                    )}
                  </View>
                  <Typography variant="caption" color={colors.textSecondary}>
                    {account.id === 'bank' ? 'Primary Account' : 'Secondary'}
                  </Typography>
                </View>
                <View style={styles.balanceInfo}>
                  <Typography 
                    variant="body" 
                    bold 
                    color={account.isDeleted ? colors.textMuted : (isNegative ? colors.secondary : colors.textPrimary)}
                  >
                    ₹{Math.abs(balance).toLocaleString()}
                  </Typography>
                </View>
              </View>
            </View>
          );
        })}

        <View style={styles.summarySection}>
          <Typography variant="label" style={styles.sectionLabel}>Insights</Typography>
          <View style={styles.statGrid}>
            <View style={[styles.statBox, { backgroundColor: colors.surfaceLight }]}>
              <ArrowUpRight size={20} color={COLORS.primary} />
              <Typography variant="caption" color={colors.textSecondary}>Total In</Typography>
              <Typography variant="body" bold color={COLORS.primary}>₹{getTotalIncome().toLocaleString()}</Typography>
            </View>
            <View style={[styles.statBox, { backgroundColor: colors.surfaceLight }]}>
              <ArrowDownLeft size={20} color={COLORS.secondary} />
              <Typography variant="caption" color={colors.textSecondary}>Total Out</Typography>
              <Typography variant="body" bold color={COLORS.secondary}>₹{getTotalExpenses().toLocaleString()}</Typography>
            </View>
          </View>
        </View>
        
        <View style={{ height: 40 }} />
      </ScrollView>
    </>
  );

  const renderSingleAccount = () => {
    if (!selectedAccount) return null;

    return (
      <View>
        <View style={styles.header}>
          <View>
            <Typography variant="h2">Edit Account</Typography>
            <Typography variant="caption" color={colors.textSecondary}>Update details for {selectedAccount.name}</Typography>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.editSection}
          >
            <Typography variant="label" style={styles.inputLabel}>Account Name</Typography>
            <TextInput
              style={[styles.input, { backgroundColor: colors.surfaceLight, color: colors.textPrimary }]}
              value={editName}
              onChangeText={setEditName}
              placeholder="e.g. My Savings"
              placeholderTextColor={colors.textMuted}
            />

            <Typography variant="label" style={styles.inputLabel}>Current Balance (₹)</Typography>
            <TextInput
              style={[styles.input, { backgroundColor: colors.surfaceLight, color: colors.textPrimary }]}
              value={editBalance}
              onChangeText={setEditBalance}
              keyboardType="numeric"
              placeholder="0.00"
              placeholderTextColor={colors.textMuted}
            />

            <Typography variant="label" style={styles.inputLabel}>Select Icon</Typography>
            <View style={styles.iconPicker}>
              {ICONS.map((iconName) => {
                const Icon = (IconMap as any)[iconName] || CreditCard;
                const isSelected = selectedIcon === iconName;
                return (
                  <TouchableOpacity
                    key={iconName}
                    style={[
                      styles.pickerIcon,
                      { backgroundColor: colors.surfaceLight },
                      isSelected && { borderColor: colors.primary, borderWidth: 2 }
                    ]}
                    onPress={() => setSelectedIcon(iconName)}
                  >
                    <Icon size={24} color={isSelected ? colors.primary : colors.textMuted} />
                    {isSelected && (
                      <View style={[styles.checkBadge, { backgroundColor: colors.primary }]}>
                        <Check size={10} color="#fff" />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.buttonRow}>
               <TouchableOpacity 
                style={[styles.deleteIconButton, { backgroundColor: 'rgba(231, 76, 60, 0.1)' }]}
                onPress={handleDeleteAccount}
              >
                <Trash2 size={24} color="#e74c3c" />
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.saveButton, { backgroundColor: colors.primary }]}
                onPress={handleSave}
              >
                <Typography variant="body" bold color="#fff">Save Changes</Typography>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.content, { backgroundColor: colors.surface }]}>
          {accountId ? renderSingleAccount() : renderAllAccounts()}
        </View>
      </View>
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
    maxHeight: '90%',
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
  accountItem: {
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
  },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  accountInfo: {
    flex: 1,
  },
  balanceInfo: {
    alignItems: 'flex-end',
  },
  archivedBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  summarySection: {
    marginTop: 20,
  },
  sectionLabel: {
    marginBottom: 12,
  },
  statGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statBox: {
    flex: 1,
    padding: 16,
    borderRadius: 20,
    gap: 4,
  },
  editSection: {
    gap: 16,
  },
  inputLabel: {
    marginBottom: -8,
  },
  input: {
    height: 56,
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    fontWeight: '500',
  },
  iconPicker: {
    flexDirection: 'row',
    gap: 16,
  },
  pickerIcon: {
    width: 60,
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  checkBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  deleteIconButton: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButton: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default AccountDetailModal;
