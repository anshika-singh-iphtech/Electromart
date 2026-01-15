import React, { useState, useEffect, useMemo} from "react";
import { View, Text, FlatList, Pressable, TextInput, Image, Dimensions,
  StyleSheet, Modal, Alert, ScrollView } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import Toast from "react-native-toast-message";
import ProductCard from "../components/ProductCard";
import WishlistButton from "../components/WishlistButton";
import products from "../data/product";
import { toggleCartItem } from "../redux/slices/cartSlice";
import Slider from "@react-native-community/slider";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import RangeSlider from "rn-range-slider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { resetToLogin } from "../navigation/navigationRef";
import { launchImageLibrary } from 'react-native-image-picker';

const { width } = Dimensions.get("window");
const numColumns = 2;
const cardMargin = 8;

const ProductsScreen = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const cartItems = useSelector((state: any) => state.cart.items);
  const [searchQuery, setSearchQuery] = useState("");
  const tabBarHeight = useBottomTabBarHeight();
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  // Filter variables
   const [isFilterVisible, setIsFilterVisible] = useState(false);
   const [filterByRating, setFilterByRating] = useState(false);
   const [rating, setRating] = useState(3);
   const [minRating, setMinRating] = useState(3);
   const [filterByPrice, setFilterByPrice] = useState(false);
   const [minPrice, setMinPrice] = useState(0);
   const [maxPrice, setMaxPrice] = useState(5000);
   const [showPriceError, setShowPriceError] = useState(false);

   // Profile State Variables
   const [profileVisible, setProfileVisible] = useState(false);
   const [user, setUser] = useState(null);

   const [editProfileVisible, setEditProfileVisible] = useState(false);

   // Editable fields
   const [editName, setEditName] = useState("");
   const [editEmail, setEditEmail] = useState("");
   const [editPhone, setEditPhone] = useState("");
   const [editAddress, setEditAddress] = useState("");
   const [editGender, setEditGender] = useState("Male");

   //const defaultPic =
     //  "https://cdn-icons-png.flaticon.com/512/149/149071.png";
   const defaultProfilePic = Image.resolveAssetSource
   ( require("../assets/images/appleIcon.png") ).uri;

  const cardWidth = (width - cardMargin * (numColumns + 2)) / numColumns;

