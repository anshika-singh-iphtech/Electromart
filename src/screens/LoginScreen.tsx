import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = () => {
  const navigation = useNavigation<any>();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [formError, setFormError] = useState("");

  const validateEmail = (value: string) =>
    /^[a-zA-Z0-9._%+-]+@([A-Za-z0-9]+(-[A-Za-z0-9]+)*)(\.[A-Za-z]{2,})+$/.test(value);

  const handleLogin = async () => {
    if (!email || !password) {
      setFormError("Please fill all fields");
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@([A-Za-z0-9]+(-[A-Za-z0-9]+)*)(\.[A-Za-z]{2,})+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Enter a valid email address");
      return;
    }

    try {
        // Get all users from AsyncStorage
        const usersJSON = await AsyncStorage.getItem("@users");
        const users = usersJSON ? JSON.parse(usersJSON) : [];

        if (users.length === 0) {
          setFormError("User not registered");
          return;
        }

        // Find user matching email and password
        const user = users.find(
          (u: any) => u.email === email && u.password === password);

        if (!user) {
          setFormError("Invalid email or password");
          return;
        }

        // Successful login
        await AsyncStorage.setItem("@is_logged_in", "true");

        // Navigate to ProductsScreen
        navigation.replace("MainTabs");
      } catch (err) {
        console.log(err);
        setFormError("Something went wrong. Please try again.");
      }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          {/* Header */}
          <Text style={styles.title}>Welcome!</Text>
          <Text style={styles.subtitle}>Start your journey today.</Text>

          {/* Card */}
          <View style={styles.formCard}>
            {/* Form Error (top of card) */}
            {formError ? (
              <Text style={styles.formError}>{formError}</Text>
            ) : null}

            {/* Email */}
            <View style={styles.inputWrapper}>
              <MaterialCommunityIcons
                name="email-outline"
                size={20}
                color="#6C4E39"
              />
              <TextInput
                placeholder="Enter your email"
                placeholderTextColor="#8D8271"
                style={styles.input}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setEmailError("");
                  setFormError("");
                }}
                autoCapitalize="none"
                cursorColor="#6C4E39"
                autoComplete="off"
                importantForAutofill="no"
              />
            </View>

            {emailError ? (
              <Text style={styles.fieldError}>{emailError}</Text>
            ) : null}

            {/* Password */}
            <View style={styles.inputWrapper}>
              <MaterialCommunityIcons
                name="lock-outline"
                size={20}
                color="#6C4E39"
              />
              <TextInput
                placeholder="Enter your password"
                placeholderTextColor="#8D8271"
                secureTextEntry={!showPassword}
                style={styles.input}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setFormError("");
                }}
                cursorColor="#6C4E39"
              />
              <Pressable onPress={() => setShowPassword(!showPassword)}>
                <MaterialCommunityIcons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#6C6C74"
                />
              </Pressable>
            </View>

            {/* Button */}
            <Pressable
              onPress={handleLogin}
              style={({ pressed }) => [
                styles.primaryBtn,
                pressed && styles.primaryBtnPressed,
              ]}
            >
              <Text style={styles.primaryText}>Login</Text>
            </Pressable>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.line} />
              <Text style={styles.orText}>or</Text>
              <View style={styles.line} />
            </View>

            {/* Social */}
            <View style={styles.socialRow}>
              <View style={styles.socialBtn}>
                <Image
                  source={require("../assets/images/googleIcon.png")}
                    style={styles.iconSize}
                />
              </View>
              <View style={styles.socialBtn}>
               <Image
                 source={require("../assets/images/facebookIcon.png")}
                   style={styles.iconSize}
               />
              </View>
              <View style={styles.socialBtn}>
               <Image
                 source={require("../assets/images/appleIcon.png")}
                   style={styles.iconSize}
               />
              </View>
            </View>
          </View>

          {/* Footer */}
          <Text style={styles.footerText}>
            Don’t have an account?{" "}
            <Text
              style={styles.link}
              onPress={() => navigation.navigate("Register")}
            >
              Sign up
            </Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E7DCC9",
    paddingHorizontal: 24,
    paddingTop: 70,
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#1E1E1E",
  },

  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: "#6C6C74",
  },

  /* ===== CARD ===== */
  formCard: {
    paddingVertical: 20,
    marginTop: 30,
  },

  /* ===== INPUTS ===== */
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#453B27",
    borderRadius: 30,
    paddingHorizontal: 18,
    height: 50,
    marginTop: 16,
  },

  input: {
    flex: 1,
    fontSize: 15,
    color: "#1E1E1E",
    marginLeft: 10,
  },

  /* ===== BUTTON ===== */
  primaryBtn: {
    backgroundColor: "#6C4E39",
    height: 56,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 26,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },

  primaryText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },

  primaryBtnPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.98 }],
  },
  /* ===== DIVIDER ===== */
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 60,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#453B27",
  },

  orText: {
    marginHorizontal: 12,
    fontSize: 13,
    color: "#453B27",
  },

  /* ===== SOCIAL ===== */
  socialRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 18,
    paddingHorizontal:20,
  },

  socialBtn: {
    borderRadius: 16,
    flex:1,
    alignItems: "center",
    justifyContent: "center",
  },

  iconSize:{
      width:36,
      height:36,
      },

  /* ===== FOOTER ===== */
  footerText: {
    marginTop: 34,
    textAlign: "center",
    fontSize: 13,
    color: "#453B27",
  },

  link: {
    color: "#6A4B34",
    fontWeight: "600",
  },

  fieldError: {
    color: "#D14343",
    fontSize: 12,
    marginLeft: 12,
    marginTop: 6,
  },

  formError: {
    color: "#D14343",
    fontSize: 13,
    textAlign: "center",
    marginBottom: 8,
  },
});
