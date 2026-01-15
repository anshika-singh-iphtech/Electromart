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
import { launchImageLibrary } from "react-native-image-picker";

const RegisterScreen = () => {
  const navigation = useNavigation<any>();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("Female");
  const [profilePic, setProfilePic] = useState(null);

  const defaultProfilePic = Image.resolveAssetSource(
    require("../assets/images/appleIcon.png")
  ).uri;

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
      const newUser = {
        profilePic: profilePic ? profilePic : defaultProfilePic,
        name,
        email,
        password,
        phone,
        address,
        gender,
      };

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

  const selectProfileImage = () => {
    launchImageLibrary({ mediaType: "photo", quality: 0.7 }, (response) => {
      if (response.didCancel) return;
      if (response.errorCode) {
        console.log("Image Error:", response.errorMessage);
        return;
      }

      if (response.assets?.length > 0) {
        setProfilePic(response.assets[0].uri);
      }
    });
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
          <Text style={styles.title}>Register !!!</Text>
          <Text style={styles.subtitle}>Start your journey today.</Text>

          {/* Card */}
          <View style={styles.card}>
            {/* Error */}
            {error ? <Text style={styles.error}>{error}</Text> : null}
            {success ? <Text style={styles.success}>{success}</Text> : null}

            {/* Profile Picture */}
            <View style={{ alignItems: "center", marginBottom: 20 }}>
              <Image
                source={
                  profilePic
                    ? { uri: profilePic }
                    : require("../assets/images/appleIcon.png") // default image
                }
                style={{
                  height: 90,
                  width: 90,
                  borderRadius: 45,
                  marginBottom: 10,
                }}
              />

              <Pressable
                onPress={selectProfileImage}
                style={{
                  backgroundColor: "#6C4E39",
                  paddingVertical: 6,
                  paddingHorizontal: 15,
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: "white", fontSize: 13 }}>Choose Image</Text>
              </Pressable>
            </View>

            {/* Name */}
            <View style={styles.inputWrapper}>
              <MaterialCommunityIcons name="account-outline" size={20} color="#6C4E39" />
              <TextInput
                placeholder="Enter your name"
                placeholderTextColor="#8D8271"
                style={styles.input}
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  setError("");
                  setSuccess("");
                }}
                cursorColor="#6C4E39"
              />
            </View>

            {/* Phone */}
            <View style={styles.inputWrapper}>
              <MaterialCommunityIcons name="phone-outline" size={20} color="#6C4E39" />
              <TextInput
                placeholder="Enter your phone number"
                placeholderTextColor="#8D8271"
                style={styles.input}
                keyboardType="numeric"
                value={phone}
                onChangeText={(text) => {
                  setPhone(text);
                  setError("");
                  setSuccess("");
                }}
                cursorColor="#6C4E39"
              />
            </View>

            {/* Address */}
            <View style={styles.inputWrapper}>
              <MaterialCommunityIcons name="map-marker-outline" size={20} color="#6C4E39" />
              <TextInput
                placeholder="Enter your address"
                placeholderTextColor="#8D8271"
                style={styles.input}
                value={address}
                onChangeText={(text) => {
                  setAddress(text);
                  setError("");
                  setSuccess("");
                }}
                cursorColor="#6C4E39"
              />
            </View>

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

            {/* Gender */}
            <View style={{ marginVertical: 12, marginHorizontal: 6}}>
              <Text style={{ color: "#6C4E39", marginBottom: 10, fontSize: 14 }}>
                Select Gender
              </Text>

              <View style={{ flexDirection: "row", alignItems: "center", gap: 20 }}>

                {/* Male */}
                <Pressable
                  style={{ flexDirection: "row", alignItems: "center" }}
                  onPress={() => setGender("Male")}
                >
                  <View
                    style={{
                      height: 18,
                      width: 18,
                      borderRadius: 9,
                      borderWidth: 2,
                      borderColor: "#6C4E39",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 6,
                    }}
                  >
                    {gender === "Male" && (
                      <View
                        style={{
                          height: 10,
                          width: 10,
                          borderRadius: 5,
                          backgroundColor: "#6C4E39",
                        }}
                      />
                    )}
                  </View>
                  <Text style={{ color: "#6C4E39" }}>Male</Text>
                </Pressable>

                {/* Female */}
                <Pressable
                  style={{ flexDirection: "row", alignItems: "center" }}
                  onPress={() => setGender("Female")}
                >
                  <View
                    style={{
                      height: 18,
                      width: 18,
                      borderRadius: 9,
                      borderWidth: 2,
                      borderColor: "#6C4E39",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 6,
                    }}
                  >
                    {gender === "Female" && (
                      <View
                        style={{
                          height: 10,
                          width: 10,
                          borderRadius: 5,
                          backgroundColor: "#6C4E39",
                        }}
                      />
                    )}
                  </View>
                  <Text style={{ color: "#6C4E39" }}>Female</Text>
                </Pressable>

                {/* Other */}
                <Pressable
                  style={{ flexDirection: "row", alignItems: "center" }}
                  onPress={() => setGender("Other")}
                >
                  <View
                    style={{
                      height: 18,
                      width: 18,
                      borderRadius: 9,
                      borderWidth: 2,
                      borderColor: "#6C4E39",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 6,
                    }}
                  >
                    {gender === "Other" && (
                      <View
                        style={{
                          height: 10,
                          width: 10,
                          borderRadius: 5,
                          backgroundColor: "#6C4E39",
                        }}
                      />
                    )}
                  </View>
                  <Text style={{ color: "#6C4E39" }}>Other</Text>
                </Pressable>

              </View>
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
                <Pressable>
                  <Image
                    source={require("../assets/images/googleIcon.png")}
                    style={styles.iconSize}
                  />
                </Pressable>
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
    paddingVertical: 30,
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
    marginBottom: 6,
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
      marginVertical: 25,
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
