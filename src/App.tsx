import React from 'react';
import {
  Platform,
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import AppNavigator from './navigation/AppNavigator';

// Polyfill for setImmediate in web environment
import './polyfills';

console.log('Starting App component render');
console.log('Platform:', Platform.OS);

const App = () => {
  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
};

export default App;