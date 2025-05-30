import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
const signedImageUrl =
  "https://xdqevezazwvadambeqmz.supabase.co/storage/v1/object/public/image/vehicle_1748617437358.jpeg";
const COLORS = {
  backgroundDark: "#1C1C1E",
  surfaceDark: "#2A2A2E",

  accentPrimary: "#2ECC71",
  accentSecondary: "#27AE60",

  textPrimary: "#FFFFFF",
  textSecondary: "#F0F0F0",
  textPlaceholder: "#CCCCCC",
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
    color: COLORS.textPrimary,
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
};

const DESIGN_TOKENS = {
  spacing: SPACING,
  borderRadius: BORDER_RADIUS,
  typography: TYPOGRAPHY,
  shadows: {
    md: {
      shadowColor: COLORS.black,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
  },
};
const VehicleCard = ({ vehicle, onPress, animatedStyle }) => {
  return (
    <Animated.View style={[styles.card, animatedStyle]}>
      <TouchableOpacity activeOpacity={0.85} onPress={onPress}>
        <View style={styles.content}>
          <Image source={{ uri: vehicle.imageUrl }} style={styles.image} />
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
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 160,
    margin: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    overflow: "hidden",
    backgroundColor: COLORS.surfaceDark,
    ...DESIGN_TOKENS.shadows.md,
  },

  content: {
    flexDirection: "column",
    padding: SPACING.sm,
    alignItems: "flex-start",
  },

  image: {
    width: "100%",
    height: 100,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.backgroundDark,
    marginBottom: SPACING.sm,
  },

  title: {
    ...TYPOGRAPHY.h3,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: SPACING.xs,
  },

  yearPrice: {
    fontSize: 14,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },

  location: {
    fontSize: 12,
    fontStyle: "italic",
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },

  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
    marginRight: SPACING.md,
  },

  statText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
});

export default VehicleCard;
