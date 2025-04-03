import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Feather';
import ProductListScreen from '../screens/ProductListScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import CartScreen from '../screens/CartScreen';
import {useSelector} from 'react-redux';
import {RootState} from '../types';
import {Text, View} from 'react-native';

// Define types for navigation
export type RootStackParamList = {
  Home: undefined;
  ProductDetail: {productId: number};
};

export type BottomTabParamList = {
  Products: undefined;
  Cart: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<BottomTabParamList>();

// ProductStack contains the product list and detail screens
const ProductStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#f5f5f5',
        },
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <Stack.Screen
        name="Home"
        component={ProductListScreen}
        options={{title: 'Products'}}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{title: 'Product Details'}}
      />
    </Stack.Navigator>
  );
};

const AppNavigator = () => {
  // Get cart items count for badge
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const cartItemsCount = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#5C6AC4',
          tabBarInactiveTintColor: '#949494',
          tabBarStyle: {
            height: 60,
            paddingBottom: 10,
            paddingTop: 10,
          },
          headerShown: false,
        }}>
        <Tab.Screen
          name="Products"
          component={ProductStack}
          options={{
            tabBarIcon: ({color, size}) => (
              <Icon name="shopping-bag" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Cart"
          component={CartScreen}
          options={{
            tabBarIcon: ({color, size}) => (
              <Icon name="shopping-cart" size={size} color={color} />
            ),
            tabBarBadge: cartItemsCount > 0 ? cartItemsCount : undefined,
            tabBarBadgeStyle: {
              backgroundColor: '#FF6B6B',
              fontSize: 12,
            },
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
