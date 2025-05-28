import React, { useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  Animated,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";
import { COLORS } from "../utils/constants";

const { width } = Dimensions.get("window");

const VehicleDetailScreen = ({ route, navigation }) => {
  const { vehicle } = route.params;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <LinearGradient
      colors={[COLORS.dark, COLORS.black]}
      style={styles.container}
    >
      <Animated.ScrollView
        style={{ opacity: fadeAnim }}
        contentContainerStyle={{ paddingBottom: 40 }}
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
        <View style={styles.infoSection}>
          <Text style={styles.title}>{vehicle.title || "Unknown Model"}</Text>
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
              <Icon name="speed" size={22} color={COLORS.accent} />
              <Text style={styles.statText}>
                {vehicle.mileage ? `${vehicle.mileage} km` : "N/A"}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Icon name="category" size={22} color={COLORS.accent} />
              <Text style={styles.statText}>{vehicle.category || "N/A"}</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>
            {vehicle.description || "No description available."}
          </Text>
        </View>
      </Animated.ScrollView>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        activeOpacity={0.7}
      >
        <Icon name="arrow-back-ios" size={28} color={COLORS.textPrimary} />
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width,
    height: width * 0.6,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    backgroundColor: COLORS.dark,
  },
  infoSection: {
    padding: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: COLORS.accent,
    fontFamily: "Roboto",
    marginBottom: 8,
  },
  yearPrice: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  year: {
    fontWeight: "700",
    color: COLORS.accent,
  },
  price: {
    fontWeight: "800",
    color: COLORS.accent,
  },
  location: {
    fontSize: 15,
    fontStyle: "italic",
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  stats: {
    flexDirection: "row",
    gap: 30,
    marginBottom: 24,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statText: {
    color: COLORS.accent,
    fontWeight: "700",
    fontSize: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.accent,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: COLORS.textPrimary,
    lineHeight: 24,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 16,
    backgroundColor: COLORS.cardBackground,
    padding: 10,
    borderRadius: 30,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
  },
});

export default VehicleDetailScreen;
