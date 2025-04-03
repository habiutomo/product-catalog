import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface EmptyStateViewProps {
  message: string;
  icon?: string;
  action?: () => void;
  actionText?: string;
}

const EmptyStateView: React.FC<EmptyStateViewProps> = ({
  message,
  icon = 'inbox',
  action,
  actionText = 'Retry',
}) => {
  return (
    <View style={styles.container} testID="empty-state-view">
      <MaterialIcons name={icon as any} size={64} color="#ccc" />
      <Text style={styles.message}>{message}</Text>
      {action && (
        <TouchableOpacity
          style={styles.actionButton}
          onPress={action}
          testID="empty-state-action-button"
        >
          <Text style={styles.actionButtonText}>{actionText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  actionButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EmptyStateView;