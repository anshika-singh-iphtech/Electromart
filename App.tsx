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
import { navigationRef } from "./src/navigation/navigationRef";
import firebase from '@react-native-firebase/app';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
const Stack = createNativeStackNavigator();

const App = () => {
    /*useEffect(()=>{
        GoogleSignin.configure({
          webClientId: '661344018876-khq8mk62mskhl92lrqlok0nfr8a55o2d.apps.googleusercontent.com',
        });
    },[])*/
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
        <Stack.Navigator
          initialRouteName={isLoggedIn ? "MainTabs" : "Home"}
          screenOptions={{
            headerShown: false,
            gestureEnabled: true,
          }}
        >
          {/* Auth / Home */}
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />

          {/* Main App with Bottom Tabs */}
          <Stack.Screen
            name="MainTabs"
            component={BottomTabNavigator}
            options={{
              animation: "slide_from_left", // <-- Adds left-to-right slide
            }}
          />

          {/* Product Details */}
          <Stack.Screen
            name="ProductDetails"
            component={ProductDetailsScreen}
            options={{ animation: "slide_from_right" }} // also animates when opening product details
          />
        </Stack.Navigator>

        <Toast />
      </NavigationContainer>
    </Provider>
  );
};

export default App;
