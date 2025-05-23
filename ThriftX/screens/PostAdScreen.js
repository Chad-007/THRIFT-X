import React, { useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { launchImageLibrary } from "react-native-image-picker";
import { COLORS } from "../utils/constants";

const PostAdScreen = ({ navigation }) => {
  const [form, setForm] = useState({
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

  const handleImagePick = () => {
    Animated.spring(imageButtonScale, {
      toValue: 0.95,
      friction: 6,
      tension: 40,
      useNativeDriver: true,
    }).start(() => {
      imageButtonScale.setValue(1);
      launchImageLibrary({ mediaType: "photo" }, (response) => {
        if (response.assets) {
          setForm({ ...form, image: response.assets[0].uri });
        }
      });
    });
  };

  const handleSubmit = () => {
    Animated.spring(submitButtonScale, {
      toValue: 0.95,
      friction: 6,
      tension: 40,
      useNativeDriver: true,
    }).start(() => {
      submitButtonScale.setValue(1);
      navigation.navigate("Home");
    });
  };

  return (
    <LinearGradient
      colors={[COLORS.primary, COLORS.secondary]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Text></Text>
        <Text style={styles.title}>Post a Vehicle Ad</Text>
        <TextInput
          style={styles.input}
          placeholder="Title (e.g., Toyota Camry 2022)"
          placeholderTextColor={COLORS.textSecondary}
          value={form.title}
          onChangeText={(text) => setForm({ ...form, title: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Price (USD)"
          placeholderTextColor={COLORS.textSecondary}
          value={form.price}
          onChangeText={(text) => setForm({ ...form, price: text })}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Category (e.g., Car, Bike)"
          placeholderTextColor={COLORS.textSecondary}
          value={form.category}
          onChangeText={(text) => setForm({ ...form, category: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Location (e.g., New York, NY)"
          placeholderTextColor={COLORS.textSecondary}
          value={form.location}
          onChangeText={(text) => setForm({ ...form, location: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Year (e.g., 2022)"
          placeholderTextColor={COLORS.textSecondary}
          value={form.year}
          onChangeText={(text) => setForm({ ...form, year: text })}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Mileage (km)"
          placeholderTextColor={COLORS.textSecondary}
          value={form.mileage}
          onChangeText={(text) => setForm({ ...form, mileage: text })}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Description"
          placeholderTextColor={COLORS.textSecondary}
          value={form.description}
          onChangeText={(text) => setForm({ ...form, description: text })}
          multiline
          numberOfLines={4}
        />
        <TouchableOpacity onPress={handleImagePick}>
          <Animated.View
            style={[
              styles.imageButton,
              { transform: [{ scale: imageButtonScale }] },
            ]}
          >
            <Text style={styles.imageButtonText}>
              {form.image ? "Image Selected" : "Upload Image"}
            </Text>
          </Animated.View>
        </TouchableOpacity>
        {form.image && (
          <Image source={{ uri: form.image }} style={styles.previewImage} />
        )}
        <TouchableOpacity onPress={handleSubmit}>
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
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 12, paddingBottom: 60 }, // Compact
  title: {
    fontSize: 24, // Smaller
    color: COLORS.textPrimary, // Dark gray
    fontWeight: "700",
    fontFamily: "Roboto",
    marginBottom: 16,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: COLORS.inputBackground,
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.border,
    fontFamily: "Roboto",
    marginBottom: 12,
  },
  imageButton: {
    backgroundColor: COLORS.accent,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
    shadowColor: COLORS.textSecondary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  imageButtonText: {
    color: COLORS.inputBackground,
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Roboto",
  },
  previewImage: {
    width: 180,
    height: 180,
    borderRadius: 8,
    marginBottom: 12,
    alignSelf: "center",
  },
  submitButton: {
    backgroundColor: COLORS.accent,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    shadowColor: COLORS.textSecondary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  submitButtonText: {
    color: COLORS.inputBackground,
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Roboto",
  },
});

export default PostAdScreen;
