import React, { useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Image,
} from "react-native";
import { Easing } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS } from "../utils/constants";

const IntroScreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const handleGetStarted = async () => {
    await AsyncStorage.setItem("hasSeenIntro", "true");
    navigation.navigate("Login");
  };

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <LinearGradient
      colors={[COLORS.primary, COLORS.secondary]}
      style={styles.container}
    >
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <Image
          source={require("../assets/images/logo.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>Welcome to Vehicle Marketplace</Text>
        <Text style={styles.subtitle}>
          Buy and sell cars, bikes, and more with ease!
        </Text>
        <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  content: { alignItems: "center", padding: 20 },
  logo: { width: 100, height: 100, marginBottom: 20 },
  title: {
    fontSize: 32,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#fff",
    marginVertical: 20,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: { fontSize: 18, color: COLORS.primary, fontWeight: "bold" },
});

export default IntroScreen;
