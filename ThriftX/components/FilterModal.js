// Professional Industry-Level FilterModal Component
// Enhanced with modern design patterns, consistent typography, and futuristic styling

import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  Animated,
  Dimensions,
  Platform,
  ScrollView,
  Pressable,
} from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";
import { COLORS } from "../utils/constants";

const { width, height } = Dimensions.get("window");

// Professional design tokens
const DESIGN_TOKENS = {
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },
  typography: {
    h1: { fontSize: 28, fontWeight: "800", lineHeight: 36 },
    h2: { fontSize: 22, fontWeight: "700", lineHeight: 30 },
    h3: { fontSize: 18, fontWeight: "600", lineHeight: 26 },
    body: { fontSize: 16, fontWeight: "400", lineHeight: 24 },
    caption: { fontSize: 14, fontWeight: "500", lineHeight: 20 },
    small: { fontSize: 12, fontWeight: "400", lineHeight: 16 },
  },
  shadows: {
    sm: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    md: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    lg: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.25,
      shadowRadius: 20,
      elevation: 12,
    },
  },
};

// Predefined categories for better UX
const VEHICLE_CATEGORIES = [
  { id: "Car", label: "Car", icon: "directions-car" },
  { id: "bike", label: "Motorcycle", icon: "two-wheeler" },
  { id: "truck", label: "Truck", icon: "local-shipping" },
  { id: "suv", label: "SUV", icon: "directions-car" },
  { id: "van", label: "Van", icon: "airport-shuttle" },
  { id: "other", label: "Other", icon: "more-horiz" },
];

const PRICE_RANGES = [
  { label: "Under ₹1L", min: 0, max: 100000 },
  { label: "₹1L - ₹5L", min: 100000, max: 500000 },
  { label: "₹5L - ₹10L", min: 500000, max: 1000000 },
  { label: "₹10L - ₹25L", min: 1000000, max: 2500000 },
  { label: "Above ₹25L", min: 2500000, max: 10000000 },
];

