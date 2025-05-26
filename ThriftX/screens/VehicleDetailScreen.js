import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";
import { COLORS, formatPrice } from "../utils/constants";

const VehicleDetailScreen = ({ route, navigation }) => {
  const { vehicle } = route.params;
  console.log("VehicleDetailScreen rendered with vehicle:", vehicle);
  console.log(vehicle.user);
  const displayValue = (value) =>
    value !== null && value !== undefined && value !== "" ? value : "N/A";

  return (
    <LinearGradient
      colors={[COLORS.primary, COLORS.secondary]}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image
          source={
            vehicle.image
              ? { uri: vehicle.image }
              : require("../assets/images/placeholder.png")
          }
          style={styles.image}
          resizeMode="cover"
        />

        <View style={styles.contentCard}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>{displayValue(vehicle.title)}</Text>
            <Text style={styles.price}>
              {formatPrice(vehicle.price) || "N/A"}
            </Text>
          </View>

          <View style={styles.detailsSection}>
            <DetailItem
              label="Category"
              value={displayValue(vehicle.category)}
            />
            <DetailItem
              label="Location"
              value={displayValue(vehicle.location)}
            />
            <DetailItem label="Year" value={displayValue(vehicle.year)} />
            <DetailItem
              label="Mileage"
              value={
                vehicle.mileage !== null && vehicle.mileage !== undefined
                  ? `${vehicle.mileage} km`
                  : "N/A"
              }
            />
          </View>
          <Text style={styles.description}>
            {displayValue(vehicle.description)}
          </Text>
          <TouchableOpacity
            style={styles.messageButton}
            onPress={() =>
              navigation.navigate("Chatt", {
                sellerId: vehicle.user,
                adId: vehicle.id,
              })
            }
          >
            <Icon name="message" size={24} color="#fff" />
            <Text style={styles.messageButtonText}>Message Seller</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};
const DetailItem = ({ label, value }) => (
  <View style={styles.detailItem}>
    <Text style={styles.detailLabel}>{label}:</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);
const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    paddingBottom: 20,
  },
  image: {
    width: "100%",
    height: 300,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  contentCard: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    marginHorizontal: 16,
    marginTop: -30,
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    flex: 1,
    marginRight: 10,
  },
  price: {
    fontSize: 22,
    fontWeight: "600",
    color: COLORS.accent,
  },
  detailsSection: {
    marginBottom: 20,
  },
  detailItem: {
    flexDirection: "row",
    marginBottom: 8,
  },
  detailLabel: {
    fontWeight: "600",
    color: "#222",
    width: 90,
  },
  detailValue: {
    color: "#222",
    flexShrink: 1,
  },
  description: {
    fontSize: 16,
    color: "#222",
    marginBottom: 30,
    lineHeight: 22,
  },
  messageButton: {
    flexDirection: "row",
    backgroundColor: COLORS.accent,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.accent,
    shadowOpacity: 0.6,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  messageButtonText: {
    color: "#fff",
    fontSize: 20,
    marginLeft: 10,
    fontWeight: "600",
  },
});

export default VehicleDetailScreen;
