import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import Icon from "react-native-vector-icons/MaterialIcons";

const COLORS = {
  backgroundDark: "#1A1A2E",
  surfaceDark: "#2C2C40",
  accentPrimary: "#007BFF",
  accentSecondary: "#6C757D",
  textPrimary: "#E0E0E0",
  textSecondary: "#B0B0B0",
  textPlaceholder: "#707070",
  white: "#FFFFFF",
  black: "#000000",
  error: "#DC3545",
  green: "#28A745",
  grey: "#6C757D",
};

const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

const TYPOGRAPHY = {
  h1: { fontSize: 30, fontWeight: "700", color: COLORS.textPrimary },
  h2: { fontSize: 24, fontWeight: "600", color: COLORS.textPrimary },
  h3: { fontSize: 20, fontWeight: "600", color: COLORS.textPrimary },
  body: {
    fontSize: 16,
    fontWeight: "400",
    color: COLORS.textSecondary,
    lineHeight: 24,
  },
  caption: { fontSize: 14, fontWeight: "500", color: COLORS.textPlaceholder },
  button: { fontSize: 18, fontWeight: "600", color: COLORS.white },
};

const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 20,
  xl: 28,
  full: 999,
};

const formatPrice = (price) => {
  if (price === null || price === undefined) return "N/A";
  return `$${price.toLocaleString("en-US")}`;
};

const VehicleDetailScreen = ({ route, navigation }) => {
  const { vehicle } = route.params;

  if (!vehicle) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>Vehicle data not available.</Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButtonOnError}
        >
          <Text style={styles.backButtonTextOnError}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const displayValue = (value, suffix = "") =>
    value !== null && value !== undefined && value !== ""
      ? `${value}${suffix}`
      : "N/A";

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.backgroundDark}
      />
      <LinearGradient
        colors={
          vehicle.gradientColors || [COLORS.backgroundDark, COLORS.surfaceDark]
        }
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.imageContainer}>
            <Image
              source={
                vehicle.imageUrl
                  ? { uri: vehicle.imageUrl }
                  : require("../assets/images/placeholder.png")
              }
              style={styles.image}
              resizeMode="cover"
            />
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.7)"]}
              style={styles.imageOverlay}
            />
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Icon
                name="arrow-back-ios"
                size={24}
                color={COLORS.white}
                style={{ marginLeft: SPACING.sm }}
              />
            </TouchableOpacity>
          </View>

          <BlurView
            intensity={Platform.OS === "ios" ? 60 : 90}
            tint="dark"
            style={styles.contentCard}
          >
            <View style={styles.headerRow}>
              <Text style={styles.title}>{displayValue(vehicle.title)}</Text>
              <View style={styles.priceContainer}>
                <Text style={styles.price}>
                  {formatPrice(vehicle.price) || "N/A"}
                </Text>
              </View>
            </View>

            <View style={styles.detailsSection}>
              <View style={styles.detailRow}>
                <DetailItem
                  icon="category"
                  label="Category"
                  value={displayValue(vehicle.category)}
                />
                <DetailItem
                  icon="location-on"
                  label="Location"
                  value={displayValue(vehicle.location)}
                />
              </View>
              <View style={styles.detailRow}>
                <DetailItem
                  icon="event"
                  label="Year"
                  value={displayValue(vehicle.year?.toString())}
                />
                <DetailItem
                  icon="speed"
                  label="Mileage"
                  value={displayValue(vehicle.mileage, " km")}
                />
              </View>
            </View>

            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>
              {displayValue(vehicle.description)}
            </Text>

            <TouchableOpacity
              style={styles.messageButton}
              onPress={() =>
                navigation.navigate("Chatt", {
                  sellerId: vehicle.user || vehicle.userId,
                  adId: vehicle.id,
                  vehicleTitle: vehicle.title,
                  vehicleImage: vehicle.imageUrl,
                })
              }
            >
              <View style={styles.messageButtonContent}>
                <Icon name="chat-bubble" size={22} color={COLORS.green} />
                <Text style={styles.messageButtonText}>Message Seller</Text>
              </View>
            </TouchableOpacity>
          </BlurView>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const DetailItem = ({ icon, label, value }) => (
  <View style={styles.detailItemContainer}>
    <Icon
      name={icon}
      size={20}
      color={COLORS.accentSecondary}
      style={styles.detailIcon}
    />
    <View>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.backgroundDark,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SPACING.xxl + SPACING.lg,
  },
  imageContainer: {
    width: "100%",
    height: 380,
    backgroundColor: COLORS.surfaceDark,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 200,
  },
  backButton: {
    position: "absolute",
    top:
      Platform.OS === "android"
        ? StatusBar.currentHeight + SPACING.md
        : SPACING.xl,
    left: SPACING.md,
    backgroundColor: "rgba(30, 30, 30, 0.6)",
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    zIndex: 10,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  contentCard: {
    marginHorizontal: SPACING.md,
    marginTop: -SPACING.xxl - SPACING.md,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    overflow: "hidden",
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 10,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: SPACING.lg,
  },
  title: {
    ...TYPOGRAPHY.h1,
    flex: 1,
    marginRight: SPACING.md,
    lineHeight: 38,
  },
  priceContainer: {
    borderWidth: 2,
    borderColor: COLORS.green,
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  price: {
    ...TYPOGRAPHY.h2,
    color: COLORS.white,
    fontWeight: "bold",
  },
  detailsSection: {
    marginBottom: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.surfaceDark,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SPACING.md,
  },
  detailItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    maxWidth: "48%",
  },
  detailIcon: {
    marginRight: SPACING.sm,
  },
  detailLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textPlaceholder,
    fontSize: 13,
    marginBottom: SPACING.xs / 2,
  },
  detailValue: {
    ...TYPOGRAPHY.body,
    fontWeight: "600",
    color: COLORS.textPrimary,
    fontSize: 15,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    fontSize: 18,
    marginBottom: SPACING.sm,
    color: COLORS.textPrimary,
    marginTop: SPACING.md,
  },
  description: {
    ...TYPOGRAPHY.body,
    marginBottom: SPACING.xl,
  },
  messageButton: {
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 2,
    borderColor: COLORS.white,
    overflow: "hidden",

    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  messageButtonContent: {
    flexDirection: "row",
    paddingVertical: SPACING.md,
    alignItems: "center",
    justifyContent: "center",
  },
  messageButtonText: {
    ...TYPOGRAPHY.button,
    marginLeft: SPACING.sm,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.lg,
    backgroundColor: COLORS.backgroundDark,
  },
  errorText: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
    textAlign: "center",
    marginBottom: SPACING.lg,
  },
  backButtonOnError: {
    backgroundColor: COLORS.accentPrimary,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
  },
  backButtonTextOnError: {
    ...TYPOGRAPHY.button,
    color: COLORS.white,
  },
});

export default VehicleDetailScreen;
