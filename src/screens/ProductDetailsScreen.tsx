import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  Dimensions,
  ScrollView
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Product } from "../types/Product";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/slices/cartSlice";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";

const { height } = Dimensions.get("window");

const ProductDetailsScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();

  const product: Product = route.params.product;
  const [quantity, setQuantity] = useState(1);

  return (
      <View style={styles.root}>
        {/* TOP IMAGE SECTION (40%) */}
        <View style={styles.imageSection}>
          <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={26} color="#2B2B2B" />
          </Pressable>

          <Image source={product.image} style={styles.image} />
        </View>

        {/* SCROLLABLE CONTENT */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          <Text style={styles.brand}>{product.brand}</Text>

          <Text style={styles.title}>{product.name}</Text>

          <View style={styles.ratingRow}>
            <Icon name="star" size={16} color="#C9A24D" />
            <Text style={styles.ratingText}>
              {product.rating} ({product.reviews} reviews)
            </Text>
          </View>

          <Text style={styles.description}>{product.description}</Text>

          {/* QUANTITY */}
          <View style={styles.qtyContainer}>
            <Pressable
              style={styles.qtyBtn}
              onPress={() => quantity > 1 && setQuantity(quantity - 1)}
            >
              <Text style={styles.qtyText}>−</Text>
            </Pressable>

            <Text style={styles.qtyNumber}>{quantity}</Text>

            <Pressable
              style={styles.qtyBtn}
              onPress={() => setQuantity(quantity + 1)}
            >
              <Text style={styles.qtyText}>+</Text>
            </Pressable>
          </View>

          {/* EXTRA SPACE SO CONTENT DOESN'T HIDE BEHIND BUTTON */}
          <View style={{ height: 120 }} />
        </ScrollView>

        {/* FIXED ADD TO CART BUTTON */}
        <Pressable
          style={styles.cartBtn}
          onPress={() => {
            dispatch(addToCart({ product, quantity }));
            navigation.navigate("Cart");
          }}
        >
          <LinearGradient
            colors={["#8B6346", "#725034", "#5A3E2C"]}
            style={styles.cartGradient}
          >
            <Text style={styles.cartText}>
              ADD TO CART • ₹{product.price * quantity}
            </Text>
          </LinearGradient>
        </Pressable>
      </View>
    );
  };

  export default ProductDetailsScreen;


const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  /* IMAGE SECTION */
  imageSection: {
    height: height * 0.4,
    backgroundColor: "#EFE4DB",
    justifyContent: "center",
    alignItems: "center",
  },

  image: {
    width: "90%",
    height: "85%",
    resizeMode: "contain",
  },

  backBtn: {
    position: "absolute",
    top: 25,
    left: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },

  /* CONTENT */
  content: {
    padding: 20,
  },

  brand: {
    fontSize: 12,
    color: "#725034",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 6,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2B2B2B",
    marginBottom: 8,
  },

  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  ratingText: {
    marginLeft: 6,
    fontSize: 14,
    color: "#6B6B6B",
  },

  description: {
    fontSize: 15,
    color: "#6B6B6B",
    lineHeight: 22,
    marginBottom: 24,
  },

  /* QUANTITY */
  qtyContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  qtyBtn: {
    backgroundColor: "#F0F0F0",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 8,
  },

  qtyText: {
    fontSize: 18,
    fontWeight: "600",
  },

  qtyNumber: {
    fontSize: 18,
    fontWeight: "600",
    marginHorizontal: 18,
  },

  /* ADD TO CART */
  cartBtn: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    borderRadius: 14,
    overflow: "hidden",
    elevation: 6,
  },

  cartGradient: {
    paddingVertical: 16,
    alignItems: "center",
  },

  cartText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.6,
  },
});
