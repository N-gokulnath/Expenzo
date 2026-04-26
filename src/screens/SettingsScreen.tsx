import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  Switch,
  Modal,
  TextInput,
  Platform
} from 'react-native';
import { 
  Tag,
  Plus,
  Trash2,
  X,
  Languages,
  Coins,
  SquareStack,
  Database,
  HelpCircle,
  ChevronRight,
  Moon,
  Sun,
  FileText,
  Info,
  RotateCcw,
  Settings,
  ShieldCheck,
  ShieldAlert,
  TrendingUp,
} from 'lucide-react-native';
import { useTransactionStore } from '../store/useTransactionStore';
import { THEME, COLORS, DARK_COLORS, LIGHT_COLORS, SPACING } from '../theme/theme';
import Typography from '../components/Typography';
import BrandHeader from '../components/BrandHeader';
import AddCategoryModal from '../components/AddCategoryModal';

const SettingsScreen = ({ onProfilePress, onAnalyticsPress }: { onProfilePress?: () => void, onAnalyticsPress?: () => void }) => {
  const { 
    theme, 
    toggleTheme, 
    resetAllData, 
    transactions, 
    customCategories,
    addCustomCategory,
    deleteCustomCategory,
    showDashboardAnalytics,
    toggleDashboardAnalytics,
    accounts,
    deleteAccount,
    carryForwardEnabled,
    toggleCarryForward
  } = useTransactionStore();
  
  const colors = theme === 'light' ? LIGHT_COLORS : DARK_COLORS;

  const [isAddingCategory, setIsAddingCategory] = React.useState(false);
  const [isAdvancedModalVisible, setIsAdvancedModalVisible] = React.useState(false);
  const [isDataManagementVisible, setIsDataManagementVisible] = React.useState(false);

  const handleResetData = () => {
    Alert.alert(
      'Reset All Data?',
      'This will permanently delete ALL transactions, custom accounts, and reset everything back to the defaults. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset Everything', 
          style: 'destructive',
          onPress: () => {
            resetAllData();
            Alert.alert('Success', 'Application data has been reset.');
          }
        }
      ]
    );
  };

  const SettingItem = ({ 
    icon: Icon, 
    label, 
    description,
    value, 
    onPress, 
    showChevron = true,
    destructive = false,
    labelStyle = {},
    badge
  }: any) => (
    <TouchableOpacity 
      style={styles.settingItem}
      onPress={badge ? () => Alert.alert('Coming Soon', `${label} will be available in the next beta update!`) : onPress}
      disabled={!onPress && !badge}
      activeOpacity={0.7}
    >
      <View style={styles.settingLeft}>
        <View style={styles.iconBox}>
          <Icon size={22} color={destructive ? '#FF453A' : colors.textSecondary} strokeWidth={1.5} />
        </View>
        <View style={styles.settingText}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Typography variant="body" bold style={[{ color: destructive ? '#FF453A' : colors.textPrimary }, labelStyle]}>{label}</Typography>
            {badge && (
              <View style={[styles.badgeContainer, { backgroundColor: colors.primary + '20' }]}>
                <Typography variant="caption" bold style={{ fontSize: 9, color: colors.primary }}>{badge}</Typography>
              </View>
            )}
          </View>
          {description && (
            <Typography variant="caption" color={colors.textMuted} style={styles.description}>{description}</Typography>
          )}
        </View>
      </View>
      <View style={styles.settingRight}>
        {value}
        {showChevron && <ChevronRight size={18} color={colors.textMuted} />}
      </View>
    </TouchableOpacity>
  );

  const AdvancedModal = () => (
    <Modal
      visible={isAdvancedModalVisible}
      transparent
      animationType="slide"
      onRequestClose={() => setIsAdvancedModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
          <View style={styles.modalHeader}>
            <Typography variant="h3" bold>Advanced</Typography>
            <TouchableOpacity onPress={() => setIsAdvancedModalVisible(false)}>
              <X color={colors.textPrimary} size={24} />
            </TouchableOpacity>
          </View>

          <View style={[styles.sectionCard, { backgroundColor: colors.surfaceLight, marginTop: 20 }]}>
            <SettingItem 
              icon={RotateCcw}
              label="Reset Application Data"
              description="Clear all transactions, budgets and categories. This action is irreversible."
              destructive
              onPress={handleResetData}
            />
          </View>
          
          <Typography variant="caption" color={colors.textMuted} style={{ marginTop: 24, textAlign: 'center', paddingHorizontal: 20 }}>
            Use this section for high-level system operations.
          </Typography>
        </View>
      </View>
    </Modal>
  );

  const DataManagementModal = () => {
    return (
      <Modal
        visible={isDataManagementVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsDataManagementVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface, height: '90%', borderTopLeftRadius: 40, borderTopRightRadius: 40 }]}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <TouchableOpacity onPress={() => setIsDataManagementVisible(false)}>
                  <ChevronRight size={24} color={colors.textPrimary} style={{ transform: [{ rotate: '180deg' }] }} />
                </TouchableOpacity>
                <Typography variant="h3" bold>Data Management</Typography>
              </View>
              <TouchableOpacity onPress={() => setIsDataManagementVisible(false)}>
                <X color={colors.textPrimary} size={24} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 20 }}>
              {/* Accounts Section */}
              <View style={styles.managementSection}>
                <Typography variant="label" style={styles.sectionLabel}>Manage Profile & Accounts</Typography>
                <View style={[styles.sectionCard, { backgroundColor: colors.surfaceLight }]}>
                  {accounts.map((account, index) => (
                    <View key={account.id}>
                      <View style={styles.managementItem}>
                        <View style={styles.managementItemLeft}>
                          <View style={[styles.iconBox, { backgroundColor: colors.surface, borderRadius: 8, padding: 4 }]}>
                            <Database size={18} color={colors.primary} />
                          </View>
                          <View>
                            <Typography variant="body" bold>{account.name}</Typography>
                            <Typography variant="caption" color={colors.textMuted}>Default Account</Typography>
                          </View>
                        </View>
                        <TouchableOpacity 
                          onPress={() => {
                            if (accounts.length > 1) {
                              Alert.alert('Delete Account', `Are you sure you want to delete ${account.name}?`, [
                                { text: 'Cancel', style: 'cancel' },
                                { text: 'Delete', style: 'destructive', onPress: () => deleteAccount(account.id) }
                              ]);
                            } else {
                              Alert.alert('Cannot Delete', 'You must have at least one account.');
                            }
                          }}
                        >
                          <Trash2 size={18} color="#FF453A" />
                        </TouchableOpacity>
                      </View>
                      {index < accounts.length - 1 && <View style={styles.divider} />}
                    </View>
                  ))}
                </View>
              </View>

              {/* Categories Section */}
              <View style={styles.managementSection}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <Typography variant="label" style={[styles.sectionLabel, { marginBottom: 0 }]}>Categories</Typography>
                  <TouchableOpacity 
                    style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
                    onPress={() => setIsAddingCategory(true)}
                  >
                    <Plus size={16} color={colors.primary} />
                    <Typography variant="caption" bold color={colors.primary}>ADD NEW</Typography>
                  </TouchableOpacity>
                </View>
                <View style={[styles.sectionCard, { backgroundColor: colors.surfaceLight }]}>
                  {customCategories.length === 0 ? (
                    <View style={{ padding: 20, alignItems: 'center' }}>
                      <Typography variant="caption" color={colors.textMuted}>No custom categories yet</Typography>
                    </View>
                  ) : (
                    customCategories.map((cat, index) => (
                      <View key={cat.id}>
                        <View style={styles.managementItem}>
                          <View style={styles.managementItemLeft}>
                            <View style={[styles.letterIcon, { backgroundColor: colors.surface, width: 32, height: 32, borderRadius: 16 }]}>
                              <Typography variant="caption" bold color={colors.primary}>{cat.icon || cat.name.charAt(0)}</Typography>
                            </View>
                            <View>
                              <Typography variant="body" bold>{cat.name}</Typography>
                              <Typography variant="caption" color={colors.textMuted}>{cat.type.toUpperCase()}</Typography>
                            </View>
                          </View>
                          <TouchableOpacity onPress={() => deleteCustomCategory(cat.id)}>
                            <Trash2 size={18} color="#FF453A" />
                          </TouchableOpacity>
                        </View>
                        {index < customCategories.length - 1 && <View style={styles.divider} />}
                      </View>
                    ))
                  )}
                </View>
              </View>

              {/* Carry Forward Section */}
              <View style={styles.managementSection}>
                <Typography variant="label" style={styles.sectionLabel}>Forward Sessions</Typography>
                <View style={[styles.sectionCard, { backgroundColor: colors.surfaceLight }]}>
                  <View style={styles.managementItem}>
                    <View style={styles.managementItemLeft}>
                      <View style={[styles.iconBox, { backgroundColor: colors.surface, borderRadius: 8, padding: 4 }]}>
                        <RotateCcw size={18} color={colors.primary} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Typography variant="body" bold>Carry Forward Balance</Typography>
                        <Typography variant="caption" color={colors.textMuted}>Automatically transfer remaining balance to next month</Typography>
                      </View>
                    </View>
                    <Switch 
                      value={carryForwardEnabled} 
                      onValueChange={toggleCarryForward}
                      trackColor={{ false: '#3a3a3c', true: colors.primary }}
                      thumbColor="#fff"
                    />
                  </View>
                </View>
              </View>
              
              <View style={{ height: 40 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <BrandHeader onProfilePress={onProfilePress} onAnalyticsPress={onAnalyticsPress} />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Typography variant="h2" style={styles.pageTitle}>Settings</Typography>

        <View style={styles.section}>
          <Typography variant="label" style={styles.sectionLabel}>General</Typography>
          <View style={[styles.sectionCard, { backgroundColor: colors.surfaceLight }]}>
            <SettingItem 
              icon={Languages}
              label="App Language"
              description="English"
              badge="BETA"
            />
            <View style={styles.divider} />
            <SettingItem 
              icon={Coins}
              label="Currency"
              description="INR - Indian Rupee"
              badge="BETA"
            />
            <View style={styles.divider} />
            <SettingItem 
              icon={ShieldCheck}
              label="App lock"
              description="Helps you protect your data from being viewed by others accidentally."
              showChevron={false}
              badge="BETA"
              value={
                <View style={[styles.checkbox, { borderColor: colors.textMuted }]} />
              }
            />
          </View>
        </View>

        <View style={styles.section}>
          <Typography variant="label" style={styles.sectionLabel}>Analytics & Display</Typography>
          <View style={[styles.sectionCard, { backgroundColor: colors.surfaceLight }]}>
            <SettingItem 
              icon={TrendingUp}
              label="Dashboard Analysis"
              description="Show spending and weekly analysis on home screen"
              showChevron={false}
              value={
                <Switch 
                  value={showDashboardAnalytics} 
                  onValueChange={toggleDashboardAnalytics}
                  trackColor={{ false: '#3a3a3c', true: colors.primary }}
                  thumbColor={Platform.OS === 'ios' ? '#fff' : (showDashboardAnalytics ? '#fff' : '#f4f3f4')}
                />
              }
            />
          </View>
        </View>

        <View style={styles.section}>
          <Typography variant="label" style={styles.sectionLabel}>Data & Support</Typography>
          <View style={[styles.sectionCard, { backgroundColor: colors.surfaceLight }]}>
            <SettingItem 
              icon={Database}
              label="Backup and export"
              description="Google drive backup, export as excel"
              badge="BETA"
            />
            <View style={styles.divider} />
            <SettingItem 
              icon={FileText}
              label="Data Management"
              description="Manage profiles & accounts, Categories, Carry forward"
              onPress={() => setIsDataManagementVisible(true)}
            />
            <View style={styles.divider} />
            <SettingItem 
              icon={Settings}
              label="Preferences"
              description="Themes and more"
              onPress={toggleTheme}
              value={
                <Typography variant="caption" color={colors.primary}>{theme.toUpperCase()}</Typography>
              }
            />
            <View style={styles.divider} />
            <SettingItem 
              icon={HelpCircle}
              label="Help and Feedback"
              description="Help, contact us, privacy policy"
              badge="BETA"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Typography variant="label" style={styles.sectionLabel}>System</Typography>
          <View style={[styles.sectionCard, { backgroundColor: colors.surfaceLight }]}>
            <SettingItem 
              icon={ShieldAlert}
              label="Advanced"
              description="Manage sensitive account and data options"
              labelStyle={{ color: '#FF453A' }}
              onPress={() => setIsAdvancedModalVisible(true)}
            />
          </View>
        </View>

        <AdvancedModal />
        <DataManagementModal />
        <AddCategoryModal 
          visible={isAddingCategory}
          onClose={() => setIsAddingCategory(false)}
        />

        <View style={{ height: 120 }} />
      </ScrollView>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
  },
  pageTitle: {
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 8,
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  sectionCard: {
    borderRadius: 24,
    paddingHorizontal: 16,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  settingText: {
    flex: 1,
    gap: 2,
  },
  description: {
    lineHeight: 18,
  },
  badgeContainer: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  managementSection: {
    marginBottom: 24,
  },
  managementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  managementItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconBox: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderRadius: 4,
    marginLeft: 12,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginVertical: 8,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dangerNote: {
    marginTop: 8,
    marginLeft: 4,
    fontStyle: 'italic',
  },
  customCatList: {
    marginTop: 4,
  },
  customCatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
  },
  customCatLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  letterIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addBtn: {
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
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
    minHeight: '40%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  catInput: {
    height: 56,
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 8,
  },
});

export default SettingsScreen;
