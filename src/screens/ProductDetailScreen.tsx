import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
  ActivityIndicator,
} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Feather';
import {RootStackParamList} from '../navigation/AppNavigator';
import {useDispatch, useSelector} from 'react-redux';
import {addToCartAsync} from '../redux/slices/cartSlice';
import {toggleFavoriteAsync} from '../redux/slices/favoriteSlice';
import {RootState, Product} from '../types';
import {formatPrice} from '../utils/performance';
import {fetchProductById} from '../services/api';
import ErrorView from '../components/ErrorView';

type ProductDetailScreenProps = {
  route: RouteProp<RootStackParamList, 'ProductDetail'>;
  navigation: NativeStackNavigationProp<RootStackParamList, 'ProductDetail'>;
};

const {width} = Dimensions.get('window');

const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({
  route,
  navigation,
}) => {
  const {productId} = route.params;
  const dispatch = useDispatch();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Get favorite status
  const favoriteItems = useSelector((state: RootState) => state.favorites.items);
  const isFavorite = favoriteItems.includes(productId);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const data = await fetchProductById(productId);
        setProduct(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  const handleAddToCart = () => {
    if (product) {
      // Animation effect when adding to cart
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      // @ts-ignore - typing issue with AsyncThunk
      dispatch(addToCartAsync({product, quantity}));
      // @ts-ignore - navigation typing issue, but this works correctly
      navigation.navigate('Cart');
    }
  };

  const handleFavoriteToggle = () => {
    // This function now calls the async thunk that will update the database
    // @ts-ignore - typing issue with AsyncThunk
    dispatch(toggleFavoriteAsync(productId));
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  // Handle image carousel scrolling
  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / width);
    setActiveImageIndex(currentIndex);
  };

  // Scroll to specific image
  const scrollToImage = (index: number) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: width * index,
        animated: true,
      });
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#5C6AC4" />
      </View>
    );
  }

  if (error || !product) {
    return (
      <ErrorView
        message={error || 'Product not found'}
        onRetry={() => navigation.goBack()}
      />
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Image Carousel */}
      <View style={styles.carouselContainer}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}>
          {product.images.map((image, index) => (
            <Image
              key={index}
              source={{uri: image}}
              style={styles.image}
              resizeMode="cover"
            />
          ))}
        </ScrollView>

        {/* Image indicators */}
        <View style={styles.indicatorContainer}>
          {product.images.map((_, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.indicator,
                activeImageIndex === index && styles.activeIndicator,
              ]}
              onPress={() => scrollToImage(index)}
            />
          ))}
        </View>

        {/* Favorite button */}
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={handleFavoriteToggle}>
          <Icon
            name="heart"
            size={24}
            color={isFavorite ? '#FF6B6B' : '#DDDDDD'}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.detailsContainer}>
        {/* Product Title and Price */}
        <View style={styles.headerContainer}>
          <Text style={styles.title}>{product.title}</Text>
          <Text style={styles.price}>{formatPrice(product.price)}</Text>
        </View>

        {/* Rating and Brand */}
        <View style={styles.infoRow}>
          <View style={styles.ratingContainer}>
            <Icon name="star" size={16} color="#FFD700" />
            <Text style={styles.rating}>{product.rating.toFixed(1)}</Text>
          </View>
          <Text style={styles.brand}>Brand: {product.brand}</Text>
        </View>

        {/* Description */}
        <Text style={styles.description}>{product.description}</Text>

        {/* Additional Info */}
        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Icon name="tag" size={16} color="#5C6AC4" />
            <Text style={styles.infoText}>
              {product.discountPercentage}% off
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Icon name="package" size={16} color="#5C6AC4" />
            <Text style={styles.infoText}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Icon name="grid" size={16} color="#5C6AC4" />
            <Text style={styles.infoText}>{product.category}</Text>
          </View>
        </View>

        {/* Quantity Selector */}
        <View style={styles.quantityContainer}>
          <Text style={styles.quantityLabel}>Quantity:</Text>
          <View style={styles.quantitySelector}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={decrementQuantity}
              disabled={quantity <= 1}>
              <Icon
                name="minus"
                size={16}
                color={quantity <= 1 ? '#CCCCCC' : '#5C6AC4'}
              />
            </TouchableOpacity>
            <Text style={styles.quantityValue}>{quantity}</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={incrementQuantity}>
              <Icon name="plus" size={16} color="#5C6AC4" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Add to Cart Button */}
        <Animated.View
          style={[styles.addToCartContainer, {transform: [{scale: scaleAnim}]}]}>
          <TouchableOpacity
            style={styles.addToCartButton}
            onPress={handleAddToCart}>
            <Icon name="shopping-cart" size={20} color="#FFFFFF" />
            <Text style={styles.addToCartText}>Add to Cart</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselContainer: {
    position: 'relative',
  },
  image: {
    width,
    height: width * 0.8,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 20,
    width: '100%',
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: '#5C6AC4',
    width: 16,
  },
  favoriteButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    flex: 1,
    marginRight: 8,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5C6AC4',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    marginLeft: 4,
    color: '#333333',
    fontWeight: '500',
  },
  brand: {
    color: '#666666',
    fontWeight: '500',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555555',
    marginBottom: 16,
  },
  infoContainer: {
    backgroundColor: '#F5F7FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#444444',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  quantityLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    overflow: 'hidden',
  },
  quantityButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  quantityValue: {
    width: 40,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
  },
  addToCartContainer: {
    marginBottom: 16,
  },
  addToCartButton: {
    backgroundColor: '#5C6AC4',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 12,
  },
  addToCartText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
});

export default ProductDetailScreen;
