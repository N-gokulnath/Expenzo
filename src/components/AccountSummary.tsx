import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Landmark, Wallet, CreditCard, ChevronRight } from 'lucide-react-native';
import { useTransactionStore } from '../store/useTransactionStore';
import { LIGHT_COLORS, DARK_COLORS, SPACING } from '../theme/theme';

const AccountIcon = ({ name, color, size = 20 }: { name: string, color: string, size?: number }) => {
  switch (name) {
    case 'landmark': return <Landmark color={color} size={size} />;
    case 'wallet': return <Wallet color={color} size={size} />;
    default: return <CreditCard color={color} size={size} />;
  }
};

import AccountDetailModal from './AccountDetailModal';
import AddAccountModal from './AddAccountModal';

const AccountSummary = () => {
  const { accounts, getAccountBalance, theme } = useTransactionStore();
  const colors = theme === 'light' ? LIGHT_COLORS : DARK_COLORS;
  
  const [isAddModalVisible, setIsAddModalVisible] = React.useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = React.useState(false);
  const [selectedAccountId, setSelectedAccountId] = React.useState<string | null>(null);

  const activeAccounts = accounts.filter(a => !a.isDeleted);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Your Accounts</Text>
        <TouchableOpacity 
          style={styles.seeAll} 
          onPress={() => {
            setSelectedAccountId(null);
            setIsDetailModalVisible(true);
          }}
        >
          <Text style={[styles.seeAllText, { color: colors.primary }]}>View Details</Text>
          <ChevronRight size={16} color={colors.primary} />
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {activeAccounts.map((account) => {
          const balance = getAccountBalance(account.id);
          const isNegative = balance < 0;

          return (
            <TouchableOpacity 
              key={account.id} 
              style={[styles.card, { 
                backgroundColor: colors.surface,
                borderColor: colors.border,
              }]}
              onPress={() => {
                setSelectedAccountId(account.id);
                setIsDetailModalVisible(true);
              }}
            >
              <View style={styles.cardHeader}>
                <View style={[styles.iconContainer, { backgroundColor: colors.surfaceLight }]}>
                  <AccountIcon name={account.icon} color={colors.primary} />
                </View>
                <Text 
                  numberOfLines={1} 
                  style={[styles.accountName, { color: colors.textSecondary }]}
                >
                  {account.name}
                </Text>
              </View>
              
              <Text 
                style={[
                  styles.balance, 
                  { color: isNegative ? colors.secondary : colors.textPrimary }
                ]}
              >
                ₹{Math.abs(balance).toLocaleString()}
              </Text>
              
              <Text style={[styles.status, { color: colors.textMuted }]}>
                {isNegative ? 'Overdue' : 'Available Balance'}
              </Text>
            </TouchableOpacity>
          );
        })}

        {/* Action Card: Add New Account */}
        <TouchableOpacity 
          style={[styles.addCard, { 
            borderColor: colors.border,
            borderStyle: 'dashed',
          }]}
          onPress={() => setIsAddModalVisible(true)}
        >
          <View style={[styles.addIconContainer, { backgroundColor: colors.surfaceLight }]}>
            <Text style={{ color: colors.primary, fontSize: 24, fontWeight: '300' }}>+</Text>
          </View>
          <Text style={[styles.addText, { color: colors.textSecondary }]}>Add Account</Text>
        </TouchableOpacity>
      </ScrollView>

      <AddAccountModal 
        visible={isAddModalVisible} 
        onClose={() => setIsAddModalVisible(false)} 
      />
      <AccountDetailModal 
        visible={isDetailModalVisible} 
        accountId={selectedAccountId}
        onClose={() => setIsDetailModalVisible(false)} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  seeAll: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 4,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
  },
  card: {
    width: 160,
    padding: SPACING.md,
    borderRadius: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  accountName: {
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  balance: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  status: {
    fontSize: 11,
    fontWeight: '400',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  addCard: {
    width: 140,
    padding: SPACING.md,
    borderRadius: 20,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    height: 120, // Match typical card height roughly
  },
  addIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  addText: {
    fontSize: 12,
    fontWeight: '600',
  }
});

export default AccountSummary;
