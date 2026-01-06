import React from "react";
import { View, FlatList, Text, StyleSheet, Pressable } from "react-native";
import { useSelector } from "react-redux";
import ProductCard from "../components/ProductCard";
import LinearGradient from "react-native-linear-gradient";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { Dimensions } from "react-native";
const { width } = Dimensions.get("window");
const numColumns = 2;
const cardMargin = 8;

const cardWidth = (width - cardMargin * (numColumns + 2)) / numColumns;


const WishlistScreen = () => {
  const navigation = useNavigation();
  const wishlistItems = useSelector((state: any) => state.wishlist.items);

  return (
    <View style={styles.screen}>
      {/* Header - Always Visible */}
      <LinearGradient
        colors={["#8B6346", "#725034", "#5A3E2C"]}
        style={styles.header}
      >
        <Pressable
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={26}
            color="#ffffff"
          />
        </Pressable>

        <Text style={styles.headerTitle}>Liked Items</Text>
      </LinearGradient>

      {/* Empty State */}
      {wishlistItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons
            name="shopping-outline"
            size={70}
            color="#8fa3ad"
          />
          <Text style={styles.emptyText}>
            No items in the liked section
          </Text>
        </View>
      ) : (
        <FlatList
          key="wishlist-grid"
          data={wishlistItems}
          numColumns={2}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ProductCard item={item} cardWidth={cardWidth} />
          )}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />

      )}

    </View>
  );
};

export default WishlistScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f4f6f8",
  },
  row: {
    justifyContent: "space-between",
  },

  header: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },

  backBtn: {
    position: "absolute",
    left: 16,
    zIndex: 10,
  },

  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: "#6b7c86",
    fontWeight: "500",
  },

  listContainer: {
    paddingHorizontal: 10,
    paddingTop: 12,
    paddingBottom: 16,
    paddingBottom: 70,
  },

  cardWrapper: {
    flex: 1,
    marginHorizontal: 6,
    marginBottom: 16,
  },
});
