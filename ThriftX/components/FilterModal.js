import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  Animated,
} from "react-native";
import { COLORS } from "../utils/constants";

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

  const handleApply = () => {
    onApply({
      category,
      priceRange: [parseInt(minPrice) || 0, parseInt(maxPrice) || 1000000],
      location,
    });
  };

  const animatedStyle = {
    opacity: animation,
    transform: [
      {
        scale: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0.95, 1],
        }),
      },
    ],
  };

  return (
    <Modal visible={visible} transparent animationType="none">
      <View style={styles.modalOverlay}>
        <Animated.View style={[styles.modalContent, animatedStyle]}>
          <Text style={styles.modalTitle}>Filter Vehicles</Text>
          <Text style={styles.label}>Category</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Car, Bike"
            placeholderTextColor={COLORS.textSecondary}
            value={category}
            onChangeText={setCategory}
          />
          <Text style={styles.label}>Price Range</Text>
          <View style={styles.priceRange}>
            <TextInput
              style={[styles.input, styles.priceInput]}
              placeholder="Min"
              placeholderTextColor={COLORS.textSecondary}
              value={minPrice}
              onChangeText={setMinPrice}
              keyboardType="numeric"
            />
            <TextInput
              style={[styles.input, styles.priceInput]}
              placeholder="Max"
              placeholderTextColor={COLORS.textSecondary}
              value={maxPrice}
              onChangeText={setMaxPrice}
              keyboardType="numeric"
            />
          </View>
          <Text style={styles.label}>Location</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Mumbai"
            placeholderTextColor={COLORS.textSecondary}
            value={location}
            onChangeText={setLocation}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={onClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.applyButton]}
              onPress={handleApply}
            >
              <Text style={styles.buttonText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: COLORS.inputBackground, // White
    borderRadius: 8,
    padding: 16, // Compact padding
    width: "90%",
    borderWidth: 1,
    borderColor: COLORS.border, // Light gray
    shadowColor: COLORS.textSecondary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  modalTitle: {
    fontSize: 18, // Smaller
    fontWeight: "600",
    color: COLORS.textPrimary, // Dark gray
    fontFamily: "Roboto",
    marginBottom: 12,
  },
  label: {
    fontSize: 14, // Smaller
    color: COLORS.textPrimary,
    fontFamily: "Roboto",
    marginBottom: 6,
  },
  input: {
    backgroundColor: COLORS.inputBackground, // White
    borderRadius: 8,
    padding: 10, // Compact
    fontSize: 14, // Smaller
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.border,
    fontFamily: "Roboto",
    marginBottom: 12,
  },
  priceRange: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  priceInput: {
    flex: 1,
    marginRight: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  button: {
    padding: 10, // Compact
    borderRadius: 8,
    marginLeft: 8,
  },
  applyButton: {
    backgroundColor: COLORS.accent, // Teal
  },
  buttonText: {
    color: COLORS.inputBackground, // White
    fontSize: 14, // Smaller
    fontWeight: "600",
    fontFamily: "Roboto",
  },
});

export default FilterModal;
