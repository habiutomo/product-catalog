import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Product } from '../types';

// Sample cart items for initial development
const sampleCartItems = [
  {
    product: {
      id: 1,
      title: "iPhone 9",
      description: "An apple mobile which is nothing like apple",
      price: 549,
      discountPercentage: 12.96,
      rating: 4.69,
      stock: 94,
      brand: "Apple",
      category: "smartphones",
      thumbnail: "https://i.dummyjson.com/data/products/1/thumbnail.jpg",
      images: [
        "https://i.dummyjson.com/data/products/1/1.jpg",
        "https://i.dummyjson.com/data/products/1/2.jpg",
      ]
    },
    quantity: 2
  },
  {
    product: {
      id: 2,
      title: "iPhone X",
      description: "SIM-Free, Model A19211 6.5-inch Super Retina HD display with OLED technology",
      price: 899,
      discountPercentage: 17.94,
      rating: 4.44,
      stock: 34,
      brand: "Apple",
      category: "smartphones",
      thumbnail: "https://i.dummyjson.com/data/products/2/thumbnail.jpg",
      images: [
        "https://i.dummyjson.com/data/products/2/1.jpg",
        "https://i.dummyjson.com/data/products/2/2.jpg",
      ]
    },
    quantity: 2
  },
  {
    product: {
      id: 3,
      title: "Samsung Universe 9",
      description: "Samsung's new variant which goes beyond Galaxy",
      price: 1249,
      discountPercentage: 15.46,
      rating: 4.09,
      stock: 36,
      brand: "Samsung",
      category: "smartphones",
      thumbnail: "https://i.dummyjson.com/data/products/3/thumbnail.jpg",
      images: ["https://i.dummyjson.com/data/products/3/1.jpg"]
    },
    quantity: 2
  },
  {
    product: {
      id: 4,
      title: "OPPOF19",
      description: "OPPO F19 is officially announced on April 2021.",
      price: 280,
      discountPercentage: 17.91,
      rating: 4.3,
      stock: 123,
      brand: "OPPO",
      category: "smartphones",
      thumbnail: "https://i.dummyjson.com/data/products/4/thumbnail.jpg",
      images: [
        "https://i.dummyjson.com/data/products/4/1.jpg",
        "https://i.dummyjson.com/data/products/4/2.jpg",
      ]
    },
    quantity: 2
  }
];

interface CartItem {
  product: Product;
  quantity: number;
}

const CartScreen = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>(sampleCartItems);
  
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  };

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity <= 0) return;
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.product.id === id 
          ? {...item, quantity: newQuantity} 
          : item
      )
    );
  };

  const renderCartItem = ({item}: {item: CartItem}) => (
    <View style={styles.cartItem}>
      <TouchableOpacity style={styles.checkbox}>
        <View style={styles.checkedBox}>
          <Text style={styles.checkmark}>✓</Text>
        </View>
      </TouchableOpacity>
      
      <Image source={{ uri: item.product.thumbnail }} style={styles.productImage} />
      
      <View style={styles.productInfo}>
        <Text style={styles.productTitle} numberOfLines={1}>{item.product.title}</Text>
        <Text style={styles.productPrice}>Total price</Text>
        
        <View style={styles.quantityControl}>
          <TouchableOpacity 
            style={styles.quantityButton} 
            onPress={() => updateQuantity(item.product.id, item.quantity - 1)}
          >
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          
          <Text style={styles.quantity}>{item.quantity}</Text>
          
          <TouchableOpacity 
            style={styles.quantityButton} 
            onPress={() => updateQuantity(item.product.id, item.quantity + 1)}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Shopping Cart</Text>
      
      <FlatList
        data={cartItems}
        renderItem={renderCartItem}
        keyExtractor={(item) => item.product.id.toString()}
        contentContainerStyle={styles.cartList}
      />
      
      <TouchableOpacity style={styles.checkoutButton}>
        <Text style={styles.checkoutButtonText}>
          Checkout (Sub Total)
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
  },
  cartList: {
    paddingHorizontal: 16,
  },
  cartItem: {
    flexDirection: 'row',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  checkbox: {
    marginRight: 10,
  },
  checkedBox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#333',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  productImage: {
    width: 80,
    height: 80,
    backgroundColor: '#f0f0f0',
    marginRight: 16,
  },
  productInfo: {
    flex: 1,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  productPrice: {
    color: '#666',
    marginBottom: 8,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  quantity: {
    fontSize: 18,
    marginHorizontal: 12,
  },
  checkoutButton: {
    backgroundColor: '#4a90e2',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CartScreen;