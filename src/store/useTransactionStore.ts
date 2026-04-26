import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type TransactionType = 'income' | 'expense';
export type IconName = string; // Flexible for Lucide names or custom letters

export interface Account {
  id: string;
  name: string;
  icon: string; // From lucide-react-native
  isDeleted?: boolean;
}

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string; // ISO String
  type: TransactionType;
  iconName: string;
  accountId: string;
  isCustomCategory?: boolean;
}

export interface CustomCategory {
  id: string;
  name: string;
  type: TransactionType;
  icon: string; // First letter
}

export interface Goal {
  id: string;
  name: string;
  emoji: string;
  targetAmount: number;
  savedAmount: number;
  targetDate: string; // ISO String
  autoSave?: boolean;
}

interface TransactionState {
  transactions: Transaction[];
  accounts: Account[];
  customCategories: CustomCategory[];
  budgets: { [category: string]: number };
  goals: Goal[];
  monthlyBudget: number;
  getTotalAllocatedBudget: () => number;
  showDashboardAnalytics: boolean;
  carryForwardEnabled: boolean;
  theme: 'dark' | 'light';
  userName: string;
  isOnboarded: boolean;
  setUserName: (name: string) => void;
  completeOnboarding: () => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  setBudget: (category: string, amount: number) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  toggleTheme: () => void;
  toggleDashboardAnalytics: () => void;
  toggleCarryForward: () => void;
  setMonthlyBudget: (amount: number) => void;
  getMonthlyExpensesTotal: () => number;
  addAccount: (account: Omit<Account, 'id'>) => void;
  updateAccount: (id: string, updates: Partial<Account>) => void;
  adjustAccountBalance: (accountId: string, newBalance: number) => void;
  getTotalBalance: () => number;
  getAccountBalance: (accountId: string) => number;
  getTotalIncome: () => number;
  getTotalExpenses: () => number;
  getCategorySpending: (category: string) => number;
  getMoMChange: (type: 'income' | 'expense') => number;
  deleteAccount: (id: string) => void;
  addCustomCategory: (category: Omit<CustomCategory, 'id' | 'icon'>) => void;
  deleteCustomCategory: (id: string) => void;
  renameBudget: (oldName: string, newName: string) => void;
  removeBudget: (name: string) => void;
  addGoal: (goal: Omit<Goal, 'id'>) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  contributeToGoal: (goalId: string, amount: number, accountId: string) => void;
  resetAllData: () => void;
  getFilteredTransactions: (rangeType: 'month' | 'year' | 'all' | 'custom', date: Date, customRange?: { start: Date, end: Date }) => Transaction[];
  getCategoryBreakdown: (transactions: Transaction[]) => { label: string, value: number, amount: number }[];
  getTrendData: (rangeType: 'month' | 'year' | 'all' | 'custom', date: Date, customRange?: { start: Date, end: Date }) => { 
    label: string, 
    income: number, 
    expense: number, 
    incomeCategories: { name: string, amount: number }[],
    expenseCategories: { name: string, amount: number }[]
  }[];
}

// Initial mockup accounts
const INITIAL_ACCOUNTS: Account[] = [
  { id: 'hand', name: 'Cash on Hand', icon: 'wallet' },
];

// Initial mockup data
const INITIAL_DATA: Transaction[] = [];

