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
  StatusBar,
  Platform,
  SafeAreaView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import Icon from "react-native-vector-icons/MaterialIcons";
import VehicleCard from "../components/VehicleCard";
import FilterModal from "../components/FilterModal";
import { COLORS } from "../utils/constants";

const { width, height } = Dimensions.get("window");

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
    h1: { fontSize: 32, fontWeight: "800", lineHeight: 40 },
    h2: { fontSize: 24, fontWeight: "700", lineHeight: 32 },
    h3: { fontSize: 20, fontWeight: "600", lineHeight: 28 },
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
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
  },
};

const HomeScreen = ({ navigation }) => {
  const [vehicles, setVehicles] = useState([]);
  const [search, setSearch] = useState("");
  const [isFilterVisible, setFilterVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
  const contentTranslate = useRef(new Animated.Value(50)).current;
  const loadingRotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const initAnimations = Animated.parallel([
      Animated.timing(headerTranslate, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(searchOpacity, {
        toValue: 1,
        duration: 600,
        delay: 400,
        useNativeDriver: true,
      }),
      Animated.timing(contentTranslate, {
        toValue: 0,
        duration: 700,
        delay: 200,
        useNativeDriver: true,
      }),
    ]);

    initAnimations.start();
  }, []);

  useEffect(() => {
    if (!vehicles || vehicles.length === 0) return;

    fadeAnim.length = vehicles.length;
    vehicles.forEach((_, index) => {
      fadeAnim[index] = new Animated.Value(0);
    });

    const staggeredAnimations = fadeAnim.map((anim, index) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 500,
        delay: index * 80,
        useNativeDriver: true,
      })
    );

    Animated.stagger(50, staggeredAnimations).start();
  }, [vehicles]);

  useEffect(() => {
    if (isLoading) {
      const spin = Animated.loop(
        Animated.timing(loadingRotation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      );
      spin.start();
    } else {
      loadingRotation.setValue(0);
    }
  }, [isLoading]);

  const fetchVehicles = async (searchTerm, filtersObj) => {
    try {
      setIsLoading(true);
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
    } finally {
      setIsLoading(false);
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
    Animated.spring(modalAnimation, {
      toValue: 1,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };

  const closeFilterModal = () => {
    Animated.timing(modalAnimation, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start(() => setFilterVisible(false));
  };

  const animateFilterButton = () => {
    const scaleAnimation = Animated.sequence([
      Animated.timing(filterButtonScale, {
        toValue: 0.85,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(filterButtonScale, {
        toValue: 1,
        friction: 4,
        tension: 100,
        useNativeDriver: true,
      }),
    ]);

    scaleAnimation.start();
    openFilterModal();
  };

  const renderHeader = () => (
    <Animated.View
      style={[
        styles.headerContainer,
        { transform: [{ translateY: headerTranslate }] },
      ]}
    >
      <BlurView intensity={20} style={styles.headerBlur}>
        <View style={styles.headerContent}>
          <Text style={styles.appTitle}>ThriftX</Text>
          <Text style={styles.appSubtitle}>Premium Vehicle Marketplace</Text>
        </View>
      </BlurView>
    </Animated.View>
  );

  const renderSearchSection = () => (
    <Animated.View
      style={[
        styles.searchSection,
        {
          opacity: searchOpacity,
          transform: [{ translateY: contentTranslate }],
        },
      ]}
    >
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Icon
            name="search"
            size={20}
            color={COLORS.textSecondary}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search vehicles, brands, models..."
            placeholderTextColor={COLORS.textSecondary}
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
          />
          {search.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearch("")}
              style={styles.clearButton}
            >
              <Icon name="clear" size={18} color={COLORS.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={styles.filterButton}
          onPress={animateFilterButton}
          activeOpacity={0.8}
        >
          <Animated.View
            style={[
              styles.filterButtonContent,
              { transform: [{ scale: filterButtonScale }] },
            ]}
          >
            <Icon name="tune" size={20} color={COLORS.white} />
            <Text style={styles.filterButtonText}>Filter</Text>
          </Animated.View>
        </TouchableOpacity>
      </View>

      {(filters.category ||
        filters.location ||
        filters.priceRange[0] > 0 ||
        filters.priceRange[1] < 1000000) && (
        <View style={styles.activeFiltersContainer}>
          <Text style={styles.activeFiltersText}>Active filters:</Text>
          <View style={styles.activeFiltersList}>
            {filters.category && (
              <View style={styles.filterChip}>
                <Text style={styles.filterChipText}>{filters.category}</Text>
              </View>
            )}
            {filters.location && (
              <View style={styles.filterChip}>
                <Text style={styles.filterChipText}>{filters.location}</Text>
              </View>
            )}
          </View>
        </View>
      )}
    </Animated.View>
  );

  const renderLoadingIndicator = () => (
    <View style={styles.loadingContainer}>
      <Animated.View
        style={[
          styles.loadingSpinner,
          {
            transform: [
              {
                rotate: loadingRotation.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0deg", "360deg"],
                }),
              },
            ],
          },
        ]}
      >
        <Icon name="refresh" size={24} color={COLORS.accent} />
      </Animated.View>
      <Text style={styles.loadingText}>Loading vehicles...</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.dark} />
      <LinearGradient
        colors={[COLORS.dark, COLORS.black, "#0a0a0a"]}
        style={styles.container}
      >
        {renderHeader()}
        {renderSearchSection()}

        {isLoading ? (
          renderLoadingIndicator()
        ) : (
          <FlatList
            data={vehicles}
            keyExtractor={(item) =>
              item.id?.toString() || Math.random().toString()
            }
            renderItem={({ item, index }) => {
              const animValue = fadeAnim[index] || new Animated.Value(1);

              return (
                <Animated.View
                  style={[
                    styles.vehicleCardContainer,
                    {
                      opacity: animValue,
                      transform: [
                        {
                          scale: animValue.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.9, 1],
                          }),
                        },
                        {
                          translateY: animValue.interpolate({
                            inputRange: [0, 1],
                            outputRange: [20, 0],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <VehicleCard
                    vehicle={item}
                    onPress={() =>
                      navigation.navigate("VehicleDetail", { vehicle: item })
                    }
                  />
                </Animated.View>
              );
            }}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Icon
                  name="directions-car"
                  size={64}
                  color={COLORS.textSecondary}
                />
                <Text style={styles.emptyTitle}>No vehicles found</Text>
                <Text style={styles.emptySubtitle}>
                  Try adjusting your search or filters
                </Text>
              </View>
            )}
          />
        )}

        <FilterModal
          visible={isFilterVisible}
          onClose={closeFilterModal}
          onApply={applyFilters}
          currentFilters={filters}
          animation={modalAnimation}
        />
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.dark,
  },
  container: {
    flex: 1,
  },
  headerContainer: {
    position: "relative",
    marginBottom: DESIGN_TOKENS.spacing.md,
  },
  headerBlur: {
    overflow: "hidden",
    borderRadius: DESIGN_TOKENS.borderRadius.lg,
    marginHorizontal: DESIGN_TOKENS.spacing.md,
    marginTop: DESIGN_TOKENS.spacing.sm,
  },
  headerContent: {
    padding: DESIGN_TOKENS.spacing.lg,
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  appTitle: {
    ...DESIGN_TOKENS.typography.h1,
    color: COLORS.accent,
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    letterSpacing: 1.5,
    textAlign: "center",
  },
  appSubtitle: {
    ...DESIGN_TOKENS.typography.caption,
    color: COLORS.textSecondary,
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    marginTop: DESIGN_TOKENS.spacing.xs,
    letterSpacing: 0.5,
  },
  searchSection: {
    paddingHorizontal: DESIGN_TOKENS.spacing.md,
    marginBottom: DESIGN_TOKENS.spacing.md,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: DESIGN_TOKENS.spacing.sm,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: DESIGN_TOKENS.borderRadius.xl,
    paddingHorizontal: DESIGN_TOKENS.spacing.md,
    ...DESIGN_TOKENS.shadows.md,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  searchIcon: {
    marginRight: DESIGN_TOKENS.spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...DESIGN_TOKENS.typography.body,
    color: COLORS.textPrimary,
    paddingVertical: DESIGN_TOKENS.spacing.md,
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  clearButton: {
    padding: DESIGN_TOKENS.spacing.xs,
  },
  filterButton: {
    backgroundColor: COLORS.accent,
    borderRadius: DESIGN_TOKENS.borderRadius.xl,
    ...DESIGN_TOKENS.shadows.lg,
  },
  filterButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: DESIGN_TOKENS.spacing.md,
    paddingVertical: DESIGN_TOKENS.spacing.md,
    gap: DESIGN_TOKENS.spacing.sm,
  },
  filterButtonText: {
    ...DESIGN_TOKENS.typography.caption,
    color: COLORS.white,
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    fontWeight: "600",
  },
  activeFiltersContainer: {
    marginTop: DESIGN_TOKENS.spacing.md,
  },
  activeFiltersText: {
    ...DESIGN_TOKENS.typography.small,
    color: COLORS.textSecondary,
    marginBottom: DESIGN_TOKENS.spacing.xs,
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  activeFiltersList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: DESIGN_TOKENS.spacing.xs,
  },
  filterChip: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: DESIGN_TOKENS.spacing.sm,
    paddingVertical: DESIGN_TOKENS.spacing.xs,
    borderRadius: DESIGN_TOKENS.borderRadius.full,
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  filterChipText: {
    ...DESIGN_TOKENS.typography.small,
    color: COLORS.accent,
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  listContainer: {
    paddingHorizontal: DESIGN_TOKENS.spacing.md,
    paddingBottom: DESIGN_TOKENS.spacing.xxl * 2,
  },
  vehicleCardContainer: {
    marginVertical: DESIGN_TOKENS.spacing.xs,
  },
  separator: {
    height: DESIGN_TOKENS.spacing.sm,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: DESIGN_TOKENS.spacing.xxl,
  },
  loadingSpinner: {
    marginBottom: DESIGN_TOKENS.spacing.md,
  },
  loadingText: {
    ...DESIGN_TOKENS.typography.body,
    color: COLORS.textSecondary,
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: DESIGN_TOKENS.spacing.xxl * 2,
  },
  emptyTitle: {
    ...DESIGN_TOKENS.typography.h3,
    color: COLORS.textPrimary,
    marginTop: DESIGN_TOKENS.spacing.lg,
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  emptySubtitle: {
    ...DESIGN_TOKENS.typography.body,
    color: COLORS.textSecondary,
    marginTop: DESIGN_TOKENS.spacing.sm,
    textAlign: "center",
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
});

export default HomeScreen;
