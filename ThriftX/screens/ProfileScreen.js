import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Animated,
  SafeAreaView,
  StatusBar,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import VehicleCard from "../components/VehicleCard";
import AsyncStorage from "@react-native-async-storage/async-storage";

const COLORS = {
  backgroundDark: "#1A1A2E",
  surfaceDark: "#2C2C40",

  accentPrimary: "#4A90E2",
  accentSecondary: "#A0A0A0",

  textPrimary: "#F0F0F0",
  textSecondary: "#C0C0C0",
  textPlaceholder: "#888888",

  white: "#FFFFFF",
  black: "#000000",
  error: "#E74C3C",
};

const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

const TYPOGRAPHY = {
  h1: {
    fontSize: 32,
    fontWeight: "800",
    lineHeight: 40,
    color: COLORS.textPrimary,
  },
  h2: {
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 32,
    color: COLORS.textPrimary,
  },
  h3: {
    fontSize: 20,
    fontWeight: "600",
    lineHeight: 28,
    color: COLORS.textPrimary,
  },
  body: {
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 24,
    color: COLORS.textSecondary,
  },
  caption: {
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
    color: COLORS.textPlaceholder,
  },
  small: {
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 16,
    color: COLORS.textSecondary,
  },
  button: { fontSize: 18, fontWeight: "600", color: COLORS.white },
};

const DESIGN_TOKENS = {
  spacing: SPACING,
  borderRadius: BORDER_RADIUS,
  typography: TYPOGRAPHY,
  shadows: {
    sm: {
      shadowColor: COLORS.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    md: {
      shadowColor: COLORS.black,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    lg: {
      shadowColor: COLORS.black,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
  },
};

const mockUser = { displayName: "User Profile" };
const mockListings = [
  {
    id: "1",
    title: "Toyota Camry 2022",
    price: 25000,
    location: "New York, NY",
    imageUrl:
      "https://images.unsplash.com/photo-1580273916550-ebdde42186d7?auto=format&fit=crop&w=800&q=80",
    category: "Car",
    year: 2022,
    mileage: 15000,
  },
  {
    id: "2",
    title: "Honda CB500F",
    price: 6500,
    location: "Los Angeles, CA",
    imageUrl:
      "https://images.unsplash.com/photo-1558981403-c5f9899a7ef7?auto=format&fit=crop&w=800&q=80",
    category: "Bike",
    year: 2020,
    mileage: 8000,
  },
  {
    id: "3",
    title: "Ford F-150 2019",
    price: 32000,
    location: "Houston, TX",
    imageUrl:
      "https://images.unsplash.com/photo-1593361870631-0731f4a4f8b9?auto=format&fit=crop&w=800&q=80",
    category: "Truck",
    year: 2019,
    mileage: 45000,
  },
  {
    id: "4",
    title: "Tesla Model 3 2023",
    price: 48000,
    location: "San Francisco, CA",
    imageUrl:
      "https://images.unsplash.com/photo-1617469730596-f9e4f4d2f8e9?auto=format&fit=crop&w=800&q=80",
    category: "EV",
    year: 2023,
    mileage: 5000,
  },
];

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState(mockUser);
  const [listings] = useState(mockListings);
  const logoutButtonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loadUsername = async () => {
      try {
        const savedUsername = await AsyncStorage.getItem("username");
        if (savedUsername) {
          setUser((prev) => ({ ...prev, displayName: savedUsername }));
        }
      } catch (error) {
        console.error("Failed to load username from AsyncStorage:", error);
      }
    };
    loadUsername();
  }, []);

  const handleLogout = () => {
    Animated.spring(logoutButtonScale, {
      toValue: 0.95,
      friction: 6,
      tension: 40,
      useNativeDriver: true,
    }).start(() => {
      logoutButtonScale.setValue(1);
      navigation.navigate("Login");
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.backgroundDark}
      />
      <LinearGradient
        colors={[COLORS.backgroundDark, COLORS.black, "#0a0a0a"]}
        style={styles.container}
      >
        <View style={styles.header}>
          <Text style={styles.title}>
            {user?.displayName || "User Profile"}
          </Text>
          <TouchableOpacity onPress={handleLogout} activeOpacity={0.8}>
            <Animated.View
              style={[
                styles.logoutButton,
                { transform: [{ scale: logoutButtonScale }] },
              ]}
            >
              <Text style={styles.logoutButtonText}>Logout</Text>
            </Animated.View>
          </TouchableOpacity>
        </View>

        <Text style={styles.subtitle}>Your Listings</Text>

        <FlatList
          data={listings}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <VehicleCard
              vehicle={item}
              onPress={() =>
                navigation.navigate("VehicleDetail", { vehicle: item })
              }
            />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No listings found.</Text>
              <TouchableOpacity
                style={styles.postAdButton}
                onPress={() => navigation.navigate("PostAd")}
              >
                <Text style={styles.postAdButtonText}>Post Your First Ad</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.backgroundDark,
  },
  container: {
    flex: 1,
  },
  header: {
    padding: DESIGN_TOKENS.spacing.lg,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.surfaceDark,
    paddingTop:
      Platform.OS === "android"
        ? StatusBar.currentHeight + DESIGN_TOKENS.spacing.md
        : DESIGN_TOKENS.spacing.lg,
  },
  title: {
    ...DESIGN_TOKENS.typography.h2,
    color: COLORS.textPrimary,
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    letterSpacing: 0.5,
  },
  subtitle: {
    ...DESIGN_TOKENS.typography.h3,
    color: COLORS.textPrimary,
    padding: DESIGN_TOKENS.spacing.lg,
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    marginTop: DESIGN_TOKENS.spacing.md,
  },
  list: {
    paddingHorizontal: DESIGN_TOKENS.spacing.md,
    paddingBottom: DESIGN_TOKENS.spacing.xxl,
  },
  logoutButton: {
    backgroundColor: COLORS.accentSecondary,
    paddingVertical: DESIGN_TOKENS.spacing.sm,
    paddingHorizontal: DESIGN_TOKENS.spacing.md,
    borderRadius: DESIGN_TOKENS.borderRadius.md,
    ...DESIGN_TOKENS.shadows.sm,
  },
  logoutButtonText: {
    ...DESIGN_TOKENS.typography.button,
    fontSize: 14,
    color: COLORS.white,
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: DESIGN_TOKENS.spacing.xxl * 2,
  },
  emptyText: {
    ...DESIGN_TOKENS.typography.body,
    color: COLORS.textSecondary,
    marginBottom: DESIGN_TOKENS.spacing.lg,
  },
  postAdButton: {
    backgroundColor: COLORS.accentPrimary,
    paddingVertical: DESIGN_TOKENS.spacing.md,
    paddingHorizontal: DESIGN_TOKENS.spacing.xl,
    borderRadius: DESIGN_TOKENS.borderRadius.md,
    ...DESIGN_TOKENS.shadows.md,
  },
  postAdButtonText: {
    ...DESIGN_TOKENS.typography.button,
    color: COLORS.white,
  },
});

export default ProfileScreen;