const applyFilters = () => {
  if (filterByPrice && maxPrice < minPrice) {
    setShowPriceError(true);
    return;
  }

  let updatedProducts = products;

  // search
  if (searchQuery) {
    updatedProducts = updatedProducts.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // rating filter
  if (filterByRating) {
    updatedProducts = updatedProducts.filter(
      item => item.rating >= rating
    );
  }

  // price filter
  if (filterByPrice) {
    updatedProducts = updatedProducts.filter(
      item => item.price >= minPrice && item.price <= maxPrice
    );
  }

  setFilteredProducts(updatedProducts);
  setIsFilterVisible(false);
};

  //const handleSearch = (text: string) => {
   // setSearchQuery(text);
 // };

  const handleCartPress = (item: any) => {
    const isInCart = cartItems.some(
      (cartItem: any) => cartItem.id === item.id
    );
    console.log("Item ID:", item.id);
    console.log("Cart items:", cartItems);

    if (isInCart) {
      Toast.show({
        type: "info",
        text1: "Already added",
        visibilityTime: 1000,
      });
      return;
    }

    dispatch(toggleCartItem(item));

    Toast.show({
      type: "success",
      text1: "Added to cart",
      visibilityTime: 1000,
    });
  };

  const handleChangeProfilePic = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.7,
      });

      if (result.didCancel) return;
      if (!result.assets || !result.assets[0]) return;

      const newUri = result.assets[0].uri;

      // Update local state
      const updatedUser = { ...user, profilePic: newUri };
      setUser(updatedUser);

      // Save updated user in AsyncStorage
      await AsyncStorage.setItem('@logged_in_user', JSON.stringify(updatedUser));

    } catch (error) {
      console.log("Error picking image:", error);
    }
  };

  const renderItem = ({ item }: any) => (
    <ProductCard
      item={item}
      cardWidth={cardWidth}
      searchQuery={searchQuery}
      onCartPress={() => handleCartPress(item)}
      isInCart={cartItems.some((cart) => cart.id === item.id)}
    />
  );

  const handleRatingChange = (value: number) => {
    console.log("Rating slider touched, value:", value);
    setRating(value);
  };

  const handleLogout = async () => {
    try {
      // 1️⃣ Clear AsyncStorage login flags
      await AsyncStorage.removeItem("@is_logged_in");
      await AsyncStorage.removeItem("@logged_in_user");
      //await GoogleSignin.revokeAccess();
      //await auth().signOut();
      //console.log("Sign out success");

      // 4️⃣ Update local UI state
      setProfileVisible(false);

      // 5️⃣ Navigate back to Login screen
      navigation.replace("Login");

      console.log("User logged out successfully");
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  useEffect(() => {
    if (isFilterVisible) {
      // Force a re-render by updating a dummy state (or call setState on an existing one)
      setRating((prev) => prev);  // This triggers a re-render without changing the value
    }
  }, [isFilterVisible]);

  useEffect(() => {
    const fetchUser = async () => {
      const json = await AsyncStorage.getItem("@logged_in_user");
      if (json) setUser(JSON.parse(json));
    };
    fetchUser();
  }, []);

const ProfileItem = ({ icon, label, danger, onPress }) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [
      styles.profileItem,
      pressed && { opacity: 0.6 },
    ]}
  >
    <MaterialCommunityIcons
      name={icon}
      size={22}
      color={danger ? "#938D76" : "#6C4E39"}
    />
    <Text
      style={[
        styles.profileItemText,
        danger && { color: "#938D76" },
      ]}
    >
      {label}
    </Text>
  </Pressable>
);

