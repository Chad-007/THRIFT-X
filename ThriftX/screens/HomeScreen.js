// This is a significantly enhanced version of the HomeScreen component
// with a modern, futuristic UI, smooth transitions, and animations

import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Animated,
  Dimensions,
  Keyboard,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";
import VehicleCard from "../components/VehicleCard";
import FilterModal from "../components/FilterModal";
import { COLORS } from "../utils/constants";

const { width } = Dimensions.get("window");

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
  const headerTranslate = useRef(new Animated.Value(-100)).current;
  const searchOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerTranslate, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(searchOpacity, {
        toValue: 1,
        duration: 800,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    if (!vehicles || vehicles.length === 0) return;

    // Reset fadeAnim
    fadeAnim.length = vehicles.length;

    vehicles.forEach((_, index) => {
      fadeAnim[index] = new Animated.Value(0);
    });

    fadeAnim.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: 1,
        duration: 400,
        delay: index * 100,
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
      if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);

      const data = await response.json();
      const vehiclesData = Array.isArray(data.content) ? data.content : [];
      const normalizedVehicles = vehiclesData.map((v) => ({
        id: v.id ?? null,
        category: v.category ?? null,
        description: v.description ?? null,
        imageUrl: v.imageUrl ?? null,
        location: v.location ?? null,
        mileage: v.mileage ?? null,
        price: v.price ?? null,
        title: v.title ?? null,
        user: v.userId ?? null,
        username: v.username ?? null,
        year: v.year ?? null,
      }));

      setVehicles(normalizedVehicles);
    } catch (error) {
      console.error("Fetch error:", error);
      setVehicles([]);
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
      colors={[COLORS.dark, COLORS.black]}
      style={styles.container}
    >
      <Animated.View
        style={[
          styles.header,
          { transform: [{ translateY: headerTranslate }] },
        ]}
      >
        <Text style={styles.title}>ThriftX</Text>
      </Animated.View>
      <Animated.View
        style={[styles.searchContainer, { opacity: searchOpacity }]}
      >
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
      </Animated.View>
      <FlatList
        data={vehicles}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => {
          const animValue = fadeAnim[index] || new Animated.Value(1); // fallback to 1

          return (
            <Animated.View
              style={{
                opacity: animValue,
                transform: [
                  {
                    scale: animValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.95, 1],
                    }),
                  },
                ],
              }}
            >
              <VehicleCard
                vehicle={item}
                onPress={() =>
                  navigation.navigate("VehicleDetail", { vehicle: item })
                }
                animatedStyle={{
                  opacity: animValue,
                  transform: [
                    {
                      scale: animValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.95, 1],
                      }),
                    },
                  ],
                }}
              />
            </Animated.View>
          );
        }}
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
    paddingTop: 50,
    paddingBottom: 10,
  },
  header: {
    padding: 16,
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: COLORS.accent,
    fontFamily: "Roboto",
    letterSpacing: 1,
  },
  searchContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 12,
    fontSize: 16,
    color: COLORS.textPrimary,
    marginRight: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    fontFamily: "Roboto",
    shadowColor: COLORS.textSecondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
  filterButton: {
    backgroundColor: COLORS.accent,
    padding: 12,
    borderRadius: 24,
    shadowColor: COLORS.textSecondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  list: {
    padding: 16,
    paddingBottom: 100,
  },
});

export default HomeScreen;
