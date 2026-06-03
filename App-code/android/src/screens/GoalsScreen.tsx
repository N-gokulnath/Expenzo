import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions,
  Modal,
  TextInput
} from 'react-native';
import { 
  Trophy, 
  Plus, 
  Clock, 
  ChevronRight,
  X,
  CreditCard
} from 'lucide-react-native';
import { useTransactionStore, Goal } from '../store/useTransactionStore';
import { LIGHT_COLORS, DARK_COLORS } from '../theme/theme';
import Typography from '../components/Typography';
import BrandHeader from '../components/BrandHeader';
import EditGoalModal from '../components/EditGoalModal';

const { width } = Dimensions.get('window');

const GoalsScreen: React.FC<{ 
  onProfilePress?: () => void;
  onAnalyticsPress?: () => void;
  onAddNew: () => void;
}> = ({ onProfilePress, onAnalyticsPress, onAddNew }) => {
  const { goals, theme, accounts, contributeToGoal } = useTransactionStore();
  const colors = theme === 'light' ? LIGHT_COLORS : DARK_COLORS;

  const [isContributionModalVisible, setIsContributionModalVisible] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [contributionAmount, setContributionAmount] = useState('');
  const [selectedAccountId, setSelectedAccountId] = useState(accounts[0]?.id || '');

  const getStatusColor = (goal: Goal) => {
    const progress = goal.savedAmount / goal.targetAmount;
    const today = new Date();
    const targetDate = new Date(goal.targetDate);
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (progress >= 0.8) return '#34C759'; // Green
    if (progress >= 0.4) return '#007AFF'; // Blue
    if (diffDays < 15 && progress < 0.3) return '#FF9500'; // Amber
    return '#8E8E93'; 
  };

  const handleContribute = () => {
    const amount = parseFloat(contributionAmount);
    if (selectedGoal && amount > 0 && selectedAccountId) {
      contributeToGoal(selectedGoal.id, amount, selectedAccountId);
      setIsContributionModalVisible(false);
      setContributionAmount('');
      setSelectedGoal(null);
    }
  };

  const GoalCard = ({ goal }: { goal: Goal }) => {
    const progress = Math.min(goal.savedAmount / goal.targetAmount, 1);
    const statusColor = getStatusColor(goal);
    const targetDate = new Date(goal.targetDate);
    const daysLeft = Math.ceil((targetDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

    return (
      <View style={[styles.goalCard, { backgroundColor: colors.surfaceLight }]}>
        <View style={styles.cardHeader}>
          <View style={styles.emojiContainer}>
            <Typography variant="h2">{goal.emoji || '🎯'}</Typography>
          </View>
          <View style={styles.headerText}>
            <Typography variant="body" bold>{goal.name}</Typography>
            <View style={styles.dateChip}>
              <Clock size={12} color={colors.textMuted} />
              <Typography variant="caption" color={colors.textMuted} style={{ marginLeft: 4 }}>
                {daysLeft > 0 ? `${daysLeft} days left` : 'Target reached'}
              </Typography>
            </View>
          </View>
          <ChevronRight size={20} color={colors.textMuted} />
        </View>

        <View style={styles.progressSection}>
          <View style={styles.progressLabels}>
            <Typography variant="body" bold>₹{goal.savedAmount.toLocaleString()}</Typography>
            <Typography variant="caption" color={colors.textMuted}>Target: ₹{goal.targetAmount.toLocaleString()}</Typography>
          </View>
          
          <View style={[styles.progressBarContainer, { backgroundColor: colors.surface }]}>
            <View 
              style={[
                styles.progressBar, 
                { 
                  width: `${progress * 100}%`, 
                  backgroundColor: statusColor 
                }
              ]} 
            />
          </View>
          
          <View style={styles.progressFooter}>
            <Typography variant="caption" color={statusColor} bold>
              {Math.round(progress * 100)}% Complete
            </Typography>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <BrandHeader onProfilePress={onProfilePress} onAnalyticsPress={onAnalyticsPress} />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Typography variant="h2">Savings Goals</Typography>
          <Typography variant="caption" color={colors.textSecondary}>Turn your dreams into reality</Typography>
        </View>

        {goals.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={[styles.emptyIconCircle, { backgroundColor: colors.surfaceLight }]}>
              <Trophy size={40} color={colors.primary} />
            </View>
            <Typography variant="h3" style={{ marginTop: 20 }}>No goals set yet</Typography>
            <Typography variant="body" color={colors.textMuted} style={{ textAlign: 'center', marginTop: 8 }}>
              Start by creating your first savings financial goal.
            </Typography>
          </View>
        ) : (
          <View style={styles.goalsList}>
            {goals.map(goal => (
              <TouchableOpacity 
                key={goal.id}
                activeOpacity={0.7}
                onPress={() => {
                  setSelectedGoal(goal);
                  setIsContributionModalVisible(true);
                }}
                onLongPress={() => {
                  setEditingGoal(goal);
                  setIsEditModalVisible(true);
                }}
              >
                <GoalCard goal={goal} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        <TouchableOpacity 
          style={[styles.addNewButton, { backgroundColor: colors.primary }]}
          activeOpacity={0.8}
          onPress={onAddNew}
        >
          <Plus size={24} color="#000" />
          <Typography variant="body" bold color="#000" style={{ marginLeft: 8 }}>New Goal</Typography>
        </TouchableOpacity>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Contribution Modal */}
      <Modal
        visible={isContributionModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsContributionModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <Typography variant="h3" bold>Add Contribution</Typography>
              <TouchableOpacity onPress={() => setIsContributionModalVisible(false)}>
                <X color={colors.textPrimary} size={24} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Typography variant="label" style={styles.inputLabel}>Amount (₹)</Typography>
              <View style={[styles.inputContainer, { backgroundColor: colors.surfaceLight }]}>
                <TextInput
                  style={[styles.input, { color: colors.textPrimary }]}
                  placeholder="0.00"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="numeric"
                  value={contributionAmount}
                  onChangeText={setContributionAmount}
                  autoFocus
                />
              </View>

              <Typography variant="label" style={styles.inputLabel}>From Account</Typography>
              <View style={styles.accountList}>
                {accounts.map(account => (
                  <TouchableOpacity
                    key={account.id}
                    style={[
                      styles.accountItem,
                      { backgroundColor: colors.surfaceLight },
                      selectedAccountId === account.id && { borderColor: colors.primary, borderWidth: 1 }
                    ]}
                    onPress={() => setSelectedAccountId(account.id)}
                  >
                    <CreditCard size={18} color={selectedAccountId === account.id ? colors.primary : colors.textSecondary} />
                    <Typography 
                      variant="body" 
                      style={{ marginLeft: 8 }} 
                      color={selectedAccountId === account.id ? colors.primary : colors.textPrimary}
                    >
                      {account.name}
                    </Typography>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity 
                style={[styles.confirmButton, { backgroundColor: colors.primary }]}
                onPress={handleContribute}
              >
                <Typography variant="body" bold color="#000">Confirm Contribution</Typography>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <EditGoalModal
        visible={isEditModalVisible}
        goal={editingGoal}
        onClose={() => {
          setIsEditModalVisible(false);
          setEditingGoal(null);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
    paddingHorizontal: 40,
  },
  emptyIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goalsList: {
    gap: 16,
  },
  goalCard: {
    borderRadius: 24,
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  emojiContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
    marginLeft: 16,
  },
  dateChip: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  progressSection: {
    gap: 12,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  progressBarContainer: {
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 5,
  },
  progressFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  addNewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 28,
    marginTop: 32,
  },
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
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalBody: {
    gap: 16,
  },
  inputLabel: {
    marginBottom: 8,
  },
  inputContainer: {
    height: 56,
    borderRadius: 16,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  input: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  accountList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  accountItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  confirmButton: {
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  }
});

export default GoalsScreen;
