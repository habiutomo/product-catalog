import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Product } from '../types';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { toggleFavoriteAsync, toggleFavorite } from '../redux/slices/favoriteSlice';
import { formatPrice } from '../utils/performance';

interface ProductItemProps {
  product: Product;
  onPress: () => void;
}

const ProductItem: React.FC<ProductItemProps> = ({ product, onPress }) => {
  const dispatch = useAppDispatch();
  const favoriteItems = useAppSelector((state) => state.favorites.items);
  const isFavorite = favoriteItems.includes(product.id);

  const handleToggleFavorite = () => {
    // Use the synchronous version for better UI responsiveness, the async version will update the database
    dispatch(toggleFavorite(product.id));
    dispatch(toggleFavoriteAsync(product.id));
  };

  // Calculate discount price
  const discountedPrice = product.price * (1 - product.discountPercentage / 100);

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.mainContent} 
        onPress={onPress}
        activeOpacity={0.9}
      >
        <View style={styles.imageContainer}>
          <Image source={{ uri: product.thumbnail }} style={styles.image} />
          {product.discountPercentage > 0 && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>
                -{Math.round(product.discountPercentage)}%
              </Text>
            </View>
          )}
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.brand}>{product.brand}</Text>
          <Text style={styles.title} numberOfLines={2}>
            {product.title}
          </Text>
          
          <View style={styles.bottomRow}>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>{formatPrice(discountedPrice)}</Text>
              {product.discountPercentage > 0 && (
                <Text style={styles.originalPrice}>{formatPrice(product.price)}</Text>
              )}
            </View>
            
            <View style={styles.ratingContainer}>
              <MaterialIcons name="star" size={14} color="#F9A825" />
              <Text style={styles.rating}>{product.rating.toFixed(1)}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>

      {/* Favorite button positioned absolutely */}
      <TouchableOpacity 
        onPress={handleToggleFavorite} 
        style={styles.favoriteButton}
        activeOpacity={0.7}
      >
        <MaterialIcons
          name={isFavorite ? 'favorite' : 'favorite-border'}
          size={22}
          color={isFavorite ? '#e91e63' : '#fff'}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    marginHorizontal: 6,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
    position: 'relative',
  },
  mainContent: {
    flex: 1,
    flexDirection: 'column',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 160,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#ff5252',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  discountText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  infoContainer: {
    padding: 12,
    flex: 1,
    justifyContent: 'space-between',
  },
  brand: {
    fontSize: 12,
    color: '#5C6AC4',
    fontWeight: '500',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
    height: 40,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 10,
  },
  priceContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5C6AC4',
  },
  originalPrice: {
    fontSize: 13,
    color: '#999',
    textDecorationLine: 'line-through',
    marginTop: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(249, 168, 37, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  rating: {
    fontSize: 12,
    marginLeft: 4,
    color: '#F9A825',
    fontWeight: 'bold',
  },
});

export default ProductItem;