import React, { useState, useMemo } from 'react';
import { 
  View, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  TextInput, 
  FlatList, 
  Dimensions 
} from 'react-native';
import { X, Search, Plus } from 'lucide-react-native';
import * as LucideIcons from 'lucide-react-native';
import Typography from './Typography';
import { THEME, LIGHT_COLORS, DARK_COLORS } from '../theme/theme';
import { useTransactionStore } from '../store/useTransactionStore';
import { DEFAULT_CATEGORIES, Category } from '../constants/categories';
import AddCategoryModal from './AddCategoryModal';

const SCREEN_WIDTH = Dimensions.get('window').width;
const COLUMN_COUNT = 4;
const ITEM_SIZE = (SCREEN_WIDTH - 32 - (THEME.spacing.md * (COLUMN_COUNT - 1))) / COLUMN_COUNT;

interface CategorySelectModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (category: { name: string; icon: string; isCustom?: boolean }) => void;
  type: 'income' | 'expense';
}

const CategorySelectModal: React.FC<CategorySelectModalProps> = ({
  visible,
  onClose,
  onSelect,
  type,
}) => {
  const { theme, customCategories } = useTransactionStore();
  const colors = theme === 'light' ? LIGHT_COLORS : DARK_COLORS;
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);

  const filteredCategories = useMemo(() => {
    const all = [
      ...DEFAULT_CATEGORIES.filter(c => c.type === type),
      ...customCategories.filter(c => c.type === type).map(c => ({
        id: c.id,
        name: c.name,
        icon: c.icon,
        type: c.type,
        isCustom: true
      }))
    ];

    if (!searchQuery) return all;
    return all.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [type, searchQuery, customCategories]);

  const renderCategoryItem = ({ item }: { item: any }) => {
    const IconComponent = (LucideIcons as any)[item.icon];
    const isLetterIcon = item.isCustom && item.icon.length === 1;

    return (
      <TouchableOpacity 
        style={[styles.categoryItem, { width: ITEM_SIZE }]}
        onPress={() => onSelect({ name: item.name, icon: item.icon, isCustom: item.isCustom })}
      >
        <View style={[styles.iconContainer, { backgroundColor: colors.surfaceLight }]}>
          {isLetterIcon ? (
            <Typography variant="h3" bold color={colors.textPrimary}>{item.icon}</Typography>
          ) : (
            IconComponent ? <IconComponent size={24} color={colors.textPrimary} strokeWidth={2} /> : null
          )}
        </View>
        <Typography variant="caption" color={colors.textSecondary} numberOfLines={1} style={styles.categoryName}>
          {item.name}
        </Typography>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Typography variant="h3" bold>Select Category</Typography>
          <TouchableOpacity 
            onPress={() => setIsAddModalVisible(true)}
            style={styles.headerAddButton}
          >
            <Plus size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <View style={[styles.searchBar, { backgroundColor: colors.surfaceLight }]}>
            <Search size={20} color={colors.textSecondary} style={styles.searchIcon} />
            <TextInput
              style={[styles.searchInput, { color: colors.textPrimary }]}
              placeholder="Search category..."
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <X size={18} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* List */}
        <FlatList
          data={filteredCategories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.id}
          numColumns={COLUMN_COUNT}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Typography color={colors.textSecondary}>No categories found</Typography>
            </View>
          }
        />
        <AddCategoryModal 
          visible={isAddModalVisible}
          onClose={() => setIsAddModalVisible(false)}
          initialType={type}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.md,
    borderBottomWidth: 1,
  },
  closeButton: {
    padding: 4,
  },
  searchContainer: {
    padding: THEME.spacing.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing.md,
    height: 48,
    borderRadius: THEME.borderRadius.md,
  },
  searchIcon: {
    marginRight: THEME.spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    height: '100%',
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  columnWrapper: {
    gap: THEME.spacing.md,
    marginBottom: THEME.spacing.lg,
  },
  categoryItem: {
    alignItems: 'center',
    gap: THEME.spacing.xs,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryName: {
    textAlign: 'center',
    width: '100%',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  headerAddButton: {
    padding: 4,
  }
});

export default CategorySelectModal;
