export const DARK_COLORS = {
  background: '#040F09', // Deepest forest green/black
  surface: '#121C16',    // Dark card surface
  surfaceLight: '#1E2B23', // Lighter surface for highlight
  surfaceDark: '#0A140E',  // Even darker surface for depth
  primary: '#00C853',    // Vibrant Emerald
  secondary: '#FF5252',  // Vibrant Coral/Red
  accent: '#1DB954',
  textPrimary: '#FFFFFF',
  textSecondary: '#8B9B91',
  textMuted: '#5C6A61',
  border: '#24342A',
  black: '#000000',
  success: '#00E676',
  error: '#FF5252',
  warning: '#F59E0B',
  chart: {
    food: '#00C853',
    housing: '#448AFF',
    transport: '#FFAB40',
    shopping: '#FF4081',
    health: '#F44336',
    education: '#7C4DFF',
    entertainment: '#FFD740',
    salary: '#1DE9B6',
    bills: '#64B5F6',
    other: '#9C27B0'
  }
};

export const LIGHT_COLORS = {
  background: '#F8FAFC', // Clean light gray/white
  surface: '#FFFFFF',    // White card surface
  surfaceLight: '#F1F5F9', // Light gray highlight
  surfaceDark: '#E2E8F0',  // Darker gray for depth
  primary: '#00C853',    // Keep branding green
  secondary: '#EF4444',  // Slightly softer red
  accent: '#10B981',
  textPrimary: '#0F172A', // Slate dark
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  border: '#E2E8F0',
  black: '#000000',
  success: '#22C55E',
  error: '#EF4444',
  warning: '#F59E0B',
  chart: {
    food: '#22C55E',
    housing: '#3B82F6',
    transport: '#F59E0B',
    shopping: '#EC4899',
    health: '#EF4444',
    education: '#8B5CF6',
    entertainment: '#FBBF24',
    salary: '#10B981',
    bills: '#38BDF8',
    other: '#A855F7'
  }
};

export const COLORS = DARK_COLORS; // Default to dark emerald

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

export const THEME = {
  colors: COLORS,
  spacing: SPACING,
  borderRadius: {
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40,
    xxxl: 56,
    round: 9999,
  }
};
