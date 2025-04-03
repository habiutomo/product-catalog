import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Dimensions
} from 'react-native';

interface CategoryTabsProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  // Convert category name to title case
  const formatCategoryName = (name: string): string => {
    return name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        testID="category-scroll-view"
      >
        <TouchableOpacity
          style={[
            styles.tab,
            selectedCategory === 'all' && styles.selectedTab,
          ]}
          onPress={() => onSelectCategory('all')}
          activeOpacity={0.7}
          testID="all-category-tab"
        >
          <Text
            style={[
              styles.tabText,
              selectedCategory === 'all' && styles.selectedTabText,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>

        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.tab,
              selectedCategory === category && styles.selectedTab,
            ]}
            onPress={() => onSelectCategory(category)}
            activeOpacity={0.7}
            testID={`${category}-tab`}
          >
            <Text
              style={[
                styles.tabText,
                selectedCategory === category && styles.selectedTabText,
              ]}
            >
              {formatCategoryName(category)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  scrollContent: {
    paddingHorizontal: 0,
    paddingBottom: 4,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e8e8e8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 1,
    elevation: 1,
  },
  selectedTab: {
    backgroundColor: '#5C6AC4',
    borderColor: '#4959b9',
  },
  tabText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  selectedTabText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default CategoryTabs;