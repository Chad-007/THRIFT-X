import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";
import { COLORS } from "../utils/constants";

const VehicleCard = ({ vehicle, onPress, animatedStyle }) => {
  return (
    <Animated.View style={[styles.card, animatedStyle]}>
      <TouchableOpacity activeOpacity={0.85} onPress={onPress}>
        <LinearGradient
          colors={[COLORS.cardGradientStart, COLORS.cardGradientEnd]}
          style={styles.gradient}
        >
          <Image
            source={
              vehicle.imageUrl
                ? { uri: vehicle.imageUrl }
                : require("../assets/images/placeholder.png")
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
            <Text style={styles.location}>
              {vehicle.location || "Location Unknown"}
            </Text>
            <View style={styles.stats}>
              <View style={styles.statItem}>
                <Icon name="speed" size={16} color={COLORS.accent} />
                <Text style={styles.statText}>
                  {vehicle.mileage ? `${vehicle.mileage} km` : "N/A"}
                </Text>
              </View>
              <View style={styles.statItem}>
                <Icon name="category" size={16} color={COLORS.accent} />
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
    marginBottom: 16,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  gradient: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
  },
  image: {
    width: 100,
    height: 70,
    borderRadius: 12,
    marginRight: 16,
    backgroundColor: COLORS.dark,
  },
  infoContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textPrimary,
    fontFamily: "Roboto",
    marginBottom: 4,
  },
  yearPrice: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  year: {
    fontWeight: "600",
    color: COLORS.accent,
  },
  price: {
    fontWeight: "700",
    color: COLORS.accent,
  },
  location: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 8,
    fontStyle: "italic",
  },
  stats: {
    flexDirection: "row",
    gap: 20,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statText: {
    color: COLORS.accent,
    fontWeight: "600",
    fontSize: 13,
  },
});

export default VehicleCard;
