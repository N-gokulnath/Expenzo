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
  Dimensions
} from 'react-native';
import { X, Save, Calendar, Target, Smile } from 'lucide-react-native';
import Typography from './Typography';
import { COLORS, THEME, LIGHT_COLORS, DARK_COLORS } from '../theme/theme';
import { useTransactionStore } from '../store/useTransactionStore';

interface AddGoalModalProps {
  visible: boolean;
  onClose: () => void;
}

const EMOJIS = ['🎯', '🚗', '🏠', '✈️', '🎓', '💻', '💍', '🌴', '💰', '🎁'];

const AddGoalModal: React.FC<AddGoalModalProps> = ({ visible, onClose }) => {
  const { addGoal, theme } = useTransactionStore();
  const colors = theme === 'light' ? LIGHT_COLORS : DARK_COLORS;

  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [emoji, setEmoji] = useState('🎯');
  const [targetDate, setTargetDate] = useState(new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString().split('T')[0]);

  const handleSave = () => {
    if (name.trim() && targetAmount) {
      addGoal({
        name: name.trim(),
        targetAmount: parseFloat(targetAmount),
        savedAmount: 0,
        emoji,
        targetDate: new Date(targetDate).toISOString(),
        autoSave: false,
      });
      setName('');
      setTargetAmount('');
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
              <Typography variant="h2">New Saving Goal</Typography>
              <Typography variant="caption" color={colors.textSecondary}>What are you saving for?</Typography>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
            <View style={styles.section}>
              <Typography variant="label" style={styles.sectionLabel}>Goal Name</Typography>
              <View style={[styles.inputContainer, { backgroundColor: colors.surfaceLight }]}>
                <TextInput
                  style={[styles.input, { color: colors.textPrimary }]}
                  value={name}
                  onChangeText={setName}
                  placeholder="e.g. Dream Car, Vacation"
                  placeholderTextColor={colors.textMuted}
                />
              </View>
            </View>

            <View style={styles.section}>
              <Typography variant="label" style={styles.sectionLabel}>Target Amount (₹)</Typography>
              <View style={[styles.inputContainer, { backgroundColor: colors.surfaceLight }]}>
                <TextInput
                  style={[styles.input, { color: colors.textPrimary }]}
                  value={targetAmount}
                  onChangeText={setTargetAmount}
                  placeholder="0.00"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.section}>
              <Typography variant="label" style={styles.sectionLabel}>Target Date (YYYY-MM-DD)</Typography>
              <View style={[styles.inputContainer, { backgroundColor: colors.surfaceLight }]}>
                <TextInput
                  style={[styles.input, { color: colors.textPrimary }]}
                  value={targetDate}
                  onChangeText={setTargetDate}
                  placeholder="2024-12-31"
                  placeholderTextColor={colors.textMuted}
                />
              </View>
            </View>

            <View style={styles.section}>
              <Typography variant="label" style={styles.sectionLabel}>Select Emoji</Typography>
              <View style={styles.emojiList}>
                {EMOJIS.map(e => (
                  <TouchableOpacity
                    key={e}
                    onPress={() => setEmoji(e)}
                    style={[
                      styles.emojiItem,
                      { backgroundColor: colors.surfaceLight },
                      emoji === e && { borderColor: colors.primary, borderWidth: 2 }
                    ]}
                  >
                    <Typography variant="h3">{e}</Typography>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.saveButton, { backgroundColor: colors.primary }]} 
              onPress={handleSave}
              disabled={!name.trim() || !targetAmount}
            >
              <Save size={20} color="#000" />
              <Typography variant="body" bold color="#000" style={{ marginLeft: 8 }}>Create Goal</Typography>
            </TouchableOpacity>
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
    padding: 24,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  closeButton: {
    padding: 8,
  },
  section: {
    marginBottom: 20,
  },
  sectionLabel: {
    marginBottom: 8,
  },
  inputContainer: {
    height: 56,
    borderRadius: 16,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  input: {
    fontSize: 16,
    fontWeight: '600',
  },
  emojiList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  emojiItem: {
    width: 54,
    height: 54,
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
    marginTop: 12,
  },
});

export default AddGoalModal;