const filteredProducts = useMemo(() => {
   return products.filter((item) => {
     const matchesSearch = item.name
       .toLowerCase()
       .includes(searchQuery.toLowerCase());

     if (!matchesSearch) return false;

     if (filterByPrice) {
       if (item.price < minPrice || item.price > maxPrice) return false;
     }

     if (filterByRating) {
       if (item.rating < minRating) return false;
     }

     return true;
   });
 }, [searchQuery, minPrice, maxPrice, minRating, filterByPrice, filterByRating]);

 const handleUpdateProfile = async () => {
   const updatedUser = {
     ...user,
     name: editName,
     email: editEmail,
     phone: editPhone,
     address: editAddress,
     gender: editGender,
   };

   setUser(updatedUser);
   await AsyncStorage.setItem("@logged_in_user", JSON.stringify(updatedUser));

   setEditProfileVisible(false);
 };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>ElectroMart</Text>
          <Text style={styles.subtitle}>
            Order electronics products easily from one place!
          </Text>
        </View>

        <View style={styles.rightIcons}>

          <Pressable
            style={styles.cartIcon}
            onPress={() => navigation.navigate("Cart")}
          >
            <MaterialCommunityIcons
              name="cart"
              size={28}
              color="#725034"
            />
            {cartItems.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{cartItems.length}</Text>
              </View>
            )}
          </Pressable>

          <Pressable onPress={() => setProfileVisible(true)}>

            <Image source={{ uri: user?.profilePic || defaultProfilePic }}
            style={styles.profileImage} />

          </Pressable>
        </View>
      </View>

      {/* Search + Filter
      <Image
        source={{ uri: "https://randomuser.me/api/portraits/women/44.jpg" }}
        style={styles.profileImage}
      />*/}
      <View style={styles.searchFilterContainer}>
        <View style={styles.searchContainer}>
          <MaterialCommunityIcons
            name="magnify"
            size={22}
            color="rgba(15,32,39,0.6)"
            style={{ marginLeft: 10 }}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            placeholderTextColor="rgba(15,32,39,0.5)"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Filter Icon */}
        <Pressable
          style={styles.filterIconContainer}
          onPress={() => setIsFilterVisible(true)}
        >
          <MaterialCommunityIcons name="filter" size={24} color="#fff" />
        </Pressable>
      </View>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
          <View style={{ flex: 1, backgroundColor: "#F6F7F2", }}>
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          numColumns={2}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={styles.row}
        />
        <View style={styles.bottomSpacer} />
        </View>
      ) : (
        <View style={styles.noItemsContainer}>
          <MaterialCommunityIcons
            name="cart-off"
            size={80}
            color="#C0C0C0"
            style={{ marginBottom: 15 }}
          />
          <Text style={styles.noItemsText}>No items found</Text>
        </View>
      )}

      <Modal
             animationType="slide"
             transparent
             visible={isFilterVisible}
             onRequestClose={() => setIsFilterVisible(false)}
           >
             <View style={styles.modalOverlay}>
               {/* Background overlay – closes modal */}
               <Pressable
                 style={styles.overlay}
                 onPress={() => setIsFilterVisible(false)}
               />

               {/* Sidebar – DO NOT wrap this in Pressable */}
               <View style={styles.sidebar}>
                 <Text style={styles.filterTitle}>Filters</Text>

                 {/* Filter by Price */}
                 <Pressable
                   onPress={() => setFilterByPrice(prev => !prev)}
                   style={styles.checkboxRow}
                 >
                   <MaterialCommunityIcons
                     name={filterByPrice ? "checkbox-marked" : "checkbox-blank-outline"}
                     size={24}
                     color="#0F2027"
                   />
                   <Text style={styles.checkboxLabel}>Filter by Price</Text>
                 </Pressable>

                 {filterByPrice && (
                   <View style={styles.rangeContainer}>
                     <Text style={styles.label}>
                       Price Range: ₹{minPrice} – ₹{maxPrice}
                     </Text>

                     <Slider
                       style={styles.slider}
                       minimumValue={0}
                       maximumValue={120000}
                       step={1000}
                       value={minPrice}
                       onValueChange={setMinPrice}
                       minimumTrackTintColor="#0F2027"
                       maximumTrackTintColor="#dcdcdc"
                       thumbTintColor="#0F2027"
                     />

                     <Slider
                       style={styles.slider}
                       minimumValue={minPrice}
                       maximumValue={120000}
                       step={1000}
                       value={maxPrice}
                       onValueChange={setMaxPrice}
                       minimumTrackTintColor="#0F2027"
                       maximumTrackTintColor="#dcdcdc"
                       thumbTintColor="#0F2027"
                     />
                   </View>
                 )}

                 {/* Filter by Rating */}
                 <Pressable
                   onPress={() => setFilterByRating(prev => !prev)}
                   style={styles.checkboxRow}
                 >
                   <MaterialCommunityIcons
                     name={filterByRating ? "checkbox-marked" : "checkbox-blank-outline"}
                     size={24}
                     color="#0F2027"
                   />
                   <Text style={styles.checkboxLabel}>Filter by Rating</Text>
                 </Pressable>

                 {filterByRating && (
                   <View style={styles.rangeContainer}>
                     <Text style={styles.label}>
                       Minimum Rating: {minRating} ⭐
                     </Text>

                     <Slider
                       style={styles.slider}
                       minimumValue={1}
                       maximumValue={5}
                       step={0.1}
                       value={minRating}
                       onValueChange={(value) => {
                         const rounded = Math.round(value * 10) / 10;
                         setMinRating(rounded);
                       }}
                       minimumTrackTintColor="#0F2027"
                       maximumTrackTintColor="#ccc"
                       thumbTintColor="#0F2027"
                     />
                   </View>
                 )}

                 <Pressable
                   style={styles.applyButton}
                   onPress={() => {
                     if (filterByPrice && maxPrice < minPrice) {
                       Alert.alert(
                         "Invalid Price Range",
                         "Maximum price cannot be less than minimum price. Please select the correct range.",
                         [{ text: "OK" }]
                       );
                       return;
                     }
                     setIsFilterVisible(false);
                   }}
                 >
                   <Text style={styles.applyButtonText}>Apply Filters</Text>
                 </Pressable>
               </View>
             </View>
           </Modal>

           <Modal
             visible={profileVisible}
             transparent
             animationType="none"
             onRequestClose={() => setProfileVisible(false)}
           >
             <View style={styles.profileOverlay}>
               {/* Click outside to close */}
               <Pressable
                 style={styles.overlayBackground}
                 onPress={() => setProfileVisible(false)}
               />

               {/* Sidebar */}
               <View style={styles.profileSidebar}>
                 {/* Profile section */}
                 <View style={styles.profileHeader}>

                   <Image
                     source={{ uri: user?.profilePic ?? defaultProfilePic }}
                     style={styles.profileAvatar}
                   />

                   <Text style={styles.profileName}>{user?.name ?? user?.email}</Text>

                   <View style={styles.profileActions}>
                     <Pressable style={styles.profileActionBtn} onPress={handleChangeProfilePic}>
                       <Text style={styles.profileActionText}>Change Pic</Text>
                     </Pressable>
                     <Pressable
                       style={styles.profileActionBtnOutline}
                       onPress={() => {
                         setEditName(user?.name || "");
                         setEditEmail(user?.email || "");
                         setEditPhone(user?.phone || "");
                         setEditAddress(user?.address || "");
                         setEditGender(user?.gender || "Male");
                         setProfileVisible(false);   // 👈 CLOSE SIDEBAR MODAL
                           setTimeout(() => {
                             setEditProfileVisible(true); // 👈 OPEN EDIT MODAL
                           }, 200);
                       }}
                     >
                       <Text style={styles.profileActionTextOutline}>Update</Text>
                     </Pressable>
                   </View>
                 </View>

                 {/* Menu Items */}
                 <View style={styles.profileMenu}>
                   <ProfileItem icon="shopping-outline" label="My Orders" />
                   <ProfileItem icon="heart-outline" label="Wishlist" />
                   <ProfileItem icon="map-marker-outline" label="Saved Addresses" />
                   <ProfileItem icon="credit-card-outline" label="Payment Methods" />
                   <ProfileItem
                     icon="logout"
                     label="Logout"
                     danger
                     onPress={() => setLogoutModalVisible(true)}
                   />
                 </View>
               </View>
             </View>
           </Modal>
           <Modal
             visible={logoutModalVisible}
             transparent
             animationType="fade"
             onRequestClose={() => setLogoutModalVisible(false)}
           >
             <View style={styles.modalOverlayL}>
               {/* Semi-transparent background */}
               <Pressable
                 style={styles.overlayBackgroundL}
                 onPress={() => setLogoutModalVisible(false)}
               />

               {/* Modal content */}
               <View style={styles.logoutModal}>
                 <Text style={styles.logoutTitle}>Confirm Logout</Text>
                 <Text style={styles.logoutMessage}>
                   Are you sure you want to logout?
                 </Text>

                 <View style={styles.logoutButtons}>
                   <Pressable
                     style={[styles.logoutButton, styles.cancelButton]}
                     onPress={() => setLogoutModalVisible(false)}
                   >
                     <Text style={styles.cancelText}>Cancel</Text>
                   </Pressable>

                   <Pressable
                     style={[styles.logoutButton, styles.confirmButton]}
                     onPress={async () => {
                       setLogoutModalVisible(false);
                       await handleLogout(); // call your existing logout function
                     }}
                   >
                     <Text style={styles.confirmText}>Logout</Text>
                   </Pressable>
                 </View>
               </View>
             </View>
           </Modal>
          <Modal
            visible={editProfileVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setEditProfileVisible(false)}
          >
            <View style={styles.editOverlay}>
              <View style={styles.editContainer}>

                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingBottom: 20 }}
                  keyboardShouldPersistTaps="handled"
                >

                  <Text style={styles.editTitle}>Edit Profile</Text>

                  {/* Name */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Full Name</Text>
                    <View style={styles.inputRow}>
                      <MaterialCommunityIcons name="account" size={22} color="#6C4E39" />
                      <TextInput
                        value={editName}
                        onChangeText={setEditName}
                        style={styles.input}
                        placeholder="Enter your name"
                        placeholderTextColor="#999"
                      />
                    </View>
                  </View>

                  {/* Email */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Email</Text>
                    <View style={styles.inputRow}>
                      <MaterialCommunityIcons name="email-outline" size={22} color="#6C4E39" />
                      <TextInput
                        value={editEmail}
                        onChangeText={setEditEmail}
                        style={styles.input}
                        placeholder="Enter your email"
                        placeholderTextColor="#999"
                        keyboardType="email-address"
                      />
                    </View>
                  </View>

                  {/* Phone */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Phone Number</Text>
                    <View style={styles.inputRow}>
                      <MaterialCommunityIcons name="phone" size={22} color="#6C4E39" />
                      <TextInput
                        value={editPhone}
                        onChangeText={setEditPhone}
                        style={styles.input}
                        placeholder="Enter phone number"
                        placeholderTextColor="#999"
                        keyboardType="number-pad"
                      />
                    </View>
                  </View>

                  {/* Address */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Address</Text>
                    <View style={styles.inputRow}>
                      <MaterialCommunityIcons name="map-marker-outline" size={22} color="#6C4E39" />
                      <TextInput
                        value={editAddress}
                        onChangeText={setEditAddress}
                        style={styles.input}
                        placeholder="Enter address"
                        placeholderTextColor="#999"
                      />
                    </View>
                  </View>

                  {/* Gender */}
                  <Text style={styles.label}>Gender</Text>
                  <View style={styles.genderRow}>
                    {["Male", "Female", "Other"].map((g) => (
                      <Pressable
                        key={g}
                        style={[
                          styles.genderBtn,
                          editGender === g && styles.genderBtnActive,
                        ]}
                        onPress={() => setEditGender(g)}
                      >
                        <Text
                          style={[
                            styles.genderText,
                            editGender === g && styles.genderTextActive,
                          ]}
                        >
                          {g}
                        </Text>
                      </Pressable>
                    ))}
                  </View>

                  {/* Actions */}
                  <View style={styles.actionRow}>
                    <Pressable style={styles.saveBtn} onPress={handleUpdateProfile}>
                      <Text style={styles.saveBtnText}>Save</Text>
                    </Pressable>

                    <Pressable
                      style={styles.cancelBtn}
                      onPress={() => setEditProfileVisible(false)}
                    >
                      <Text style={styles.cancelBtnText}>Cancel</Text>
                    </Pressable>
                  </View>

                </ScrollView>

              </View>
            </View>
          </Modal>

    </View>
  );
};
export default ProductsScreen;

const styles = StyleSheet.create({
  /* ---------- Screen ---------- */
  container: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 30,
    backgroundColor: "#F6F7F2", // ✅ neutral cream, NOT loud #FFF7ED
  },

  bottomSpacer: {
    height: 80, // tab height + gap
    backgroundColor: "#F6F7F2", // SAME as screen background
  },

  /* ---------- Header ---------- */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#3F2A1D", // warm dark brown
  },

  subtitle: {
    fontSize: 13,
    color: "#7A5C4A",
  },

  rightIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  cartIcon: {
    marginRight: 12,
  },

  badge: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#ffffff",
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
    borderWidth:1,
    borderColor:"#694C36",
  },
  badgeText: {
    color: "#694C36",
    fontSize: 11,
    fontWeight: "700",
  },

  profileImage: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: "#FFE0B2",
  },

  /* ---------- Search & Filter ---------- */
  searchFilterContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingHorizontal: 10,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    marginLeft: 6,
    fontSize: 15,
    color: "#4A2C1D",
  },

  filterIconContainer: {
    width: 50,
    height: 50,
    marginLeft: 10,
    backgroundColor: "#725034", // accent
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  /* ---------- Grid ---------- */
  row: {
    justifyContent: "space-between",
  },

  /* ---------- Empty State ---------- */
  noItemsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noItemsText: {
    fontSize: 18,
    color: "#9A7B68",
  },

/* ---------- Modal ---------- */

modalOverlay: {
   flex: 1,
   backgroundColor: "rgba(0,0,0,0.45)",
 },

 sidebar: {
   position: "absolute",
   bottom: 0,
   width: "100%",
   height: 550,
   backgroundColor: "#F3F5F0",
   padding: 20,
   borderTopLeftRadius: 26,
   borderTopRightRadius: 26,
   shadowColor: "#000",
   shadowOffset: { width: 0, height: -4 },
   shadowOpacity: 0.15,
   shadowRadius: 10,
   elevation: 12,
 },

 filterTitle: {
   fontSize: 20,
   fontWeight: "700",
   color: "#4A2C1D",
   marginBottom: 16,
 },

 checkboxRow: {
   flexDirection: "row",
   alignItems: "center",
   marginVertical: 10,
 },

 label: {
   fontSize: 15,
   fontWeight: "600",
   color: "#4A2C1D",
   marginBottom: 6,
 },

 subLabel: {
   fontSize: 13,
   color: "#7A5C4A",
   marginBottom: 6,
 },

 rangeContainer: {
   marginVertical: 10,
   paddingVertical: 6,
 },

 slider: {
   width: "100%",
   height: 40,
 },

 applyButton: {
   backgroundColor: "#694C36",
   paddingVertical: 14,
   borderRadius: 14,
   alignItems: "center",
   marginTop: 16,
   shadowColor: "#FF7A45",
   shadowOffset: { width: 0, height: 4 },
   shadowOpacity: 0.35,
   shadowRadius: 6,
   elevation: 4,
 },
 applyButtonText: {
   color: "#FFFFFF",
   fontSize: 16,
   fontWeight: "700",
 },

 overlay: {
   position: "absolute",
   top: 0,
   left: 0,
   right: 0,
   bottom: 450,
 },

 /* ---------------  Profile modal -------------------*/
 profileOverlay: {
     flex: 1,
     flexDirection: "row",
   },

   overlayBackground: {
     flex: 1,
     backgroundColor: "rgba(0,0,0,0.35)",
   },

   profileSidebar: {
     width: "70%",
     backgroundColor: "#F3F5F0",
     paddingTop: 40,
     paddingHorizontal: 16,
     elevation: 12,
     shadowColor: "rgba(63,42,29,0.2)",
     shadowOffset: { width: 4, height: 0 },
     shadowOpacity: 1,
     shadowRadius: 10,
   },

   profileHeader: {
     alignItems: "center",
     marginBottom: 24,
   },

   profileAvatar: {
     width: 88,
     height: 88,
     borderRadius: 44,
     marginBottom: 10,
   },

   profileName: {
     fontSize: 16,
     fontWeight: "700",
     color: "#3F2A1D",
     marginBottom: 12,
   },

   profileActions: {
     flexDirection: "row",
     gap: 10,
   },

   profileActionBtn: {
     backgroundColor: "#694C36",
     paddingVertical: 6,
     paddingHorizontal: 14,
     borderRadius: 18,
   },

   profileActionBtnOutline: {
     borderWidth: 1,
     borderColor: "#694C36",
     paddingVertical: 6,
     paddingHorizontal: 14,
     borderRadius: 18,
   },

   profileActionText: {
     color: "#FFFFFF",
     fontWeight: "600",
     fontSize: 12,
   },

   profileActionTextOutline: {
     color: "#694C36",
     fontWeight: "600",
     fontSize: 12,
   },

   profileMenu: {
     borderTopWidth: 1,
     borderTopColor: "rgba(176,137,104,0.2)",
     paddingTop: 12,
   },

   profileItem: {
     flexDirection: "row",
     alignItems: "center",
     paddingVertical: 12,
     gap: 14,
   },

   profileItemText: {
     fontSize: 14,
     color: "#3F2A1D",
     fontWeight: "500",
   },

   /* ------------------  Logout Modal  ---------------------*/
   modalOverlayL: {
       flex: 1,
       justifyContent: "center",
       alignItems: "center",
     },
     overlayBackgroundL: {
       position: "absolute",
       width: "100%",
       height: "100%",
       backgroundColor: "rgba(0,0,0,0.5)",
     },
     logoutModal: {
       width: "80%",
       padding: 20,
       backgroundColor: "#fff",
       borderRadius: 12,
       alignItems: "center",
       zIndex: 10,
     },
     logoutTitle: {
       color:"#7A614D",
       fontSize: 18,
       fontWeight: "bold",
       marginBottom: 10,
     },
     logoutMessage: {
       color:"#555",
       fontSize: 14,
       textAlign: "center",
       marginBottom: 20,
     },
     logoutButtons: {
       flexDirection: "row",
       justifyContent: "space-between",
       width: "100%",
     },
     logoutButton: {
       flex: 1,
       paddingVertical: 10,
       marginHorizontal: 5,
       borderRadius: 8,
       alignItems: "center",
     },
     cancelButton: {
       backgroundColor: "#ccc",
     },
     confirmButton: {
       backgroundColor: "#694C36",
     },
     cancelText: {
       color: "#000",
       fontWeight: "bold",
     },
     confirmText: {
       color: "#fff",
       fontWeight: "bold",
     },
   /* --------------  Edit Profile -------------------*/
     editOverlay: {
       flex: 1,
       backgroundColor: "rgba(0,0,0,0.6)",
       justifyContent: "center",
       alignItems: "center",
     },

     editContainer: {
       width: "88%",
       backgroundColor: "#fff",
       padding: 22,
       borderRadius: 18,
       elevation: 12,
       shadowColor: "#000",
       shadowOpacity: 0.25,
       shadowRadius: 8,
       marginVertical: 20,
       shadowOffset: { width: 0, height: 2 },
     },

     editTitle: {
       fontSize: 20,
       fontWeight: "700",
       marginBottom: 18,
       textAlign: "center",
       color: "#6C4E39",
     },

     inputGroup: {
       marginBottom: 14,
     },

     label: {
       fontSize: 14,
       color: "#444",
       marginBottom: 6,
       fontWeight: "600",
     },

     inputRow: {
       flexDirection: "row",
       alignItems: "center",
       backgroundColor: "#F4EFEA",
       paddingHorizontal: 12,
       paddingVertical: 5,
       borderRadius: 10,
     },

     input: {
       marginLeft: 8,
       flex: 1,
       fontSize: 15,
       color: "#333",
     },

     genderRow: {
       flexDirection: "row",
       justifyContent: "space-between",
       marginVertical: 12,
     },

     genderBtn: {
       flex: 1,
       paddingVertical: 10,
       marginHorizontal: 4,
       borderRadius: 10,
       borderWidth: 1,
       borderColor: "#bbb",
       alignItems: "center",
     },

     genderBtnActive: {
       backgroundColor: "#6C4E39",
       borderColor: "#6C4E39",
     },

     genderText: {
       color: "#444",
       fontWeight: "600",
     },

     genderTextActive: {
       color: "#fff",
     },

     actionRow: {
       flexDirection: "row",
       marginTop: 20,
       justifyContent: "space-between",
     },

     saveBtn: {
       flex: 1,
       backgroundColor: "#6C4E39",
       paddingVertical: 12,
       borderRadius: 10,
       alignItems: "center",
       marginRight: 6,
     },

     saveBtnText: {
       color: "#fff",
       fontSize: 16,
       fontWeight: "600",
     },

     cancelBtn: {
       flex: 1,
       backgroundColor: "#ddd",
       paddingVertical: 12,
       borderRadius: 10,
       alignItems: "center",
       marginLeft: 6,
     },

     cancelBtnText: {
       color: "#555",
       fontSize: 16,
       fontWeight: "600",
     },
   });




