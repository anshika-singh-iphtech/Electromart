import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  Pressable,
  Modal,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import {
  removeFromCart,
  increaseQty,
  decreaseQty,
} from "../redux/slices/cartSlice";
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from "@react-navigation/native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const CartScreen = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const navigation = useNavigation();

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      {/* IMAGE */}
      <Image source={item.image} style={styles.image} />

      {/* INFO */}
      <View style={styles.info}>
        <View style={styles.topRow}>
          <View>
            <Text style={styles.brand}>{item.brand}</Text>
            <Text style={styles.name}>{item.name}</Text>
          </View>

          <Pressable
            hitSlop={10}
            onPress={() => setSelectedId(item.id)}
          >
            <MaterialCommunityIcons
              name="close-circle-outline"
              size={20}
              color="#b33939"
            />
          </Pressable>
        </View>

        <View style={styles.ratingRow}>
          <Icon name="star" size={16} color="#C9A24D" />
          <Text style={styles.rating}> {item.rating}</Text>

        </View>

        <Text style={styles.price}>₹{item.price}</Text>

        {/* QTY */}
        <View style={styles.qtyContainer}>
          <Pressable
            style={styles.qtyBtn}
            onPress={() => dispatch(decreaseQty(item.id))}
          >
            <Text style={styles.qtyText}>−</Text>
          </Pressable>

          <Text style={styles.qtyNumber}>{item.quantity}</Text>

          <Pressable
            style={styles.qtyBtn}
            onPress={() => dispatch(increaseQty(item.id))}
          >
            <Text style={styles.qtyText}>+</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.screen}>
      {/* HEADER */}
      <LinearGradient
        colors={["#8B6346", "#725034", "#5A3E2C"]}
        style={styles.header}
      >
      {/* Back Arrow */}
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
        <Text style={styles.headerTitle}>My Cart</Text>
      </LinearGradient>

      {/* LIST */}
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          <Text style={styles.empty}>Your cart is empty</Text>
        }
      />

      {/* TOTAL */}
      {cartItems.length > 0 && (
        <LinearGradient
          colors={["#8B6346", "#725034", "#5A3E2C"]}
          style={styles.totalBar}
        >
          <Text style={styles.totalText}>Total: ₹{total}</Text>
        </LinearGradient>
      )}

      {/* DELETE CONFIRM MODAL */}
      <Modal transparent animationType="fade" visible={!!selectedId}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {/* Icon */}
            <View style={styles.modalIconWrapper}>
              <MaterialCommunityIcons
                name="trash-can-outline"
                size={26}
                color="#2c5364"
              />
            </View>

            {/* Title */}
            <Text style={styles.modalTitle}>
              Remove item from cart?
            </Text>

            {/* Subtitle */}
            <Text style={styles.modalSubtitle}>
             This item will be removed permanently from your cart.
            </Text>

            {/* Actions */}
            <View style={styles.modalActions}>
              <Pressable
                style={styles.modalCancelBtn}
                onPress={() => setSelectedId(null)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </Pressable>
               <Pressable
                 style={({ pressed }) => [
                   styles.modalDeleteBtn,
                   pressed && { opacity: 0.7 },
                 ]}
                 onPress={() => {
                   dispatch(removeFromCart(selectedId!));
                   setSelectedId(null);
                 }}
               >
                 <Text style={styles.modalDeleteText}>Delete</Text>
               </Pressable>
            </View>
          </View>
        </View>
      </Modal>


    </View>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f4f6f8",
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

  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 18,
    marginBottom: 14,
    elevation: 4,
    overflow: "hidden", // IMPORTANT for image
  },

  image: {
    width: 110,
    height: "100%", // 🔥 takes full card height
    resizeMode: "contain",
    backgroundColor: "#f7f7f7",
  },
  info: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  brand: {
    fontSize: 11,
    color: "#888",
  },

  name: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111",
    marginTop: 2,
  },

  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },

  rating: {
    fontSize: 12,
    color: "#C9A24D",
  },

  reviews: {
    fontSize: 12,
    color: "#777",
    marginLeft: 4,
  },

  price: {
    fontSize: 17,
    fontWeight: "700",
    marginTop: 6,
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },

  qtyContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },

  qtyBtn: {
    backgroundColor: "#eaeaea",
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 8,
  },

  qtyText: {
    fontSize: 16,
    fontWeight: "600",
  },

  qtyNumber: {
    fontSize: 15,
    fontWeight: "600",
    marginHorizontal: 14,
  },

  totalBar: {
    padding: 16,
    alignItems: "center",
  },
  totalText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },

  empty: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "#777",
  },

  /* MODAL */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 32, 39, 0.7)", // derived from theme
    justifyContent: "center",
    alignItems: "center",
  },

  modalCard: {
    width: "80%",
    backgroundColor: "#ffffff",
    borderRadius: 18,
    paddingVertical: 22,
    paddingHorizontal: 20,
    alignItems: "center",
    elevation: 8,
  },

  modalIconWrapper: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#eef3f5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },

  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0f2027",
    marginBottom: 6,
    textAlign: "center",
  },

  modalSubtitle: {
    fontSize: 13,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
  },

  modalActions: {
    flexDirection: "row",
    width: "100%",
  },

  modalCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
    marginRight: 10,
  },

  modalCancelText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#203a43",
  },

  modalDeleteBtn: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#694C36",
  },

  modalDeleteText: {
    color: "#fff",
    fontWeight: "bold",
  },



});
