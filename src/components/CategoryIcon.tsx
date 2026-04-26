import React from 'react';
import * as Icons from 'lucide-react-native';
import Typography from './Typography';
import { View, StyleProp, ViewStyle } from 'react-native';

interface CategoryIconProps {
  name: string;
  iconName?: string; // Potential Lucide icon name
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

const CategoryIcon: React.FC<CategoryIconProps> = ({ 
  name, 
  iconName, 
  size = 24, 
  color = '#000',
  style
}) => {
  // Try to find the Lucide icon
  const IconComponent = iconName ? (Icons as any)[iconName] : null;

  if (IconComponent) {
    return <IconComponent size={size} color={color} style={style} />;
  }

  // Fallback to heuristic based on name
  const heuristicIcon = getIconByNameHeuristic(name);
  const FinalIcon = heuristicIcon ? (Icons as any)[heuristicIcon] : null;

  if (FinalIcon) {
    return <FinalIcon size={size} color={color} style={style} />;
  }

  // Final fallback to first letter
  const firstLetter = name.trim().charAt(0).toUpperCase() || '?';
  
  return (
    <View style={[{ justifyContent: 'center', alignItems: 'center' }, style]}>
      <Typography 
        variant="h3" 
        style={{ 
          color, 
          fontSize: size * 0.8,
          lineHeight: size
        }}
      >
        {firstLetter}
      </Typography>
    </View>
  );
};

// Heuristic mapping from existing logic
const getIconByNameHeuristic = (name: string): string | null => {
  const l = name.toLowerCase().trim();
  if (l.includes('food') || l.includes('dining') || l.includes('eat') || l.includes('restaurant')) return 'Utensils';
  if (l.includes('milk')) return 'GlassWater';
  if (l.includes('hous') || l.includes('rent') || l.includes('stay') || l.includes('home')) return 'Home';
  if (l.includes('transport') || l.includes('cab') || l.includes('uber') || l.includes('taxi') || l.includes('car')) return 'Car';
  if (l.includes('bus') || l.includes('travel')) return 'Bus';
  if (l.includes('shop') || l.includes('buy') || l.includes('cloth')) return 'ShoppingBag';
  if (l.includes('grocer')) return 'ShoppingCart';
  if (l.includes('medic') || l.includes('doctor') || l.includes('pill')) return 'Pill';
  if (l.includes('health') || l.includes('hospital')) return 'Activity';
  if (l.includes('ent') || l.includes('movie') || l.includes('game')) return 'Play';
  if (l.includes('drink') || l.includes('bar')) return 'GlassWater';
  if (l.includes('salon') || l.includes('beauty') || l.includes('barber')) return 'Sparkles';
  if (l.includes('edu') || l.includes('school') || l.includes('course') || l.includes('book')) return 'BookOpen';
  if (l.includes('salary') || l.includes('income') || l.includes('pay') || l.includes('earn') || l.includes('work') || l.includes('wage')) return 'Banknote';
  if (l.includes('freelance') || l.includes('side hustle') || l.includes('project')) return 'Laptop';
  if (l.includes('gift') || l.includes('reward') || l.includes('bonus') || l.includes('prize')) return 'Gift';
  if (l.includes('refund') || l.includes('cashback')) return 'Undo2';
  if (l.includes('invest') || l.includes('stock') || l.includes('div') || l.includes('profit') || l.includes('asset')) return 'TrendingUp';
  if (l.includes('interest') || l.includes('commission') || l.includes('royalty')) return 'HandCoins';
  if (l.includes('saving')) return 'PiggyBank';
  if (l.includes('loan') || l.includes('debt') || l.includes('emi') || l.includes('mortgage')) return 'Landmark';
  if (l.includes('bill') || l.includes('recharge') || l.includes('utilit')) return 'Receipt';
  if (l.includes('electric') || l.includes('tech') || l.includes('monitor') || l.includes('gadget')) return 'Monitor';
  if (l.includes('cash') || l.includes('money')) return 'Wallet';
  return null;
};

export default CategoryIcon;
