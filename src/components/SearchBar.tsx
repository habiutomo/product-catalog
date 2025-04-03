import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { debounce } from '../utils/performance';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChangeText }) => {
  // Create a debounced version of the onChangeText function to improve performance
  const debouncedChangeText = React.useMemo(
    () => debounce(onChangeText, 300),
    [onChangeText]
  );

  // Handle text changes and use the debounced function
  const handleTextChange = (text: string) => {
    debouncedChangeText(text);
  };

  // Clear the search input
  const handleClearSearch = () => {
    onChangeText('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={22} color="#5C6AC4" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Search products..."
          placeholderTextColor="#aaaaaa"
          value={value}
          onChangeText={handleTextChange}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {value.length > 0 && (
          <TouchableOpacity onPress={handleClearSearch} style={styles.clearButton}>
            <MaterialIcons name="close" size={16} color="#666" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 46,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  icon: {
    marginRight: 8,
    color: '#5C6AC4',
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    padding: 0,
    fontWeight: '400',
  },
  clearButton: {
    padding: 4,
    backgroundColor: '#eeeeee',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SearchBar;