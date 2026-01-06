import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const WishlistButton = () => {
  const navigation = useNavigation<any>();

  const wishlistCount = useSelector(
    (state: any) => state.wishlist.items.length
  );

  return (
    <Pressable
      style={styles.container}
      onPress={() => navigation.navigate("Wishlist")}
    >
      <MaterialCommunityIcons
        name="heart"
        size={20}
        color="#E63946"
      />
      <Text style={styles.text}>Wishlist</Text>

      {wishlistCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{wishlistCount}</Text>
        </View>
      )}
    </Pressable>
  );
};

export default WishlistButton;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#F5F6F4",
  },
  text: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2F4F4F",
  },
  badge: {
    backgroundColor: "#E63946",
    borderRadius: 10,
    paddingHorizontal: 6,
    marginLeft: 4,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
});
