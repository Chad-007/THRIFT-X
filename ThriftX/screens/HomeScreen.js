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

const dummyVehicles = [
  {
    id: "1",
    title: "Toyota Camry 2022",
    price: 25000,
    location: "New York, NY",
    image: "https://images.unsplash.com/photo-1580273916550-ebdde42186d7",
    category: "Car",
    year: 2022,
    mileage: 15000,
  },
  {
    id: "2",
    title: "Honda CB500F",
    price: 6500,
    location: "Los Angeles, CA",
    image: "https://images.unsplash.com/photo-1558981403-c5f9899a7ef7",
    category: "Bike",
    year: 2020,
    mileage: 8000,
  },
  {
    id: "3",
    title: "Tesla Model 3",
    price: 45000,
    location: "San Francisco, CA",
    image: "https://images.unsplash.com/photo-1560958089-b8a1921b4e1b",
    category: "Car",
    year: 2023,
    mileage: 10000,
  },
  {
    id: "4",
    title: "Yamaha R1",
    price: 12000,
    location: "Miami, FL",
    image: "https://images.unsplash.com/photo-1585435557343-3b0920701803",
    category: "Bike",
    year: 2019,
    mileage: 5000,
  },
];

const HomeScreen = ({ navigation }) => {
  const [vehicles, setVehicles] = useState([]);
  const [search, setSearch] = useState("");
  const [isFilterVisible, setFilterVisible] = useState(false);
  const [filters, setFilters] = useState({
    category: "",
    priceRange: [0, 1000000],
    location: "",
  });

  const [fadeAnim] = useState(() =>
    dummyVehicles.map(() => new Animated.Value(0))
  );
  const filterButtonScale = useRef(new Animated.Value(1)).current;
  const modalAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setVehicles(dummyVehicles);
    dummyVehicles.forEach((_, index) => {
      Animated.timing(fadeAnim[index], {
        toValue: 1,
        duration: 400,
        delay: index * 150,
        useNativeDriver: true,
      }).start();
    });
  }, []);

  useEffect(() => {
    let filtered = dummyVehicles;
    if (search) {
      filtered = filtered.filter((vehicle) =>
        vehicle.title.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (filters.category) {
      filtered = filtered.filter(
        (vehicle) => vehicle.category === filters.category
      );
    }
    if (filters.location) {
      filtered = filtered.filter((vehicle) =>
        vehicle.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    filtered = filtered.filter(
      (vehicle) =>
        vehicle.price >= filters.priceRange[0] &&
        vehicle.price <= filters.priceRange[1]
    );
    setVehicles(filtered);
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
        animation={modalAnimation} // Pass animation for modal transition
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