const FilterModal = ({
  visible,
  onClose,
  onApply,
  currentFilters,
  animation,
}) => {
  const [category, setCategory] = useState(currentFilters.category);
  const [minPrice, setMinPrice] = useState(
    currentFilters.priceRange[0].toString()
  );
  const [maxPrice, setMaxPrice] = useState(
    currentFilters.priceRange[1].toString()
  );
  const [location, setLocation] = useState(currentFilters.location);
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);

  // Animation references
  const slideAnimation = useRef(new Animated.Value(height)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const contentScale = useRef(new Animated.Value(0.9)).current;
  const buttonPressScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnimation, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(contentScale, {
          toValue: 1,
          friction: 6,
          tension: 65,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnimation, {
          toValue: height,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(contentScale, {
          toValue: 0.9,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleApply = () => {
    // Animate button press
    Animated.sequence([
      Animated.timing(buttonPressScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonPressScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    onApply({
      category,
      priceRange: [parseInt(minPrice) || 0, parseInt(maxPrice) || 1000000],
      location,
    });
  };

  const handleClearAll = () => {
    setCategory("");
    setMinPrice("0");
    setMaxPrice("1000000");
    setLocation("");
    setSelectedPriceRange(null);
  };

  const handlePriceRangeSelect = (range) => {
    setSelectedPriceRange(range);
    setMinPrice(range.min.toString());
    setMaxPrice(range.max.toString());
  };

  const renderCategorySelector = () => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Vehicle Category</Text>
      <View style={styles.categoryGrid}>
        {VEHICLE_CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[
              styles.categoryButton,
              category === cat.id && styles.categoryButtonActive,
            ]}
            onPress={() => setCategory(category === cat.id ? "" : cat.id)}
            activeOpacity={0.7}
          >
            <Icon
              name={cat.icon}
              size={20}
              color={category === cat.id ? COLORS.white : COLORS.textSecondary}
            />
            <Text
              style={[
                styles.categoryButtonText,
                category === cat.id && styles.categoryButtonTextActive,
              ]}
            >
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderPriceSelector = () => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Price Range</Text>

      {/* Quick Price Range Selection */}
      <View style={styles.priceRangeContainer}>
        {PRICE_RANGES.map((range, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.priceRangeButton,
              selectedPriceRange === range && styles.priceRangeButtonActive,
            ]}
            onPress={() => handlePriceRangeSelect(range)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.priceRangeButtonText,
                selectedPriceRange === range &&
                  styles.priceRangeButtonTextActive,
              ]}
            >
              {range.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Custom Price Range */}
      <Text style={styles.customPriceLabel}>Or set custom range:</Text>
      <View style={styles.priceInputContainer}>
        <View style={styles.priceInputWrapper}>
          <Text style={styles.currencySymbol}>₹</Text>
          <TextInput
            style={styles.priceInput}
            placeholder="Min Price"
            placeholderTextColor={COLORS.textSecondary}
            value={minPrice}
            onChangeText={(text) => {
              setMinPrice(text);
              setSelectedPriceRange(null);
            }}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.priceSeparator}>
          <Text style={styles.priceSeparatorText}>to</Text>
        </View>
        <View style={styles.priceInputWrapper}>
          <Text style={styles.currencySymbol}>₹</Text>
          <TextInput
            style={styles.priceInput}
            placeholder="Max Price"
            placeholderTextColor={COLORS.textSecondary}
            value={maxPrice}
            onChangeText={(text) => {
              setMaxPrice(text);
              setSelectedPriceRange(null);
            }}
            keyboardType="numeric"
          />
        </View>
      </View>
    </View>
  );

  const renderLocationSelector = () => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Location</Text>
      <View style={styles.inputContainer}>
        <Icon
          name="location-on"
          size={20}
          color={COLORS.textSecondary}
          style={styles.inputIcon}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Enter city or area"
          placeholderTextColor={COLORS.textSecondary}
          value={location}
          onChangeText={setLocation}
        />
        {location.length > 0 && (
          <TouchableOpacity
            onPress={() => setLocation("")}
            style={styles.clearInputButton}
          >
            <Icon name="clear" size={18} color={COLORS.textSecondary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const animatedModalStyle = {
    opacity: animation,
    transform: [
      {
        scale: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0.8, 1],
        }),
      },
    ],
  };

  const animatedBackdrop = {
    opacity: backdropOpacity,
  };

  const animatedContent = {
    transform: [{ translateY: slideAnimation }, { scale: contentScale }],
  };

  return (
    <Modal visible={visible} transparent animationType="none">
      <Animated.View style={[styles.modalOverlay, animatedBackdrop]}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <Animated.View style={[styles.modalContainer, animatedContent]}>
          <LinearGradient
            colors={["rgba(255, 255, 255, 0.95)", "rgba(255, 255, 255, 0.9)"]}
            style={styles.modalContent}
          >
            {/* Header */}
            <View style={styles.modalHeader}>
              <View style={styles.headerContent}>
                <Icon name="tune" size={24} color={COLORS.accent} />
                <Text style={styles.modalTitle}>Filter Vehicles</Text>
              </View>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={onClose}
                activeOpacity={0.7}
              >
                <Icon name="close" size={24} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {renderCategorySelector()}
              {renderPriceSelector()}
              {renderLocationSelector()}
            </ScrollView>

            {/* Action Buttons */}
            <View style={styles.actionContainer}>
              <TouchableOpacity
                style={styles.clearButton}
                onPress={handleClearAll}
                activeOpacity={0.7}
              >
                <Icon name="clear-all" size={18} color={COLORS.textSecondary} />
                <Text style={styles.clearButtonText}>Clear All</Text>
              </TouchableOpacity>

              <View style={styles.mainActions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={onClose}
                  activeOpacity={0.7}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <Animated.View
                  style={{ transform: [{ scale: buttonPressScale }] }}
                >
                  <TouchableOpacity
                    style={styles.applyButton}
                    onPress={handleApply}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={[COLORS.accent, "#2dd4bf"]}
                      style={styles.applyButtonGradient}
                    >
                      <Icon name="check" size={18} color={COLORS.white} />
                      <Text style={styles.applyButtonText}>Apply Filters</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </Animated.View>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "flex-end",
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    maxHeight: height * 0.9,
  },
  modalContent: {
    borderTopLeftRadius: DESIGN_TOKENS.borderRadius.xl,
    borderTopRightRadius: DESIGN_TOKENS.borderRadius.xl,
    ...DESIGN_TOKENS.shadows.lg,
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: DESIGN_TOKENS.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.08)",
    backgroundColor: "rgba(255, 255, 255, 0.98)",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: DESIGN_TOKENS.spacing.sm,
  },
  modalTitle: {
    ...DESIGN_TOKENS.typography.h2,
    color: COLORS.textPrimary,
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  closeButton: {
    padding: DESIGN_TOKENS.spacing.sm,
    borderRadius: DESIGN_TOKENS.borderRadius.full,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  scrollContent: {
    maxHeight: height * 0.6,
  },
  sectionContainer: {
    padding: DESIGN_TOKENS.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.05)",
  },
  sectionTitle: {
    ...DESIGN_TOKENS.typography.h3,
    color: COLORS.textPrimary,
    marginBottom: DESIGN_TOKENS.spacing.md,
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: DESIGN_TOKENS.spacing.sm,
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: DESIGN_TOKENS.spacing.md,
    paddingVertical: DESIGN_TOKENS.spacing.sm,
    borderRadius: DESIGN_TOKENS.borderRadius.full,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
    gap: DESIGN_TOKENS.spacing.xs,
  },
  categoryButtonActive: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  categoryButtonText: {
    ...DESIGN_TOKENS.typography.caption,
    color: COLORS.textSecondary,
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  categoryButtonTextActive: {
    color: COLORS.white,
    fontWeight: "600",
  },
  priceRangeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: DESIGN_TOKENS.spacing.xs,
    marginBottom: DESIGN_TOKENS.spacing.lg,
  },
  priceRangeButton: {
    paddingHorizontal: DESIGN_TOKENS.spacing.md,
    paddingVertical: DESIGN_TOKENS.spacing.sm,
    borderRadius: DESIGN_TOKENS.borderRadius.full,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  priceRangeButtonActive: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  priceRangeButtonText: {
    ...DESIGN_TOKENS.typography.caption,
    color: COLORS.textSecondary,
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  priceRangeButtonTextActive: {
    color: COLORS.white,
    fontWeight: "600",
  },
  customPriceLabel: {
    ...DESIGN_TOKENS.typography.caption,
    color: COLORS.textSecondary,
    marginBottom: DESIGN_TOKENS.spacing.sm,
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  priceInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: DESIGN_TOKENS.spacing.sm,
  },
  priceInputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: DESIGN_TOKENS.borderRadius.md,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
    paddingHorizontal: DESIGN_TOKENS.spacing.md,
    ...DESIGN_TOKENS.shadows.sm,
  },
  currencySymbol: {
    ...DESIGN_TOKENS.typography.body,
    color: COLORS.textSecondary,
    marginRight: DESIGN_TOKENS.spacing.xs,
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  priceInput: {
    flex: 1,
    paddingVertical: DESIGN_TOKENS.spacing.md,
    ...DESIGN_TOKENS.typography.body,
    color: COLORS.textPrimary,
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  priceSeparator: {
    paddingHorizontal: DESIGN_TOKENS.spacing.sm,
  },
  priceSeparatorText: {
    ...DESIGN_TOKENS.typography.caption,
    color: COLORS.textSecondary,
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: DESIGN_TOKENS.borderRadius.md,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
    paddingHorizontal: DESIGN_TOKENS.spacing.md,
    ...DESIGN_TOKENS.shadows.sm,
  },
  inputIcon: {
    marginRight: DESIGN_TOKENS.spacing.sm,
  },
  textInput: {
    flex: 1,
    paddingVertical: DESIGN_TOKENS.spacing.md,
    ...DESIGN_TOKENS.typography.body,
    color: COLORS.textPrimary,
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  clearInputButton: {
    padding: DESIGN_TOKENS.spacing.xs,
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: DESIGN_TOKENS.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.08)",
    backgroundColor: "rgba(255, 255, 255, 0.98)",
  },
  clearButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: DESIGN_TOKENS.spacing.xs,
    paddingHorizontal: DESIGN_TOKENS.spacing.md,
    paddingVertical: DESIGN_TOKENS.spacing.sm,
    borderRadius: DESIGN_TOKENS.borderRadius.md,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  clearButtonText: {
    ...DESIGN_TOKENS.typography.caption,
    color: COLORS.textSecondary,
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  mainActions: {
    flexDirection: "row",
    gap: DESIGN_TOKENS.spacing.sm,
  },
  cancelButton: {
    paddingHorizontal: DESIGN_TOKENS.spacing.lg,
    paddingVertical: DESIGN_TOKENS.spacing.md,
    borderRadius: DESIGN_TOKENS.borderRadius.md,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.2)",
  },
  cancelButtonText: {
    ...DESIGN_TOKENS.typography.caption,
    color: COLORS.textSecondary,
    fontWeight: "600",
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  applyButton: {
    borderRadius: DESIGN_TOKENS.borderRadius.md,
    ...DESIGN_TOKENS.shadows.md,
  },
  applyButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: DESIGN_TOKENS.spacing.lg,
    paddingVertical: DESIGN_TOKENS.spacing.md,
    gap: DESIGN_TOKENS.spacing.xs,
  },
  applyButtonText: {
    ...DESIGN_TOKENS.typography.caption,
    color: COLORS.white,
    fontWeight: "600",
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
});

export default FilterModal;
