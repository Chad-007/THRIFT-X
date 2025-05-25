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
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS } from "../utils/constants";

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
      const savedUsername = await AsyncStorage.getItem("username");
      if (savedUsername) {
        setForm((prev) => ({ ...prev, username: savedUsername }));
        console.log("hi");
        console.log(savedUsername);
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

        if (!result.canceled) {
          setForm({ ...form, image: result.assets[0].uri });
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

      console.log("Submitting with username:", payload.username);
      console.log("Payload sent:", JSON.stringify(payload));
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
        } else {
          const errorText = await res.text();
          Alert.alert("Error", errorText);
        }
      } catch (err) {
        console.error(err);
        Alert.alert("Network Error", "Could not post ad");
      }
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
  content: { padding: 12, paddingBottom: 60 },
  title: {
    fontSize: 24,
    color: COLORS.textPrimary,
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
