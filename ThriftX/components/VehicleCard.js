import React, { useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { formatPrice } from "../utils/helpers";
import { COLORS } from "../utils/constants";

const VehicleCard = ({ vehicle, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      friction: 6,
      tension: 40,
      useNativeDriver: true,
    }).start(() => {
      scaleAnim.setValue(1);
      onPress();
    });
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <Animated.View
        style={[styles.card, { transform: [{ scale: scaleAnim }] }]}
      >
        <View style={styles.imageContainer}>
          <Image
            source={
              vehicle.image
                ? { uri: vehicle.image }
                : require("../assets/images/placeholder.png")
            }
            style={styles.image}
          />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.6)"]}
            style={styles.imageOverlay}
          />
          <Text style={styles.category}>{vehicle.category}</Text>
        </View>
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={1}>
            {vehicle.title}
          </Text>
          <Text style={styles.price}>{formatPrice(vehicle.price)}</Text>
          <Text style={styles.location}>{vehicle.location}</Text>
          <Text style={styles.details}>
            {vehicle.year} • {vehicle.mileage} km
          </Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: COLORS.inputBackground, // White
    borderRadius: 10, // Smaller radius
    marginBottom: 12, // Tighter spacing
    borderWidth: 1,
    borderColor: COLORS.border, // Light gray
    shadowColor: COLORS.textSecondary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    overflow: "hidden",
  },
  imageContainer: { position: "relative" },
  image: {
    width: 120, // Smaller image
    height: 100, // Compact height
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "50%",
    borderBottomLeftRadius: 10,
  },
  category: {
    position: "absolute",
    bottom: 6,
    left: 6,
    color: COLORS.inputBackground, // White
    fontSize: 12, // Smaller font
    fontWeight: "600",
    fontFamily: "Roboto",
    textShadowColor: "rgba(0, 0, 0, 0.4)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  content: { flex: 1, padding: 10 }, // Reduced padding
  title: {
    fontSize: 16, // Smaller
    fontWeight: "600",
    color: COLORS.textPrimary, // Dark gray
    fontFamily: "Roboto",
    marginBottom: 3,
  },
  price: {
    fontSize: 14, // Smaller
    color: COLORS.accent, // Teal
    fontWeight: "600",
    fontFamily: "Roboto",
    marginBottom: 3,
  },
  location: {
    fontSize: 12, // Smaller
    color: COLORS.textSecondary, // Medium gray
    fontFamily: "Roboto",
    marginBottom: 3,
  },
  details: {
    fontSize: 11, // Smaller
    color: COLORS.textSecondary,
    fontFamily: "Roboto",
  },
});

export default VehicleCard;
