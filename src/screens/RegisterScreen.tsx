import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const RegisterScreen = () => {
  const navigation = useNavigation<any>();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const validate = () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@([A-Za-z0-9]+(-[A-Za-z0-9]+)*)(\.[A-Za-z]{2,})+$/;

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    setError("");
    return true;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    try {
      // Get existing users array
      const usersJSON = await AsyncStorage.getItem("@users");
      const users = usersJSON ? JSON.parse(usersJSON) : [];

      // Check if email already exists
      const userExists = users.some((user: any) => user.email === email);
      if (userExists) {
        setError("User already registered. Please login.");
        setSuccess("");
        return;
      }

      // Add new user to array
      const newUser = { email, password };
      users.push(newUser);

      // Save updated array
      await AsyncStorage.setItem("@users", JSON.stringify(users));

      setError("");
      setSuccess("Account created successfully");

      setTimeout(() => {
        navigation.replace("Login");
      }, 1200);
    } catch (err) {
      console.log(err);
      setError("Something went wrong. Please try again.");
      setSuccess("");
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
          <Text style={styles.title}>Welcome!</Text>
          <Text style={styles.subtitle}>Start your journey today.</Text>

          {/* Card */}
          <View style={styles.card}>
            {/* Error */}
            {error ? <Text style={styles.error}>{error}</Text> : null}
            {success ? <Text style={styles.success}>{success}</Text> : null}

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
                  setError("");
                  setSuccess("");
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                cursorColor="#6C4E39"
                selectionColor="#6C4E39"
                autoCorrect={false}
                autoComplete="off"
                importantForAutofill="no"
                autoComplete="off"
                caretHidden={false}
              />
            </View>

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
                style={styles.input}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setError("");
                  setSuccess("");
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

            {/* Confirm Password */}
            <View style={styles.inputWrapper}>
              <MaterialCommunityIcons
                name="lock-check-outline"
                size={20}
                color="#6C4E39"
              />
              <TextInput
                placeholder="Confirm your password"
                placeholderTextColor="#8D8271"
                style={styles.input}
                secureTextEntry={!showConfirm}
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  setError("");
                  setSuccess("");
                }}
                cursorColor="#6C4E39"
              />
              <Pressable onPress={() => setShowConfirm(!showConfirm)}>
                <MaterialCommunityIcons
                  name={showConfirm ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#6C6C74"
                />
              </Pressable>
            </View>

            <Pressable style={({ pressed }) => [
                           styles.primaryBtn,
                           pressed && styles.primaryBtnPressed,
                         ]}
                     onPress={handleRegister}>
              <Text style={styles.primaryText}>Create Your Account</Text>
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

          <Text style={styles.footerText}>
            Already have an account?{" "}
            <Text
              style={styles.link}
              onPress={() => navigation.navigate("Login")}
            >
              Sign in
            </Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );};


export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EFE5D1",
    paddingHorizontal: 24,
    paddingTop: 70,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1E1E1E",
  },

  subtitle: {
    marginTop: 6,
    fontSize: 15,
    color: "#6C6C74",
    marginBottom: 26,
  },

  card: {
    paddingVertical: 20,
    marginTop: 15,
  },

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
    paddingVertical: 14,
    paddingLeft: 10,
    fontSize: 15,
    color: "#1E1E1E",
  },

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

  footerText: {
    textAlign: "center",
    marginTop: 24,
    color: "#453B27",
  },

  link: {
    color: "#6A4B34",
    fontWeight: "600",
  },

  error: {
    color: "#B00020",
    fontSize: 13,
    marginBottom: 15,
    textAlign: "center",
  },

  success: {
    color: "#2E7D32",
    fontSize: 13,
    marginBottom: 12,
    textAlign: "center",
    fontWeight: "500",
  },

  /* ===== DIVIDER ===== */
    dividerRow: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 45,
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

});
