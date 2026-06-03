export type CategoryType = 'income' | 'expense';

export interface Category {
  id: string;
  name: string;
  icon: string;
  type: CategoryType;
}

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'none_income', name: 'None', icon: 'Minus', type: 'income' },
  // --- INCOME CATEGORIES ---
  { id: 'inc_bonus', name: 'Bonus', icon: 'Award', type: 'income' },
  { id: 'inc_interest', name: 'Interest Income', icon: 'Percent', type: 'income' },
  { id: 'inc_investment', name: 'Investment', icon: 'TrendingUp', type: 'income' },
  { id: 'inc_pocket', name: 'Pocket Money', icon: 'Coins', type: 'income' },
  { id: 'inc_reimburse', name: 'Reimbursement', icon: 'Receipt', type: 'income' },
  { id: 'inc_rental', name: 'Rental Income', icon: 'Home', type: 'income' },
  { id: 'inc_returned', name: 'Returned Purchase', icon: 'RotateCcw', type: 'income' },
  { id: 'inc_salary', name: 'Salary', icon: 'Banknote', type: 'income' },
  { id: 'inc_saving', name: 'Saving', icon: 'PiggyBank', type: 'income' },
  { id: 'inc_uncounted', name: 'Uncounted', icon: 'HelpCircle', type: 'income' },

  { id: 'none_expense', name: 'None', icon: 'Minus', type: 'expense' },
  // --- EXPENSE CATEGORIES ---
  // Food & Dining
  { id: 'exp_groceries', name: 'Groceries', icon: 'ShoppingBasket', type: 'expense' },
  { id: 'exp_dining', name: 'Dining', icon: 'Utensils', type: 'expense' },
  { id: 'exp_coffee', name: 'Coffee', icon: 'Coffee', type: 'expense' },
  { id: 'exp_snacks', name: 'Snack', icon: 'Cookie', type: 'expense' },
  { id: 'exp_pizza', name: 'Pizza', icon: 'Pizza', type: 'expense' },
  { id: 'exp_cake', name: 'Cake', icon: 'Cake', type: 'expense' },
  { id: 'exp_ice_cream', name: 'Ice Cream', icon: 'IceCream', type: 'expense' },
  { id: 'exp_milk', name: 'Milk', icon: 'Milk', type: 'expense' },
  { id: 'exp_fruits', name: 'Fruits', icon: 'Apple', type: 'expense' },
  { id: 'exp_veg', name: 'Vegetables', icon: 'Carrot', type: 'expense' },
  { id: 'exp_drinks', name: 'Drinks', icon: 'GlassWater', type: 'expense' },

  // Transport
  { id: 'exp_auto', name: 'Auto & Transport', icon: 'Car', type: 'expense' },
  { id: 'exp_bus', name: 'Bus Fare', icon: 'Bus', type: 'expense' },
  { id: 'exp_taxi', name: 'Taxi', icon: 'Car', type: 'expense' },
  { id: 'exp_train', name: 'Train', icon: 'Train', type: 'expense' },
  { id: 'exp_petrol', name: 'Petrol/Gas', icon: 'Fuel', type: 'expense' },
  { id: 'exp_toll', name: 'Toll', icon: 'Road', type: 'expense' },
  { id: 'exp_air', name: 'Air tickets', icon: 'Plane', type: 'expense' },
  { id: 'exp_bike', name: 'Bike', icon: 'Bike', type: 'expense' },

  // Home & Utilities
  { id: 'exp_rent', name: 'Rent', icon: 'Key', type: 'expense' },
  { id: 'exp_maintenance', name: 'Maintenance', icon: 'Wrench', type: 'expense' },
  { id: 'exp_household', name: 'Household', icon: 'Home', type: 'expense' },
  { id: 'exp_laundry', name: 'Laundry', icon: 'Waves', type: 'expense' },
  { id: 'exp_electricity', name: 'Electricity', icon: 'Zap', type: 'expense' },
  { id: 'exp_water', name: 'Water', icon: 'Droplet', type: 'expense' },
  { id: 'exp_internet', name: 'Internet', icon: 'Globe', type: 'expense' },
  { id: 'exp_cable', name: 'Cable', icon: 'Tv', type: 'expense' },
  { id: 'exp_mobile', name: 'Mobile', icon: 'Smartphone', type: 'expense' },
  { id: 'exp_recharge', name: 'Mobile Recharge', icon: 'Smartphone', type: 'expense' },

  // Finance & Loans
  { id: 'exp_taxes', name: 'Taxes', icon: 'Landmark', type: 'expense' },
  { id: 'exp_emi', name: 'EMI', icon: 'CalendarClock', type: 'expense' },
  { id: 'exp_car_loan', name: 'Car Loan', icon: 'CarFront', type: 'expense' },
  { id: 'exp_edu_loan', name: 'Education', icon: 'GraduationCap', type: 'expense' },
  { id: 'exp_home_loan', name: 'Home Loan', icon: 'Home', type: 'expense' },
  { id: 'exp_pers_loan', name: 'Personal Loan', icon: 'HandCoins', type: 'expense' },
  { id: 'exp_cc_bill', name: 'CC Bill Payment', icon: 'CreditCard', type: 'expense' },
  { id: 'exp_atm', name: 'ATM', icon: 'CreditCard', type: 'expense' },
  { id: 'exp_finance', name: 'Finance', icon: 'BarChart', type: 'expense' },

  // Personal, Health & Entertainment
  { id: 'exp_health', name: 'Health', icon: 'Activity', type: 'expense' },
  { id: 'exp_medicines', name: 'Medicines', icon: 'Pill', type: 'expense' },
  { id: 'exp_fitness', name: 'Fitness', icon: 'Dumbbell', type: 'expense' },
  { id: 'exp_salon', name: 'Salon', icon: 'Scissors', type: 'expense' },
  { id: 'exp_beauty', name: 'Beauty', icon: 'Smile', type: 'expense' },
  { id: 'exp_personal_care', name: 'Personal Care', icon: 'Heart', type: 'expense' },
  { id: 'exp_clothing', name: 'Clothing', icon: 'Shirt', type: 'expense' },
  { id: 'exp_shopping', name: 'Shopping', icon: 'ShoppingBag', type: 'expense' },
  { id: 'exp_electronics', name: 'Electronics', icon: 'Cpu', type: 'expense' },
  { id: 'exp_movie', name: 'Movie', icon: 'Film', type: 'expense' },
  { id: 'exp_games', name: 'Games', icon: 'Gamepad2', type: 'expense' },
  { id: 'exp_festivals', name: 'Festivals', icon: 'PartyPopper', type: 'expense' },
  { id: 'exp_vacation', name: 'Vacation', icon: 'Palmtree', type: 'expense' },
  { id: 'exp_books', name: 'Books', icon: 'Book', type: 'expense' },
  { id: 'exp_toys', name: 'Toys', icon: 'Gamepad', type: 'expense' },

  // Education & Work
  { id: 'exp_edu', name: 'Education', icon: 'School', type: 'expense' },
  { id: 'exp_work', name: 'Work', icon: 'Briefcase', type: 'expense' },
  { id: 'exp_stationery', name: 'Stationery', icon: 'Pencil', type: 'expense' },
  { id: 'exp_printing', name: 'Printing', icon: 'Printer', type: 'expense' },

  // Others
  { id: 'exp_gifts', name: 'Gifts & Donations', icon: 'Gift', type: 'expense' },
  { id: 'exp_kids', name: 'Kids', icon: 'Baby', type: 'expense' },
  { id: 'exp_pets', name: 'Pet Care', icon: 'Dog', type: 'expense' },
  { id: 'exp_maid', name: 'Maid/Driver', icon: 'User', type: 'expense' },
  { id: 'exp_cigarette', name: 'Cigarette', icon: 'Cigarette', type: 'expense' },
  { id: 'exp_flowers', name: 'Flowers', icon: 'Flower2', type: 'expense' },
  { id: 'exp_misc', name: 'Misc', icon: 'Asterisk', type: 'expense' },
  { id: 'exp_unfound', name: 'Lost/Unfound', icon: 'HelpCircle', type: 'expense' },
];
