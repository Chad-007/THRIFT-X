import React, { useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import VehicleCard from "../components/VehicleCard";
import { COLORS } from "../utils/constants";

const mockUser = { displayName: "Alex Johnson" };
const mockListings = [
  {
    id: "1",
    title: "Toyota Camry 2022",
    price: 25000,
    location: "New York, NY",
    image: "https://images.unsplash.com/photo-1580273916550-ebdde42186d7",
    category: "Car",
    year: 2022,
    mileage: 15000,
  },
  {
    id: "2",
    title: "Honda CB500F",
    price: 6500,
    location: "Los Angeles, CA",
    image: "https://images.unsplash.com/photo-1558981403-c5f9899a7ef7",
    category: "Bike",
    year: 2020,
    mileage: 8000,
  },
];

const ProfileScreen = ({ navigation }) => {
  const [user] = useState(mockUser);
  const [listings] = useState(mockListings);
  const logoutButtonScale = useRef(new Animated.Value(1)).current;

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
    <LinearGradient
      colors={[COLORS.primary, COLORS.secondary]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{user?.displayName || "User Profile"}</Text>
        <TouchableOpacity onPress={handleLogout}>
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
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 40 }, // Reduced
  header: {
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    color: COLORS.accent,
    fontWeight: "700",
    fontFamily: "Roboto",
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.accent,
    padding: 12,
    fontWeight: "600",
    fontFamily: "Roboto",
  },
  list: { padding: 12, paddingBottom: 60 },
  logoutButton: {
    backgroundColor: COLORS.accent,
    padding: 8,
    borderRadius: 8,
    shadowColor: COLORS.textSecondary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  logoutButtonText: {
    color: COLORS.inputBackground,
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Roboto",
  },
});

export default ProfileScreen;
