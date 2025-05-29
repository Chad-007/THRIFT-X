import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
  Platform, // Added for font consistency
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";

// Re-using COLORS and DESIGN_TOKENS from HomeScreen for consistency
const COLORS = {
  backgroundDark: "#1A1A2E", // Deep blue-black
  surfaceDark: "#2C2C40", // Slightly lighter blue-black for cards/surfaces

  accentPrimary: "#4A90E2", // Professional, vibrant blue for primary actions
  accentSecondary: "#A0A0A0", // Muted grey for secondary elements and icons

  textPrimary: "#F0F0F0", // Bright off-white for main headings and important text
  textSecondary: "#C0C0C0", // Lighter grey for descriptions and labels
  textPlaceholder: "#888888", // Clearer grey for less prominent text

  white: "#FFFFFF",
  black: "#000000",
  error: "#E74C3C", // Standard red for error messages
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

const VehicleCard = ({ vehicle, onPress, animatedStyle }) => {
  return (
    <Animated.View style={[styles.card, animatedStyle]}>
      <TouchableOpacity activeOpacity={0.85} onPress={onPress}>
        <LinearGradient
          colors={[COLORS.surfaceDark, COLORS.backgroundDark]} // Subtle gradient for the card background
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <Image
            source={
              vehicle.imageUrl
                ? { uri: vehicle.imageUrl }
                : require("../assets/images/placeholder.png") // Ensure this path is correct
            }
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.infoContainer}>
            <Text style={styles.title} numberOfLines={1}>
              {vehicle.title || "Unknown Model"}
            </Text>
            <Text style={styles.yearPrice}>
              <Text style={styles.year}>{vehicle.year || "Year N/A"}</Text> •{" "}
              <Text style={styles.price}>
                ${vehicle.price?.toLocaleString() || "0"}
              </Text>
            </Text>
            <Text style={styles.location} numberOfLines={1}>
              {vehicle.location || "Location Unknown"}
            </Text>
            <View style={styles.stats}>
              <View style={styles.statItem}>
                <Icon name="speed" size={16} color={COLORS.accentSecondary} />
                <Text style={styles.statText}>
                  {vehicle.mileage ? `${vehicle.mileage} km` : "N/A"}
                </Text>
              </View>
              <View style={styles.statItem}>
                <Icon
                  name="category"
                  size={16}
                  color={COLORS.accentSecondary}
                />
                <Text style={styles.statText}>{vehicle.category || "N/A"}</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: DESIGN_TOKENS.spacing.md,
    borderRadius: DESIGN_TOKENS.borderRadius.lg,
    overflow: "hidden",
    ...DESIGN_TOKENS.shadows.md, // Using a consistent shadow token
    backgroundColor: COLORS.surfaceDark, // Fallback background
  },
  gradient: {
    flexDirection: "row",
    padding: DESIGN_TOKENS.spacing.md,
    alignItems: "center",
  },
  image: {
    width: 110, // Slightly larger image
    height: 80,
    borderRadius: DESIGN_TOKENS.borderRadius.md,
    marginRight: DESIGN_TOKENS.spacing.md,
    backgroundColor: COLORS.backgroundDark, // Placeholder color
    borderWidth: 1,
    borderColor: COLORS.surfaceDark, // Subtle border
  },
  infoContainer: {
    flex: 1,
  },
  title: {
    ...DESIGN_TOKENS.typography.h3, // Using h3 for title
    fontSize: 19, // Slightly adjusted size
    fontWeight: "700",
    color: COLORS.textPrimary,
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto", // Consistent font family
    marginBottom: DESIGN_TOKENS.spacing.xs,
  },
  yearPrice: {
    ...DESIGN_TOKENS.typography.body, // Using body for year/price line
    fontSize: 15, // Adjusted size
    color: COLORS.textSecondary,
    marginBottom: DESIGN_TOKENS.spacing.sm,
  },
  year: {
    fontWeight: "600",
    color: COLORS.accentPrimary, // Year in primary accent color
  },
  price: {
    fontWeight: "700",
    color: COLORS.accentPrimary, // Price in primary accent color
  },
  location: {
    ...DESIGN_TOKENS.typography.caption, // Using caption for location
    fontSize: 13, // Adjusted size
    color: COLORS.textSecondary,
    marginBottom: DESIGN_TOKENS.spacing.sm,
    fontStyle: "italic",
    opacity: 0.8, // Slightly faded for subtlety
  },
  stats: {
    flexDirection: "row",
    gap: DESIGN_TOKENS.spacing.lg, // Increased gap for better spacing
    marginTop: DESIGN_TOKENS.spacing.xs, // Small top margin
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: DESIGN_TOKENS.spacing.xs, // Consistent gap for icon and text
  },
  statText: {
    ...DESIGN_TOKENS.typography.small, // Using small for stat text
    color: COLORS.textSecondary, // Stats text in secondary color
    fontWeight: "600",
    fontSize: 13, // Adjusted size
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto", // Consistent font family
  },
});

export default VehicleCard;
