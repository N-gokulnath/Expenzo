import * as LucideIcons from 'lucide-react-native';
import React from 'react';

export const getCategoryTheme = (label: string, colors: any, type: 'income' | 'expense' = 'expense') => {
  const l = label.toLowerCase().trim();
  
  // Color Mapping logic works for both Income and Expense
  let color = colors.chart.other;
  if (l.includes('food') || l.includes('dining') || l.includes('eat') || l.includes('restaurant')) color = colors.chart.food;
  else if (l.includes('hous') || l.includes('rent') || l.includes('stay') || l.includes('home')) color = colors.chart.housing;
  else if (l.includes('transport') || l.includes('cab') || l.includes('uber') || l.includes('taxi') || l.includes('car') || l.includes('bus') || l.includes('travel')) color = colors.chart.transport;
  else if (l.includes('shop') || l.includes('grocer') || l.includes('buy') || l.includes('cloth')) color = (colors.chart as any).shopping || '#FF4081';
  else if (l.includes('health') || l.includes('medic') || l.includes('doctor') || l.includes('hospital')) color = (colors.chart as any).health || '#F44336';
  else if (l.includes('edu') || l.includes('school') || l.includes('course') || l.includes('book')) color = (colors.chart as any).education || '#7C4DFF';
  else if (l.includes('ent') || l.includes('movie') || l.includes('game') || l.includes('drink') || l.includes('fun')) color = (colors.chart as any).entertainment || '#FFD740';
  else if (l.includes('salary') || l.includes('income') || l.includes('pay') || l.includes('earn') || l.includes('work') || l.includes('wage')) color = (colors.chart as any).salary || '#1DE9B6';
  else if (l.includes('freelance') || l.includes('side hustle') || l.includes('gig') || l.includes('project')) color = '#00BFA5';
  else if (l.includes('bonus') || l.includes('incentive') || l.includes('prize') || l.includes('gift')) color = '#FFD740';
  else if (l.includes('interest') || l.includes('dividend') || l.includes('royalty') || l.includes('commission')) color = '#00E5FF';
  else if (l.includes('bill') || l.includes('recharge') || l.includes('electric') || l.includes('water')) color = (colors.chart as any).bills || '#64B5F6';
  else if (l.includes('elec') || l.includes('gadget') || l.includes('tech')) color = (colors.chart as any).electronics || '#FF9100';
  else if (l.includes('gift') || l.includes('reward') || l.includes('bonus')) color = '#FFD740';
  else if (l.includes('refund') || l.includes('cashback')) color = '#00C853';
  else if (l.includes('invest') || l.includes('stock') || l.includes('div') || l.includes('profit') || l.includes('saving') || l.includes('asset')) color = '#2979FF';
  else if (l.includes('loan') || l.includes('debt') || l.includes('emi') || l.includes('mortgage')) color = '#FF5252';
  else if (l.includes('salon') || l.includes('beauty') || l.includes('barber') || l.includes('cut')) color = '#E040FB';
  else if (l.includes('rent') && type === 'income') color = '#AA00FF'; // Rental income

  // Icon Mapping logic works for both Income and Expense
  let iconName = 'LayoutGrid';
  if (l.includes('food') || l.includes('dining') || l.includes('eat') || l.includes('restaurant')) iconName = 'Utensils';
  else if (l.includes('milk')) iconName = 'GlassWater';
  else if (l.includes('hous') || l.includes('rent') || l.includes('stay') || l.includes('home')) iconName = 'Home';
  else if (l.includes('transport') || l.includes('cab') || l.includes('uber') || l.includes('taxi') || l.includes('car')) iconName = 'Car';
  else if (l.includes('bus') || l.includes('travel')) iconName = 'Bus';
  else if (l.includes('shop') || l.includes('buy') || l.includes('cloth')) iconName = 'ShoppingBag';
  else if (l.includes('grocer')) iconName = 'ShoppingCart';
  else if (l.includes('medic') || l.includes('doctor') || l.includes('pill')) iconName = 'Pill';
  else if (l.includes('health') || l.includes('hospital')) iconName = 'Activity';
  else if (l.includes('ent') || l.includes('movie') || l.includes('game')) iconName = 'Play';
  else if (l.includes('drink') || l.includes('bar')) iconName = 'GlassWater';
  else if (l.includes('salon') || l.includes('beauty') || l.includes('barber')) iconName = 'Sparkles';
  else if (l.includes('edu') || l.includes('school') || l.includes('course') || l.includes('book')) iconName = 'BookOpen';
  else if (l.includes('salary') || l.includes('income') || l.includes('pay') || l.includes('earn') || l.includes('work') || l.includes('wage')) iconName = 'Banknote';
  else if (l.includes('freelance') || l.includes('side hustle') || l.includes('project')) iconName = 'Laptop';
  else if (l.includes('gift') || l.includes('reward') || l.includes('bonus') || l.includes('prize')) iconName = 'Gift';
  else if (l.includes('refund') || l.includes('cashback')) iconName = 'Undo2';
  else if (l.includes('invest') || l.includes('stock') || l.includes('div') || l.includes('profit') || l.includes('asset')) iconName = 'TrendingUp';
  else if (l.includes('interest') || l.includes('commission') || l.includes('royalty')) iconName = 'HandCoins';
  else if (l.includes('saving')) iconName = 'PiggyBank';
  else if (l.includes('loan') || l.includes('debt') || l.includes('emi') || l.includes('mortgage')) iconName = 'Landmark';
  else if (l.includes('bill') || l.includes('recharge') || l.includes('utilit')) iconName = 'Receipt';
  else if (l.includes('electric') || l.includes('tech') || l.includes('monitor') || l.includes('gadget')) iconName = 'Monitor';
  else if (l.includes('rent') && type === 'income') iconName = 'Building2';
  else if (l.includes('cash') || l.includes('money')) iconName = 'Wallet';

  return { color, iconName };
};

export default getCategoryTheme;
