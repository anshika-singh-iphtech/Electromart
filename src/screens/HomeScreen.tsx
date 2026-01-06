import React, { useEffect, useRef } from "react";
import { Text, StyleSheet, Animated, Image } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type Props = NativeStackScreenProps<any, "Home">;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const scaleAnim = useRef(new Animated.Value(0.7)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      navigation.replace("Register");
    }, 1000); // 👈 exactly 1 second

    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient
      colors={["#FFF4E6", "#FFE2C6"]}
      style={styles.container}
    >
      <Animated.Image
        source={{
          uri: "https://cdn-icons-png.flaticon.com/512/891/891462.png",
        }}
        style={[
          styles.image,
          {
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          },
        ]}
      />

      <Animated.Text style={[styles.title, { opacity: opacityAnim }]}>
        ElectroMart
      </Animated.Text>

      <Animated.Text style={[styles.subtitle, { opacity: opacityAnim }]}>
        Smart shopping for everyday electronics
      </Animated.Text>
    </LinearGradient>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  image: {
    width: 140,
    height: 140,
    marginBottom: 22,
    tintColor: "#FF7A45", // matches theme
  },

  title: {
    fontSize: 36,
    fontWeight: "800",
    color: "#4A2C1D", // dark warm brown
    letterSpacing: 1.2,
  },

  subtitle: {
    fontSize: 14,
    color: "#7A5C4A",
    marginTop: 8,
  },
});
