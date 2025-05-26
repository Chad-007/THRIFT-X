import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";
import VehicleCard from "../components/VehicleCard";
import FilterModal from "../components/FilterModal";
import { COLORS } from "../utils/constants";

const HomeScreen = ({ navigation }) => {
  const [vehicles, setVehicles] = useState([]);
  const [search, setSearch] = useState("");
  const [isFilterVisible, setFilterVisible] = useState(false);
  const [filters, setFilters] = useState({
    category: "",
    priceRange: [0, 1000000],
    location: "",
  });

  const fadeAnim = useRef([]).current;
  const filterButtonScale = useRef(new Animated.Value(1)).current;
  const modalAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fadeAnim.length = 0;
    vehicles.forEach(() => {
      fadeAnim.push(new Animated.Value(0));
    });

    fadeAnim.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: 1,
        duration: 400,
        delay: index * 150,
        useNativeDriver: true,
      }).start();
    });
  }, [vehicles]);

  const fetchVehicles = async (searchTerm, filtersObj) => {
    try {
      let queryParams = [];
      if (searchTerm)
        queryParams.push(`search=${encodeURIComponent(searchTerm)}`);
      if (filtersObj.category)
        queryParams.push(`category=${encodeURIComponent(filtersObj.category)}`);
      if (filtersObj.location)
        queryParams.push(`location=${encodeURIComponent(filtersObj.location)}`);
      if (filtersObj.priceRange) {
        queryParams.push(`minPrice=${filtersObj.priceRange[0]}`);
        queryParams.push(`maxPrice=${filtersObj.priceRange[1]}`);
      }
      const queryString = queryParams.length ? `?${queryParams.join("&")}` : "";

      const response = await fetch(
        `http://192.168.153.122:8082/api/ads${queryString}`
      );
      if (!response.ok) throw new Error("Failed to fetch vehicles");
      const data = await response.json();
      const vehiclesData = Array.isArray(data.content) ? data.content : null;
      const normalizedVehicles = vehiclesData
        ? vehiclesData.map((v) => ({
            id: v.id ?? null,
            category: v.category ?? null,
            description: v.description ?? null,
            imageUrl: v.imageUrl ?? null,
            location: v.location ?? null,
            mileage: v.mileage ?? null,
            price: v.price ?? null,
            title: v.title ?? null,
            user: v.user ?? null,
            username: v.username ?? null,
            year: v.year ?? null,
          }))
        : null;

      setVehicles(normalizedVehicles);
    } catch (error) {
      console.error("Unexpected data format:", error);
      setVehicles(null);
    }
  };

  useEffect(() => {
    fetchVehicles(search, filters);
  }, [search, filters]);

  const applyFilters = (newFilters) => {
    setFilters(newFilters);
    closeFilterModal();
  };

  const openFilterModal = () => {
    setFilterVisible(true);
    Animated.timing(modalAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeFilterModal = () => {
    Animated.timing(modalAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setFilterVisible(false));
  };

  const animateFilterButton = () => {
    filterButtonScale.setValue(0.9);
    Animated.spring(filterButtonScale, {
      toValue: 1,
      friction: 6,
      tension: 40,
      useNativeDriver: true,
    }).start();
    openFilterModal();
  };

  return (
    <LinearGradient
      colors={[COLORS.primary, COLORS.secondary]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Thriftx</Text>
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search vehicles..."
          placeholderTextColor={COLORS.textSecondary}
          value={search}
          onChangeText={setSearch}
        />
        <TouchableOpacity
          style={styles.filterButton}
          onPress={animateFilterButton}
        >
          <Animated.View style={{ transform: [{ scale: filterButtonScale }] }}>
            <Icon name="filter-list" size={20} color={COLORS.textPrimary} />
          </Animated.View>
        </TouchableOpacity>
      </View>
      <FlatList
        data={vehicles}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <Animated.View style={{ opacity: fadeAnim[index] }}>
            <VehicleCard
              vehicle={item}
              onPress={() =>
                navigation.navigate("VehicleDetail", { vehicle: item })
              }
            />
          </Animated.View>
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
      <FilterModal
        visible={isFilterVisible}
        onClose={closeFilterModal}
        onApply={applyFilters}
        currentFilters={filters}
        animation={modalAnimation}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
  },
  header: {
    padding: 12,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.textPrimary, // Dark gray
    fontFamily: "Roboto",
    letterSpacing: 0.5,
  },
  searchContainer: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    backgroundColor: COLORS.inputBackground, // White
    borderRadius: 20,
    padding: 10,
    fontSize: 14,
    color: COLORS.textPrimary,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.border, // Light gray
    fontFamily: "Roboto",
    shadowColor: COLORS.textSecondary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  filterButton: {
    backgroundColor: COLORS.accent, // Teal
    padding: 10,
    borderRadius: 20,
    shadowColor: COLORS.textSecondary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  list: {
    padding: 12,
    paddingBottom: 60,
  },
});

export default HomeScreen;
import PropTypes from "prop-types";

HomeScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};
