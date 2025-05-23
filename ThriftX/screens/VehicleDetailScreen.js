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

  return (
    <LinearGradient
      colors={[COLORS.primary, COLORS.secondary]}
      style={styles.container}
    >
      <ScrollView>
        <Image
          source={{
            uri: vehicle.image || require("../assets/images/placeholder.png"),
          }}
          style={styles.image}
        />
        <View style={styles.content}>
          <Text style={styles.title}>{vehicle.title}</Text>
          <Text style={styles.price}>{formatPrice(vehicle.price)}</Text>
          <View style={styles.details}>
            <Text style={styles.detailText}>Category: {vehicle.category}</Text>
            <Text style={styles.detailText}>Location: {vehicle.location}</Text>
            <Text style={styles.detailText}>Year: {vehicle.year}</Text>
            <Text style={styles.detailText}>Mileage: {vehicle.mileage} km</Text>
          </View>
          <Text style={styles.description}>{vehicle.description}</Text>
          <TouchableOpacity
            style={styles.messageButton}
            onPress={() =>
              navigation.navigate("Chat", { sellerId: vehicle.sellerId })
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

const styles = StyleSheet.create({
  container: { flex: 1 },
  image: { width: "100%", height: 300, resizeMode: "cover" },
  content: { padding: 16 },
  title: { fontSize: 24, color: "#fff", fontWeight: "bold", marginBottom: 8 },
  price: { fontSize: 20, color: COLORS.accent, marginBottom: 16 },
  details: { marginBottom: 16 },
  detailText: { fontSize: 16, color: "#fff", marginBottom: 4 },
  description: { fontSize: 16, color: "#fff", marginBottom: 20 },
  messageButton: {
    flexDirection: "row",
    backgroundColor: COLORS.accent,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  messageButtonText: { color: "#fff", fontSize: 18, marginLeft: 8 },
});

export default VehicleDetailScreen;
