import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { CartItem as CartItemType } from '../types';
import { useAppDispatch } from '../redux/hooks';
import { updateQuantityAsync, removeFromCartAsync } from '../redux/slices/cartSlice';
import { formatPrice } from '../utils/performance';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const dispatch = useAppDispatch();

  const handleIncreaseQuantity = () => {
    // @ts-ignore - typing issue with AsyncThunk
    dispatch(updateQuantityAsync({ 
      productId: item.product.id, 
      quantity: item.quantity + 1 
    }));
  };

  const handleDecreaseQuantity = () => {
    if (item.quantity > 1) {
      // @ts-ignore - typing issue with AsyncThunk
      dispatch(updateQuantityAsync({ 
        productId: item.product.id, 
        quantity: item.quantity - 1 
      }));
    } else {
      // @ts-ignore - typing issue with AsyncThunk
      dispatch(removeFromCartAsync(item.product.id));
    }
  };

  const handleRemove = () => {
    // @ts-ignore - typing issue with AsyncThunk
    dispatch(removeFromCartAsync(item.product.id));
  };

  // Calculate discount price
  const discountedPrice =
    item.product.price * (1 - item.product.discountPercentage / 100);
  const totalPrice = discountedPrice * item.quantity;

  return (
    <View style={styles.container}>
      <Image source={{ uri: item.product.thumbnail }} style={styles.image} />
      <View style={styles.infoContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.title} numberOfLines={1}>
            {item.product.title}
          </Text>
          <TouchableOpacity onPress={handleRemove} style={styles.removeButton}>
            <MaterialIcons name="close" size={20} color="#999" />
          </TouchableOpacity>
        </View>
        <Text style={styles.price}>{formatPrice(discountedPrice)}</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={handleDecreaseQuantity}
          >
            <MaterialIcons name="remove" size={18} color="#007bff" />
          </TouchableOpacity>
          <Text style={styles.quantity}>{item.quantity}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={handleIncreaseQuantity}
          >
            <MaterialIcons name="add" size={18} color="#007bff" />
          </TouchableOpacity>
          <Text style={styles.totalPrice}>
            Total: {formatPrice(totalPrice)}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 12,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 4,
    resizeMode: 'cover',
  },
  infoContainer: {
    flex: 1,
    marginLeft: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginBottom: 5,
  },
  removeButton: {
    padding: 2,
  },
  price: {
    fontSize: 16,
    color: '#007bff',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 28,
    height: 28,
    backgroundColor: '#f8f9fa',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  quantity: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 12,
  },
  totalPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 'auto',
  },
});

export default CartItem;