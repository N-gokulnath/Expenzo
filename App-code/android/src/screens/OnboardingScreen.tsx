import React, { useState, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  TextInput, 
  Dimensions, 
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { 
  ChevronRight, 
  Wallet, 
  User, 
  Check, 
  ShieldCheck, 
  Coins, 
  ArrowRight,
  Plus
} from 'lucide-react-native';
import { useTransactionStore } from '../store/useTransactionStore';
import { DARK_COLORS, LIGHT_COLORS, SPACING, THEME } from '../theme/theme';

const { width } = Dimensions.get('window');

const STEPS = [
  { id: 'welcome', title: 'Welcome' },
  { id: 'profile', title: 'Profile' },
  { id: 'accounts', title: 'Accounts' },
  { id: 'finish', title: 'Finish' },
];

export default function OnboardingScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const [name, setName] = useState('');
  const [initialAccountName, setInitialAccountName] = useState('Default Bank');
  
  const { 
    theme, 
    setUserName, 
    completeOnboarding, 
    addAccount,
    accounts 
  } = useTransactionStore();
  
  const colors = theme === 'light' ? LIGHT_COLORS : DARK_COLORS;
  
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -50,
          duration: 200,
          useNativeDriver: true,
        })
      ]).start(() => {
        setCurrentStep(currentStep + 1);
        slideAnim.setValue(50);
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
          })
        ]).start();
      });
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    setUserName(name || 'User');
    // If they haven't added an account yet (besides the default 'Cash on Hand' which is always there in INITIAL_ACCOUNTS)
    // but in store enhancement I reset INITIAL_ACCOUNTS. Actually I should check if they customized.
    if (initialAccountName && !accounts.some(a => a.name === initialAccountName)) {
        addAccount({ name: initialAccountName, icon: 'landmark' });
    }
    completeOnboarding();
  };

  const renderWelcome = () => (
    <View style={styles.stepContainer}>
      <View style={[styles.iconCircle, { backgroundColor: colors.primary + '20' }]}>
        <Coins size={64} color={colors.primary} />
      </View>
      <Text style={[styles.title, { color: colors.textPrimary }]}>Expenzo</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Experience the next level of financial tracking. Sleek, fast, and powerful.
      </Text>
      <View style={styles.featuresList}>
        {[
          { icon: ShieldCheck, text: 'Privacy focused & local storage' },
          { icon: Wallet, text: 'Custom accounts & categories' },
          { icon: Check, text: 'Smart analytics & budgeting' },
        ].map((f, i) => (
          <View key={i} style={styles.featureItem}>
            <f.icon size={20} color={colors.primary} />
            <Text style={[styles.featureText, { color: colors.textSecondary }]}>{f.text}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderProfile = () => (
    <View style={styles.stepContainer}>
      <View style={[styles.iconCircle, { backgroundColor: colors.primary + '20' }]}>
        <User size={48} color={colors.primary} />
      </View>
      <Text style={[styles.title, { color: colors.textPrimary }]}>Choose a Name</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        How should Expenzo address you?
      </Text>
      
      <View style={[styles.inputWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <TextInput
          style={[styles.input, { color: colors.textPrimary }]}
          placeholder="Enter your name"
          placeholderTextColor={colors.textMuted}
          value={name}
          onChangeText={setName}
          autoFocus
        />
      </View>
    </View>
  );

  const renderAccounts = () => (
    <View style={styles.stepContainer}>
      <View style={[styles.iconCircle, { backgroundColor: colors.primary + '20' }]}>
        <Wallet size={48} color={colors.primary} />
      </View>
      <Text style={[styles.title, { color: colors.textPrimary }]}>Initial account</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Let's create your first account to start tracking.
      </Text>
      
      <View style={styles.accountSuggestions}>
        {['Main Bank', 'Digital Wallet', 'Savings', 'Vault'].map((item) => (
          <TouchableOpacity 
            key={item}
            onPress={() => setInitialAccountName(item)}
            style={[
              styles.suggestionChip, 
              { 
                backgroundColor: initialAccountName === item ? colors.primary : colors.surface,
                borderColor: colors.border
              }
            ]}
          >
            <Text style={[
              styles.suggestionText, 
              { color: initialAccountName === item ? colors.black : colors.textPrimary }
            ]}>
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={[styles.inputWrapper, { backgroundColor: colors.surface, borderColor: colors.border, marginTop: 24 }]}>
        <TextInput
          style={[styles.input, { color: colors.textPrimary }]}
          placeholder="Custom account name"
          placeholderTextColor={colors.textMuted}
          value={initialAccountName}
          onChangeText={setInitialAccountName}
        />
      </View>
    </View>
  );

  const renderFinish = () => (
    <View style={styles.stepContainer}>
      <View style={[styles.iconCircle, { backgroundColor: colors.primary + '20' }]}>
        <Check size={64} color={colors.primary} />
      </View>
      <Text style={[styles.title, { color: colors.textPrimary }]}>You're all set!</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Expenzo is ready to help you master your finances.
      </Text>
      
      <View style={[styles.summaryCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>User</Text>
          <Text style={[styles.summaryValue, { color: colors.textPrimary }]}>{name || 'User'}</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>First Account</Text>
          <Text style={[styles.summaryValue, { color: colors.textPrimary }]}>{initialAccountName}</Text>
        </View>
      </View>
    </View>
  );

  const renderStep = () => {
    switch(currentStep) {
      case 0: return renderWelcome();
      case 1: return renderProfile();
      case 2: return renderAccounts();
      case 3: return renderFinish();
      default: return renderWelcome();
    }
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Progress Header */}
      <View style={styles.header}>
        <View style={styles.progressContainer}>
          {STEPS.map((step, index) => (
            <View 
              key={step.id} 
              style={[
                styles.progressBar, 
                { 
                  backgroundColor: index <= currentStep ? colors.primary : colors.surface,
                  width: (width - SPACING.xl * 2 - (STEPS.length - 1) * 8) / STEPS.length
                }
              ]} 
            />
          ))}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <Animated.View style={[
          styles.content,
          { 
            opacity: fadeAnim,
            transform: [{ translateX: slideAnim }]
          }
        ]}>
          {renderStep()}
        </Animated.View>
      </ScrollView>

      {/* Footer Actions */}
      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        {currentStep > 0 && (
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => setCurrentStep(currentStep - 1)}
          >
            <Text style={[styles.backButtonText, { color: colors.textSecondary }]}>Back</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          style={[styles.nextButton, { backgroundColor: colors.primary }]} 
          onPress={nextStep}
          disabled={currentStep === 1 && !name.trim()}
        >
          <Text style={styles.nextButtonText}>
            {currentStep === STEPS.length - 1 ? 'Start Using Expenzo' : 'Continue'}
          </Text>
          <ArrowRight size={20} color={colors.black} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.md,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepContainer: {
    width: '100%',
    alignItems: 'center',
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: SPACING.xxl,
    lineHeight: 24,
    paddingHorizontal: SPACING.lg,
  },
  featuresList: {
    width: '100%',
    marginTop: SPACING.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: THEME.borderRadius.md,
    marginBottom: SPACING.sm,
  },
  featureText: {
    fontSize: 15,
    marginLeft: SPACING.md,
    fontWeight: '500',
  },
  inputWrapper: {
    width: '100%',
    height: 64,
    borderRadius: THEME.borderRadius.lg,
    borderWidth: 1,
    paddingHorizontal: SPACING.lg,
    justifyContent: 'center',
  },
  input: {
    fontSize: 18,
    fontWeight: '600',
  },
  accountSuggestions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  suggestionChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: THEME.borderRadius.round,
    borderWidth: 1,
  },
  suggestionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  summaryCard: {
    width: '100%',
    borderRadius: THEME.borderRadius.xl,
    borderWidth: 1,
    padding: SPACING.xl,
    marginTop: SPACING.md,
  },
  summaryItem: {
    paddingVertical: SPACING.sm,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginVertical: SPACING.md,
  },
  footer: {
    padding: SPACING.xl,
    paddingBottom: Platform.OS === 'ios' ? 40 : SPACING.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  nextButton: {
    flex: 1,
    height: 64,
    borderRadius: THEME.borderRadius.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginLeft: SPACING.md,
  },
  nextButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '800',
  },
});
