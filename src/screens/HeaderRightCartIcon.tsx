import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

const CartIcon = () => {
  const navigation = useNavigation<any>();
  const cartItems = useSelector((state: any) => state.cart.items);

  return (
    <Pressable onPress={() => navigation.navigate("Cart")}>
      <View style={styles.container}>
        <MaterialCommunityIcons name="cart" size={26} color="#000" />

        {cartItems.length > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{cartItems.length}</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
};

export default CartIcon;
const styles = StyleSheet.create({
  container: {
    marginRight: 15,
  },
  badge: {
    position: "absolute",
    right: -6,
    top: -4,
    backgroundColor: "red",
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "bold",
  },
});