export const useTransactionStore = create<TransactionState>()(
  persist(
    (set, get) => ({
      transactions: INITIAL_DATA,
      accounts: INITIAL_ACCOUNTS,
      customCategories: [],
      budgets: {
        'Dining': 5000,
        'Transport': 2000,
        'Electricity': 10000,
      },
      goals: [],
      monthlyBudget: 50000,
      theme: 'dark' as const,
      showDashboardAnalytics: true,
      carryForwardEnabled: false,
      userName: '',
      isOnboarded: false,
      setUserName: (name) => set({ userName: name }),
      completeOnboarding: () => set({ isOnboarded: true }),
      addTransaction: (transaction) => set((state) => ({
        transactions: [
          { ...transaction, id: Math.random().toString(36).substring(7) },
          ...state.transactions
        ]
      })),
      deleteTransaction: (id) => set((state) => ({
        transactions: state.transactions.filter(t => t.id !== id)
      })),
      setBudget: (category, amount) => set((state) => ({
        budgets: { ...state.budgets, [category]: amount }
      })),
      updateTransaction: (id, updates) => set((state) => ({
        transactions: state.transactions.map(t => t.id === id ? { ...t, ...updates } : t)
      })),
      addAccount: (account) => set((state) => ({
        accounts: [...state.accounts, { ...account, id: Math.random().toString(36).substring(7) }]
      })),
      updateAccount: (id, updates) => set((state) => ({
        accounts: state.accounts.map(a => a.id === id ? { ...a, ...updates } : a)
      })),
      adjustAccountBalance: (accountId, newBalance) => {
        const currentBalance = get().getAccountBalance(accountId);
        const diff = newBalance - currentBalance;
        
        if (diff === 0) return;
        
        get().addTransaction({
          title: 'Balance Adjustment',
          amount: Math.abs(diff),
          category: 'Adjustment',
          date: new Date().toISOString(),
          type: diff > 0 ? 'income' : 'expense',
          iconName: 'other',
          accountId: accountId
        });
      },
      getMoMChange: (type: 'income' | 'expense') => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        
        const lastMonthDate = new Date(currentYear, currentMonth - 1, 1);
        const lastMonth = lastMonthDate.getMonth();
        const lastYear = lastMonthDate.getFullYear();

        const currentTotal = (get().transactions || [])
          .filter(t => t.type === type && new Date(t.date).getMonth() === currentMonth && new Date(t.date).getFullYear() === currentYear)
          .reduce((sum, t) => sum + t.amount, 0);

        const lastTotal = (get().transactions || [])
          .filter(t => t.type === type && new Date(t.date).getMonth() === lastMonth && new Date(t.date).getFullYear() === lastYear)
          .reduce((sum, t) => sum + t.amount, 0);

        if (lastTotal === 0) return currentTotal > 0 ? 100 : 0;
        return ((currentTotal - lastTotal) / lastTotal) * 100;
      },
      toggleTheme: () => set((state) => ({ 
        theme: state.theme === 'dark' ? 'light' : 'dark' 
      })),
      toggleDashboardAnalytics: () => set((state) => ({
        showDashboardAnalytics: !state.showDashboardAnalytics
      })),
      toggleCarryForward: () => set((state) => ({
        carryForwardEnabled: !state.carryForwardEnabled
      })),
      getTotalAllocatedBudget: () => {
        const budgets = get().budgets || {};
        return Object.values(budgets).reduce((acc, curr) => acc + curr, 0);
      },
      setMonthlyBudget: (amount) => set({ monthlyBudget: amount }),
      getMonthlyExpensesTotal: () => {
        const now = new Date();
        const m = now.getMonth();
        const y = now.getFullYear();
        return (get().transactions || [])
          .filter(t => t.type === 'expense' && new Date(t.date).getMonth() === m && new Date(t.date).getFullYear() === y)
          .reduce((acc, t) => acc + t.amount, 0);
      },
      getTotalBalance: () => {
        return (get().transactions || []).reduce((acc, t) => t.type === 'income' ? acc + t.amount : acc - t.amount, 0);
      },
      getAccountBalance: (accountId: string) => {
        return (get().transactions || [])
          .filter(t => t.accountId === accountId)
          .reduce((acc, t) => t.type === 'income' ? acc + t.amount : acc - t.amount, 0);
      },
      getTotalIncome: () => {
        return (get().transactions || []).filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
      },
      getTotalExpenses: () => {
        return (get().transactions || []).filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
      },
      getCategorySpending: (category) => {
        return (get().transactions || [])
          .filter(t => t.type === 'expense' && t.category === category)
          .reduce((acc, t) => acc + t.amount, 0);
      },
      deleteAccount: (id) => {
        const currentBalance = get().getAccountBalance(id);
        
        // If there's a balance, we add a "Closure Balance Offset" transaction
        // to bring the account (and thus total net worth) to 0 for this account.
        if (currentBalance !== 0) {
          get().addTransaction({
            title: `Account Closure: ${get().accounts.find(a => a.id === id)?.name || 'Account'}`,
            amount: Math.abs(currentBalance),
            category: 'Closure',
            date: new Date().toISOString(),
            type: currentBalance > 0 ? 'expense' : 'income', // If positive balance, we "spend" it to zero it.
            iconName: 'other',
            accountId: id
          });
        }

        set((state) => ({
          accounts: state.accounts.map(a => a.id === id ? { ...a, isDeleted: true } : a)
        }));
      },
      addCustomCategory: (category) => set((state) => {
        const icon = category.name.charAt(0).toUpperCase();
        return {
          customCategories: [
            ...state.customCategories,
            { ...category, id: Math.random().toString(36).substring(7), icon }
          ]
        };
      }),
      deleteCustomCategory: (id: string) => set((state) => ({
        customCategories: state.customCategories.filter(c => c.id !== id)
      })),
      renameBudget: (oldName, newName) => set((state) => {
        const newBudgets = { ...state.budgets };
        if (newBudgets[oldName] !== undefined) {
          const limit = newBudgets[oldName];
          delete newBudgets[oldName];
          newBudgets[newName] = limit;
        }
        
        return { budgets: newBudgets };
      }),
      removeBudget: (name) => set((state) => {
        const newBudgets = { ...state.budgets };
        delete newBudgets[name];
        return { budgets: newBudgets };
      }),
      addGoal: (goal) => set((state) => ({
        goals: [...state.goals, { ...goal, id: Math.random().toString(36).substring(7) }]
      })),
      updateGoal: (id, updates) => set((state) => ({
        goals: state.goals.map(g => g.id === id ? { ...g, ...updates } : g)
      })),
      deleteGoal: (id) => set((state) => ({
        goals: state.goals.filter(g => g.id !== id)
      })),
      contributeToGoal: (goalId, amount, accountId) => set((state) => {
        // Find the account to deduct from
        const account = state.accounts.find(a => a.id === accountId);
        if (!account) return state;

        // In a "real" world, we'd record this as a transfer, 
        // but per user request, goal transactions are separate.
        // We'll just update the goal and the account's internal "implied" balance 
        // by creating a special transaction or adjusting balance.
        // Actually, we'll create a system transaction with a special flag 
        // to keep net worth accurate while separating it from regular expenses.
        
        const contributionTx: Transaction = {
          id: Math.random().toString(36).substring(7),
          title: `Goal Contribution: ${state.goals.find(g => g.id === goalId)?.name}`,
          amount: amount,
          category: 'Savings',
          date: new Date().toISOString(),
          type: 'expense',
          iconName: 'Trophy',
          accountId: accountId,
        };

        return {
          goals: state.goals.map(g => g.id === goalId ? { ...g, savedAmount: g.savedAmount + amount } : g),
          transactions: [...state.transactions, contributionTx]
        };
      }),
      resetAllData: () => set({
        transactions: [],
        accounts: INITIAL_ACCOUNTS,
        customCategories: [],
        budgets: {},
        goals: [],
        userName: '',
        isOnboarded: false
      }),
      getFilteredTransactions: (rangeType, date, customRange) => {
        const txs = get().transactions || [];
        if (rangeType === 'all') return txs;

        if (rangeType === 'custom' && customRange) {
          const start = new Date(customRange.start).getTime();
          const end = new Date(customRange.end).getTime();
          return txs.filter(t => {
            const time = new Date(t.date).getTime();
            return time >= start && time <= end;
          });
        }

        const year = date.getFullYear();
        const month = date.getMonth();

        return txs.filter(t => {
          const tDate = new Date(t.date);
          if (rangeType === 'month') {
            return tDate.getFullYear() === year && tDate.getMonth() === month;
          } else if (rangeType === 'year') {
            return tDate.getFullYear() === year;
          }
          return true;
        });
      },
      getCategoryBreakdown: (filteredTxs) => {
        const total = filteredTxs.reduce((sum, t) => sum + t.amount, 0);
        if (total === 0) return [];

        const breakdown = filteredTxs.reduce((acc: any, t) => {
          acc[t.category] = (acc[t.category] || 0) + t.amount;
          return acc;
        }, {});

        return Object.entries(breakdown).map(([label, amount]: any) => ({
          label,
          amount,
          value: (amount / total) * 100
        })).sort((a, b) => b.amount - a.amount);
      },
      getTrendData: (rangeType, date, customRange) => {
        const txs = get().transactions || [];
        const year = date.getFullYear();
        const month = date.getMonth();
        
        let periods: { label: string, start: Date, end: Date }[] = [];

        if (rangeType === 'custom' && customRange) {
          // For custom range, we'll try to show it daily if small enough, else monthly
          const start = new Date(customRange.start);
          const end = new Date(customRange.end);
          const diffDays = Math.ceil(Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
          
          if (diffDays <= 31) {
            periods = Array.from({ length: diffDays + 1 }, (_, i) => {
              const d = new Date(start);
              d.setDate(start.getDate() + i);
              return {
                label: d.getDate().toString().padStart(2, '0'),
                start: new Date(d.setHours(0, 0, 0, 0)),
                end: new Date(d.setHours(23, 59, 59, 999))
              };
            });
          } else {
            // Placeholder: Show 5 intervals if range is large
            const interval = Math.floor(diffDays / 5);
            periods = Array.from({ length: 6 }, (_, i) => {
              const s = new Date(start);
              s.setDate(start.getDate() + (i * interval));
              const e = new Date(s);
              e.setDate(s.getDate() + interval - 1);
              return {
                label: s.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
                start: s,
                end: e
              };
            });
          }
        } else if (rangeType === 'month') {
          const daysInMonth = new Date(year, month + 1, 0).getDate();
          periods = Array.from({ length: daysInMonth }, (_, i) => {
            const d = new Date(year, month, i + 1);
            return {
              label: (i + 1).toString().padStart(2, '0'),
              start: new Date(year, month, i + 1, 0, 0, 0),
              end: new Date(year, month, i + 1, 23, 59, 59)
            };
          });
        } else if (rangeType === 'year') {
          periods = Array.from({ length: 12 }, (_, i) => ({
            label: new Date(0, i).toLocaleString('default', { month: 'short' }),
            start: new Date(year, i, 1, 0, 0, 0),
            end: new Date(year, i + 1, 0, 23, 59, 59)
          }));
        } else {
          // All Time - show last 5 years or since first transaction
          const firstTxDate = txs.length > 0 
            ? new Date(Math.min(...txs.map(t => new Date(t.date).getTime())))
            : new Date();
          const startYear = firstTxDate.getFullYear();
          const endYear = new Date().getFullYear();
          const years = Math.max(endYear - startYear + 1, 1);
          
          periods = Array.from({ length: years }, (_, i) => ({
            label: (startYear + i).toString(),
            start: new Date(startYear + i, 0, 1, 0, 0, 0),
            end: new Date(startYear + i, 11, 31, 23, 59, 59)
          }));
        }

        return periods.map(period => {
          const periodTxs = txs.filter(t => {
            const d = new Date(t.date);
            return d >= period.start && d <= period.end;
          });

          const incomeCategories: { [name: string]: number } = {};
          const expenseCategories: { [name: string]: number } = {};
          let income = 0;
          let expense = 0;

          periodTxs.forEach(t => {
            if (t.type === 'income') {
              income += t.amount;
              incomeCategories[t.category] = (incomeCategories[t.category] || 0) + t.amount;
            } else {
              expense += t.amount;
              expenseCategories[t.category] = (expenseCategories[t.category] || 0) + t.amount;
            }
          });

          const sortCats = (cats: { [name: string]: number }) => 
            Object.entries(cats)
              .map(([name, amount]) => ({ name, amount }))
              .sort((a, b) => b.amount - a.amount);

          return {
            label: period.label,
            income,
            expense,
            incomeCategories: sortCats(incomeCategories),
            expenseCategories: sortCats(expenseCategories)
          };
        });
      }
    }),
    {
      name: 'expenzo-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
