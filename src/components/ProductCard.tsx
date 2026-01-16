import React from "react";
import { View, Text, Image, StyleSheet, Pressable} from "react-native";
import { Product } from "../types/Product";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { toggleCartItem, addToCart } from "../redux/slices/cartSlice";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Toast from "react-native-toast-message";
import { toggleWishlistItem } from "../redux/slices/wishlistSlice";

type StarRatingProps = {
  rating: number; // e.g., 4.5
  reviews?: number;
};

type Props = {
  item: Product;
  cardWidth: number;
  searchQuery?: string;
  onCartPress?: () => void;
  isInCart?: boolean;
};


const ProductCard: React.FC<Props> = ({
  item,
  searchQuery,
  cardWidth,
}) => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();

  const cartItems = useSelector((state: any) => state.cart.items); // get cart items
  const isInCart = cartItems.some((cartItem: any) => cartItem.id === item.id);

   const wishlistItems = useSelector(
     (state: any) => state.wishlist.items
   );

   const isInWishlist = wishlistItems.some(
     (wishlistItem: any) => wishlistItem.id === item.id
   );

   const handleWishlistPress = () => {
     dispatch(toggleWishlistItem(item));
   };

  const onPressHandler = () => {
    navigation.navigate("ProductDetails", { product: item });
  };

  const renderHighlightedText = (text: string) => {
    if (!searchQuery) {
      return (
        <Text style={styles.name} numberOfLines={1}>
          {text}
        </Text>
      );
    }

    const regex = new RegExp(`(${searchQuery})`, "gi");
    const parts = text.split(regex);

    return (
      <Text style={styles.name} numberOfLines={1}>
        {parts.map((part, index) =>
          part.toLowerCase() === searchQuery.toLowerCase() ? (
            <Text key={index} style={styles.highlight}>
              {part}
            </Text>
          ) : (
            <Text key={index}>{part}</Text>
          )
        )}
      </Text>
    );
  };

  return (
    <Pressable
      onPress={onPressHandler}
      style={[styles.card, { width: cardWidth }]}
    >
      {/* Wishlist */}
      <Pressable style={styles.heartIcon} onPress={handleWishlistPress}>
        <MaterialCommunityIcons
          name={isInWishlist ? "heart" : "heart-outline"}
          size={20}
          color={isInWishlist ? "#795033" : "#8C8C94"}
        />
      </Pressable>

      {/* Image */}
      <Image source={item.image} style={styles.image} />

      {/* Name */}
      {renderHighlightedText(item.name)}


      {/* Rating + Price */}
      <View style={styles.bottomRow}>
        <View style={styles.ratingRow}>
          <MaterialCommunityIcons
            name="star"
            size={14}
            color="#FF9633"
          />
          <Text style={styles.ratingText}>{item.rating}</Text>
        </View>

        <Text style={styles.price}>₹{item.price}</Text>
      </View>
      {/* Add to Cart Button */}
          <Pressable
            style={({ pressed }) => [
              styles.addToCartBtn,
              pressed && { opacity: 0.6, transform: [{ scale: 0.97 }] }
            ]}
            onPress={() => {
              if (isInCart) {
                Toast.show({
                  type: "info",
                  text1: "Already added",
                  position: "bottom",
                  bottomOffset: 90,
                  visibilityTime: 1000,
                });
                return;
              }

              dispatch(addToCart({ product: item, quantity: 1 }));

              Toast.show({
                type: "success",
                text1: "Item added to cart",
                position: "bottom",
                bottomOffset: 90,
                visibilityTime: 1000,
              });
            }}
          >
            <MaterialCommunityIcons
              name="cart"
              size={16}
              color="#FFF"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.addToCartText}>Add to Cart</Text>
          </Pressable>
    </Pressable>
  );
};

export default ProductCard;

const styles = StyleSheet.create({
  card: {
      backgroundColor: "#FFFFFF",
      borderRadius: 14,
      paddingVertical: 20,
      paddingHorizontal : 10,
      marginBottom: 14,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 0 }, // 👈 IMPORTANT
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 4,
    },

heartIcon: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 2,
  },

  content: {
    flexGrow: 1,
  },

  image: {
    width: "100%",
        height: 110,
        resizeMode: "contain",
        marginBottom: 8,
  },

  brand: {
    fontSize: 12,
    color: "#B08968",
    letterSpacing: 0.6,
  },

  name: {
      fontSize: 13,
      fontWeight: "600",
      color: "#21212B",
      marginBottom: 6,
    },

  price: {
      fontSize: 14,
      fontWeight: "700",
      color: "#795033",
    },
bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

 ratingRow: {
     flexDirection: "row",
     alignItems: "center",
   },

  ratingText: {
      fontSize: 12,
      marginLeft: 4,
      color: "#6C6C74",
      fontWeight: "500",
    },

  /* 👇 Add to Cart Button */
    addToCartBtn: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#795033",
      paddingVertical: 12,
      borderRadius: 18,
      marginTop:10,
    },

    addToCartText: {
      color: "#FFFFFF",
      fontSize: 13,
      fontWeight: "600",
    },
  highlight: {
      backgroundColor: "#FFE0B2",
      color: "#4A2C1D",
      fontWeight: "bold",
      borderRadius: 4,
      paddingHorizontal: 3,
    },
  });

