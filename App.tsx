import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider } from "react-redux";
import { View, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import HomeScreen from "./src/screens/HomeScreen";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import ProductDetailsScreen from "./src/screens/ProductDetailsScreen";
import BottomTabNavigator from "./src/navigation/BottomTabNavigator";

import { store } from "./src/redux/store";
import { navigationRef } from "./src/navigation/navigationRef"; // ✅ ADD THIS

const Stack = createNativeStackNavigator();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  const checkLoginStatus = async () => {
    const value = await AsyncStorage.getItem("@is_logged_in");
    setIsLoggedIn(value === "true");
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);



  // ⏳ Splash while checking auth
  if (isLoggedIn === null) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#6C4E39" />
      </View>
    );
  }

  return (
    <Provider store={store}>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator screenOptions={{ headerShown: false }}
              initialRouteName={isLoggedIn ? "MainTabs" : "Home"}>
          {/* Splash / Home */}
          <Stack.Screen name="Home" component={HomeScreen} />

          {/* Auth */}
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />

          {/* App */}
          <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
          <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
        </Stack.Navigator>

        <Toast />
      </NavigationContainer>
    </Provider>
  );
};

export default App;
