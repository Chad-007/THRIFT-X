import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Animated,
  Alert,
  Platform,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";

const COLORS = {
  backgroundDark: "#1A1A2E",
  surfaceDark: "#2C2C40",

  accentPrimary: "#4A90E2",
  accentSecondary: "#A0A0A0",

  textPrimary: "#F0F0F0",
  textSecondary: "#C0C0C0",
  textPlaceholder: "#888888",

  white: "#FFFFFF",
  black: "#000000",
  error: "#E74C3C",
};

const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

const TYPOGRAPHY = {
  h1: {
    fontSize: 32,
    fontWeight: "800",
    lineHeight: 40,
    color: COLORS.textPrimary,
  },
  h2: {
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 32,
    color: COLORS.textPrimary,
  },
  h3: {
    fontSize: 20,
    fontWeight: "600",
    lineHeight: 28,
    color: COLORS.textPrimary,
  },
  body: {
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 24,
    color: COLORS.textSecondary,
  },
  caption: {
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
    color: COLORS.textPlaceholder,
  },
  small: {
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 16,
    color: COLORS.textSecondary,
  },
  button: { fontSize: 18, fontWeight: "600", color: COLORS.white },
};

const DESIGN_TOKENS = {
  spacing: SPACING,
  borderRadius: BORDER_RADIUS,
  typography: TYPOGRAPHY,
  shadows: {
    sm: {
      shadowColor: COLORS.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    md: {
      shadowColor: COLORS.black,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    lg: {
      shadowColor: COLORS.black,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
  },
};

const PostAdScreen = ({ navigation }) => {
  const [form, setForm] = useState({
    username: "",
    title: "",
    price: "",
    category: "",
    location: "",
    year: "",
    mileage: "",
    description: "",
    image: null,
  });

  const imageButtonScale = useRef(new Animated.Value(1)).current;
  const submitButtonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loadUsername = async () => {
      try {
        const savedUsername = await AsyncStorage.getItem("username");
        if (savedUsername) {
          setForm((prev) => ({ ...prev, username: savedUsername }));
        }
      } catch (error) {
        console.error("Failed to load username from AsyncStorage:", error);
      }
    };
    loadUsername();
  }, []);

  const requestPermission = async () => {
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Sorry, we need camera roll permissions to make this work!"
        );
        return false;
      }
    }
    return true;
  };

  const handleImagePick = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    Animated.spring(imageButtonScale, {
      toValue: 0.95,
      friction: 6,
      tension: 40,
      useNativeDriver: true,
    }).start(async () => {
      imageButtonScale.setValue(1);
      try {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
          base64: true,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
          const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
          setForm({
            ...form,
            image: base64Image,
          });
        } else {
          console.log("User cancelled image picker");
        }
      } catch (error) {
        console.error("ImagePicker Error: ", error);
        Alert.alert("Error", "Failed to pick image.");
      }
    });
  };

  const handleSubmit = async () => {
    Animated.spring(submitButtonScale, {
      toValue: 0.95,
      friction: 6,
      tension: 40,
      useNativeDriver: true,
    }).start(async () => {
      submitButtonScale.setValue(1);

      if (
        !form.username ||
        !form.title ||
        !form.price ||
        !form.category ||
        !form.location ||
        !form.year ||
        !form.mileage ||
        !form.description ||
        !form.image
      ) {
        Alert.alert(
          "Missing Information",
          "Please fill in all fields and upload an image."
        );
        return;
      }

      const payload = {
        username: form.username,
        title: form.title,
        price: parseFloat(form.price),
        category: form.category,
        location: form.location,
        year: parseInt(form.year),
        mileage: parseInt(form.mileage),
        description: form.description,
        imageUrl: form.image,
      };

      try {
        const res = await fetch("http://192.168.153.122:8082/api/ads/post", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          Alert.alert("Success", "Ad posted successfully!");
          navigation.navigate("Home");
          setForm({
            username: form.username,
            title: "",
            price: "",
            category: "",
            location: "",
            year: "",
            mileage: "",
            description: "",
            image: null,
          });
        } else {
          const errorText = await res.text();
          Alert.alert("Error", errorText || "Something went wrong.");
        }
      } catch (err) {
        console.error("Network Error:", err);
        Alert.alert(
          "Network Error",
          "Could not post ad. Please check your connection."
        );
      }
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.backgroundDark}
      />
      <LinearGradient
        colors={[COLORS.backgroundDark, COLORS.black, "#0a0a0a"]}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>Post a Vehicle Ad</Text>

          <TextInput
            style={styles.input}
            placeholder="Title (e.g., Toyota Camry 2022)"
            placeholderTextColor={COLORS.textPlaceholder}
            value={form.title}
            onChangeText={(text) => setForm({ ...form, title: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Price (USD)"
            placeholderTextColor={COLORS.textPlaceholder}
            value={form.price}
            onChangeText={(text) => setForm({ ...form, price: text })}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Category (e.g., Car, Bike)"
            placeholderTextColor={COLORS.textPlaceholder}
            value={form.category}
            onChangeText={(text) => setForm({ ...form, category: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Location (e.g., New York, NY)"
            placeholderTextColor={COLORS.textPlaceholder}
            value={form.location}
            onChangeText={(text) => setForm({ ...form, location: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Year (e.g., 2022)"
            placeholderTextColor={COLORS.textPlaceholder}
            value={form.year}
            onChangeText={(text) => setForm({ ...form, year: text })}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Mileage (km)"
            placeholderTextColor={COLORS.textPlaceholder}
            value={form.mileage}
            onChangeText={(text) => setForm({ ...form, mileage: text })}
            keyboardType="numeric"
          />
          <TextInput
            style={[styles.input, styles.descriptionInput]}
            placeholder="Description"
            placeholderTextColor={COLORS.textPlaceholder}
            value={form.description}
            onChangeText={(text) => setForm({ ...form, description: text })}
            multiline
            numberOfLines={4}
          />

          <TouchableOpacity onPress={handleImagePick} activeOpacity={0.8}>
            <Animated.View
              style={[
                styles.imageButton,
                { transform: [{ scale: imageButtonScale }] },
              ]}
            >
              <Icon name="cloud-upload" size={24} color={COLORS.white} />
              <Text style={styles.imageButtonText}>
                {form.image ? "Image Selected" : "Upload Image"}
              </Text>
            </Animated.View>
          </TouchableOpacity>
          {form.image && (
            <Image source={{ uri: form.image }} style={styles.previewImage} />
          )}

          <TouchableOpacity onPress={handleSubmit} activeOpacity={0.8}>
            <Animated.View
              style={[
                styles.submitButton,
                { transform: [{ scale: submitButtonScale }] },
              ]}
            >
              <Text style={styles.submitButtonText}>Post Ad</Text>
            </Animated.View>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.backgroundDark,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: DESIGN_TOKENS.spacing.lg,
    paddingBottom: DESIGN_TOKENS.spacing.xxl,
  },
  title: {
    ...DESIGN_TOKENS.typography.h2,
    marginBottom: DESIGN_TOKENS.spacing.xl,
    textAlign: "center",
    letterSpacing: 0.8,
  },
  input: {
    backgroundColor: COLORS.surfaceDark,
    borderRadius: DESIGN_TOKENS.borderRadius.md,
    paddingHorizontal: DESIGN_TOKENS.spacing.md,
    paddingVertical: DESIGN_TOKENS.spacing.sm + 4,
    ...DESIGN_TOKENS.typography.body,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.surfaceDark,
    marginBottom: DESIGN_TOKENS.spacing.md,
    ...DESIGN_TOKENS.shadows.sm,
  },
  descriptionInput: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  imageButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.accentPrimary,
    padding: DESIGN_TOKENS.spacing.md,
    borderRadius: DESIGN_TOKENS.borderRadius.md,
    marginBottom: DESIGN_TOKENS.spacing.md,
    ...DESIGN_TOKENS.shadows.md,
    gap: DESIGN_TOKENS.spacing.sm,
  },
  imageButtonText: {
    ...DESIGN_TOKENS.typography.button,
    color: COLORS.white,
  },
  previewImage: {
    width: "100%",
    height: 200,
    borderRadius: DESIGN_TOKENS.borderRadius.md,
    marginBottom: DESIGN_TOKENS.spacing.md,
    alignSelf: "center",
    resizeMode: "cover",
    borderWidth: 1,
    borderColor: COLORS.accentSecondary,
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.accentPrimary,
    padding: DESIGN_TOKENS.spacing.md,
    borderRadius: DESIGN_TOKENS.borderRadius.md,
    ...DESIGN_TOKENS.shadows.lg,
    marginTop: DESIGN_TOKENS.spacing.sm,
  },
  submitButtonText: {
    ...DESIGN_TOKENS.typography.button,
    color: COLORS.white,
  },
});

export default PostAdScreen;
