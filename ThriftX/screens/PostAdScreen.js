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
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";
import { supabase } from "../services/supabaseClient";
import * as FileSystem from "expo-file-system";
const { width } = Dimensions.get("window");

const SPOTIFY_COLORS = {
  black: "#000000",
  darkGray: "#121212",
  mediumGray: "#1e1e1e",
  lightGray: "#282828",
  green: "#1db954",
  accent: "#1ed760",
  white: "#ffffff",
  lightText: "#b3b3b3",
  darkText: "#a7a7a7",
  error: "#e22134",
  overlay: "rgba(0, 0, 0, 0.8)",
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
    imageUrl: null, // Changed from base64Image to imageUrl
  });

  const [focusedInput, setFocusedInput] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const fadeInAnimation = useRef(new Animated.Value(0)).current;
  const slideUpAnimation = useRef(new Animated.Value(50)).current;
  const imageButtonScale = useRef(new Animated.Value(1)).current;
  const submitButtonScale = useRef(new Animated.Value(1)).current;
  const headerAnimation = useRef(new Animated.Value(0)).current;

  const inputAnimations = useRef({
    title: new Animated.Value(0),
    price: new Animated.Value(0),
    category: new Animated.Value(0),
    location: new Animated.Value(0),
    year: new Animated.Value(0),
    mileage: new Animated.Value(0),
    description: new Animated.Value(0),
  }).current;

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

    Animated.parallel([
      Animated.timing(fadeInAnimation, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideUpAnimation, {
        toValue: 0,
        duration: 600,
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.timing(headerAnimation, {
        toValue: 1,
        duration: 1000,
        delay: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleInputFocus = (inputName) => {
    setFocusedInput(inputName);
    Animated.timing(inputAnimations[inputName], {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleInputBlur = (inputName) => {
    setFocusedInput(null);
    Animated.timing(inputAnimations[inputName], {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const requestPermission = async () => {
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "We need camera roll permissions to upload images.",
          [{ text: "OK", style: "default" }]
        );
        return false;
      }
    }
    return true;
  };

  const uploadImageToSupabase = async (imageUri) => {
    try {
      setUploadingImage(true);

      // Create unique filename
      const timestamp = Date.now();
      const fileExtension = imageUri.split(".").pop();
      const fileName = `vehicle_${timestamp}.${fileExtension}`;

      // Read file as base64
      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Convert base64 to Uint8Array
      const byteCharacters = atob(base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from("image")
        .upload(fileName, byteArray, {
          cacheControl: "3600",
          upsert: false,
          contentType: `image/${fileExtension}`,
        });

      if (error) throw error;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("image")
        .getPublicUrl(fileName);

      return urlData.publicUrl;
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleImagePick = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    // Button press animation
    Animated.sequence([
      Animated.timing(imageButtonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(imageButtonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"], // Modern approach using array
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImageUri = result.assets[0].uri;

        // Set local image for preview immediately
        setForm((prev) => ({ ...prev, image: selectedImageUri }));

        try {
          // Ensure user is signed in — replace these with secure input values!
          const {
            user,
            session,
            error: signupError,
          } = await supabase.auth.signUp({
            email: "alansebastian484@gmail.com",
            password: "9946701924@Alan",
          });

          if (signupError) {
            console.error("Signup failed:", signupError.message);
            return;
          }

          console.log("Signup successful:", user);
          console.log("Session:", session); // This will be null

          // Now sign in
          const {
            user: signInUser,
            session: signInSession,
            error: signInError,
          } = await supabase.auth.signIn({
            email: "alansebastian484@gmail.com",
            password: "9946701924@Alan",
          });

          if (signInError) {
            console.error("Signin failed:", signInError.message);
            return;
          }

          console.log("Signin successful:", signInUser);
          console.log("Session after signin:", signInSession);

          // Now you have session & user and can upload safely

          if (!user) {
            Alert.alert("Error", "User data not available");
            return;
          }

          // Upload image to Supabase
          const supabaseUrl = await uploadImageToSupabase(selectedImageUri);

          // Update form state
          setForm((prev) => ({
            ...prev,
            image: selectedImageUri,
            imageUrl: supabaseUrl,
          }));

          console.log("Image uploaded successfully:", supabaseUrl);
        } catch (err) {
          console.error("Unexpected error:", err);
          Alert.alert("Error", "Something went wrong while uploading.");
        }
      }
    } catch (error) {
      console.error("ImagePicker Error: ", error);
      Alert.alert("Error", "Failed to pick image. Please try again.");
    }
  };

  const handleSubmit = async () => {
    Animated.sequence([
      Animated.timing(submitButtonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(submitButtonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    const requiredFields = [
      "title",
      "price",
      "category",
      "location",
      "year",
      "mileage",
      "description",
    ];
    const missingFields = requiredFields.filter((field) => !form[field].trim());

    if (missingFields.length > 0) {
      Alert.alert(
        "Missing Information",
        "Please fill in all required fields.",
        [{ text: "OK", style: "default" }]
      );
      return;
    }

    const payload = {
      username: form.username,
      title: form.title.trim(),
      price: parseFloat(form.price),
      category: form.category.trim(),
      location: form.location.trim(),
      year: parseInt(form.year),
      mileage: parseInt(form.mileage),
      description: form.description.trim(),
      imageUrl: form.imageUrl || null, // Send Supabase URL or null
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
        Alert.alert("Success!", "Your ad has been posted successfully.", [
          {
            text: "OK",
            onPress: () => {
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
                imageUrl: null, // Reset imageUrl as well
              });
            },
          },
        ]);
      } else {
        const errorText = await res.text();
        Alert.alert(
          "Error",
          errorText || "Something went wrong. Please try again."
        );
      }
    } catch (err) {
      console.error("Network Error:", err);
      Alert.alert(
        "Network Error",
        "Could not post ad. Please check your internet connection."
      );
    }
  };

  const getInputStyle = (inputName) => {
    const borderColor = inputAnimations[inputName].interpolate({
      inputRange: [0, 1],
      outputRange: [SPOTIFY_COLORS.lightGray, SPOTIFY_COLORS.green],
    });

    return [
      styles.input,
      {
        borderColor,
        backgroundColor:
          focusedInput === inputName
            ? SPOTIFY_COLORS.mediumGray
            : SPOTIFY_COLORS.lightGray,
      },
    ];
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={SPOTIFY_COLORS.black}
        translucent={false}
      />

      <View style={styles.container}>
        <LinearGradient
          colors={[SPOTIFY_COLORS.black, SPOTIFY_COLORS.darkGray]}
          style={styles.gradient}
        >
          {/* Header */}
          <Animated.View
            style={[
              styles.header,
              {
                opacity: headerAnimation,
                transform: [
                  {
                    translateY: headerAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-30, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Icon name="arrow-back" size={24} color={SPOTIFY_COLORS.white} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Post Vehicle Ad</Text>
            <View style={styles.placeholder} />
          </Animated.View>

          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <Animated.View
              style={[
                styles.form,
                {
                  opacity: fadeInAnimation,
                  transform: [{ translateY: slideUpAnimation }],
                },
              ]}
            >
              {/* Form Fields */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Vehicle Title</Text>
                <Animated.View style={getInputStyle("title")}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="e.g., Toyota Camry 2022"
                    placeholderTextColor={SPOTIFY_COLORS.darkText}
                    value={form.title}
                    onChangeText={(text) => setForm({ ...form, title: text })}
                    onFocus={() => handleInputFocus("title")}
                    onBlur={() => handleInputBlur("title")}
                  />
                </Animated.View>
              </View>

              <View style={styles.row}>
                <View style={[styles.inputGroup, styles.halfWidth]}>
                  <Text style={styles.label}>Price (USD)</Text>
                  <Animated.View style={getInputStyle("price")}>
                    <TextInput
                      style={styles.textInput}
                      placeholder="25000"
                      placeholderTextColor={SPOTIFY_COLORS.darkText}
                      value={form.price}
                      onChangeText={(text) => setForm({ ...form, price: text })}
                      keyboardType="numeric"
                      onFocus={() => handleInputFocus("price")}
                      onBlur={() => handleInputBlur("price")}
                    />
                  </Animated.View>
                </View>

                <View style={[styles.inputGroup, styles.halfWidth]}>
                  <Text style={styles.label}>Year</Text>
                  <Animated.View style={getInputStyle("year")}>
                    <TextInput
                      style={styles.textInput}
                      placeholder="2022"
                      placeholderTextColor={SPOTIFY_COLORS.darkText}
                      value={form.year}
                      onChangeText={(text) => setForm({ ...form, year: text })}
                      keyboardType="numeric"
                      onFocus={() => handleInputFocus("year")}
                      onBlur={() => handleInputBlur("year")}
                    />
                  </Animated.View>
                </View>
              </View>

              <View style={styles.row}>
                <View style={[styles.inputGroup, styles.halfWidth]}>
                  <Text style={styles.label}>Category</Text>
                  <Animated.View style={getInputStyle("category")}>
                    <TextInput
                      style={styles.textInput}
                      placeholder="Car, Bike, SUV"
                      placeholderTextColor={SPOTIFY_COLORS.darkText}
                      value={form.category}
                      onChangeText={(text) =>
                        setForm({ ...form, category: text })
                      }
                      onFocus={() => handleInputFocus("category")}
                      onBlur={() => handleInputBlur("category")}
                    />
                  </Animated.View>
                </View>

                <View style={[styles.inputGroup, styles.halfWidth]}>
                  <Text style={styles.label}>Mileage (km)</Text>
                  <Animated.View style={getInputStyle("mileage")}>
                    <TextInput
                      style={styles.textInput}
                      placeholder="50000"
                      placeholderTextColor={SPOTIFY_COLORS.darkText}
                      value={form.mileage}
                      onChangeText={(text) =>
                        setForm({ ...form, mileage: text })
                      }
                      keyboardType="numeric"
                      onFocus={() => handleInputFocus("mileage")}
                      onBlur={() => handleInputBlur("mileage")}
                    />
                  </Animated.View>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Location</Text>
                <Animated.View style={getInputStyle("location")}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="New York, NY"
                    placeholderTextColor={SPOTIFY_COLORS.darkText}
                    value={form.location}
                    onChangeText={(text) =>
                      setForm({ ...form, location: text })
                    }
                    onFocus={() => handleInputFocus("location")}
                    onBlur={() => handleInputBlur("location")}
                  />
                </Animated.View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Description</Text>
                <Animated.View
                  style={[
                    getInputStyle("description"),
                    styles.descriptionContainer,
                  ]}
                >
                  <TextInput
                    style={[styles.textInput, styles.descriptionInput]}
                    placeholder="Describe your vehicle's condition, features, and any additional details..."
                    placeholderTextColor={SPOTIFY_COLORS.darkText}
                    value={form.description}
                    onChangeText={(text) =>
                      setForm({ ...form, description: text })
                    }
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                    onFocus={() => handleInputFocus("description")}
                    onBlur={() => handleInputBlur("description")}
                  />
                </Animated.View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Vehicle Image</Text>
                <TouchableOpacity
                  onPress={handleImagePick}
                  activeOpacity={0.8}
                  disabled={uploadingImage}
                >
                  <Animated.View
                    style={[
                      styles.imageButton,
                      { transform: [{ scale: imageButtonScale }] },
                      form.image && styles.imageButtonSelected,
                      uploadingImage && styles.imageButtonUploading,
                    ]}
                  >
                    <Icon
                      name={
                        uploadingImage
                          ? "cloud-upload"
                          : form.image
                          ? "check-circle"
                          : "cloud-upload"
                      }
                      size={24}
                      color={
                        uploadingImage
                          ? SPOTIFY_COLORS.lightText
                          : form.image
                          ? SPOTIFY_COLORS.green
                          : SPOTIFY_COLORS.white
                      }
                    />
                    <Text
                      style={[
                        styles.imageButtonText,
                        form.image && { color: SPOTIFY_COLORS.green },
                        uploadingImage && { color: SPOTIFY_COLORS.lightText },
                      ]}
                    >
                      {uploadingImage
                        ? "Uploading..."
                        : form.image
                        ? "Image Selected"
                        : "Upload Image"}
                    </Text>
                  </Animated.View>
                </TouchableOpacity>

                {form.image && (
                  <Animated.View
                    style={styles.imagePreviewContainer}
                    entering={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <Image
                      source={{ uri: form.image }}
                      style={styles.previewImage}
                    />
                    <TouchableOpacity
                      style={styles.removeImageButton}
                      onPress={() =>
                        setForm({ ...form, image: null, imageUrl: null })
                      }
                      disabled={uploadingImage}
                    >
                      <Icon
                        name="close"
                        size={20}
                        color={SPOTIFY_COLORS.white}
                      />
                    </TouchableOpacity>
                    {form.imageUrl && (
                      <View style={styles.uploadStatusBadge}>
                        <Icon
                          name="cloud-done"
                          size={16}
                          color={SPOTIFY_COLORS.white}
                        />
                        <Text style={styles.uploadStatusText}>Uploaded</Text>
                      </View>
                    )}
                  </Animated.View>
                )}
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                onPress={handleSubmit}
                activeOpacity={0.8}
                style={styles.submitButtonContainer}
                disabled={uploadingImage}
              >
                <Animated.View
                  style={[
                    styles.submitButton,
                    { transform: [{ scale: submitButtonScale }] },
                    uploadingImage && styles.submitButtonDisabled,
                  ]}
                >
                  <LinearGradient
                    colors={
                      uploadingImage
                        ? [SPOTIFY_COLORS.lightGray, SPOTIFY_COLORS.lightGray]
                        : [SPOTIFY_COLORS.green, SPOTIFY_COLORS.accent]
                    }
                    style={styles.submitGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text
                      style={[
                        styles.submitButtonText,
                        uploadingImage && { color: SPOTIFY_COLORS.darkText },
                      ]}
                    >
                      {uploadingImage ? "Please Wait..." : "Post Your Ad"}
                    </Text>
                    <Icon
                      name="send"
                      size={20}
                      color={
                        uploadingImage
                          ? SPOTIFY_COLORS.darkText
                          : SPOTIFY_COLORS.white
                      }
                    />
                  </LinearGradient>
                </Animated.View>
              </TouchableOpacity>
            </Animated.View>
          </ScrollView>
        </LinearGradient>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: SPOTIFY_COLORS.black,
  },
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: SPOTIFY_COLORS.lightGray,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: SPOTIFY_COLORS.lightGray,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: SPOTIFY_COLORS.white,
  },
  placeholder: {
    width: 40,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  form: {
    gap: 24,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: SPOTIFY_COLORS.white,
    marginBottom: 4,
  },
  row: {
    flexDirection: "row",
    gap: 16,
  },
  halfWidth: {
    flex: 1,
  },
  input: {
    borderRadius: 12,
    borderWidth: 2,
    backgroundColor: SPOTIFY_COLORS.lightGray,
  },
  textInput: {
    padding: 16,
    fontSize: 16,
    color: SPOTIFY_COLORS.white,
    fontWeight: "500",
  },
  descriptionContainer: {
    minHeight: 100,
  },
  descriptionInput: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  imageButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: SPOTIFY_COLORS.lightGray,
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: SPOTIFY_COLORS.lightGray,
    borderStyle: "dashed",
    gap: 12,
  },
  imageButtonSelected: {
    borderColor: SPOTIFY_COLORS.green,
    backgroundColor: SPOTIFY_COLORS.mediumGray,
  },
  imageButtonUploading: {
    opacity: 0.7,
  },
  imageButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: SPOTIFY_COLORS.white,
  },
  imagePreviewContainer: {
    marginTop: 16,
    position: "relative",
  },
  previewImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    resizeMode: "cover",
  },
  removeImageButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: SPOTIFY_COLORS.overlay,
    justifyContent: "center",
    alignItems: "center",
  },
  uploadStatusBadge: {
    position: "absolute",
    bottom: 8,
    right: 8,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: SPOTIFY_COLORS.green,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  uploadStatusText: {
    fontSize: 12,
    fontWeight: "600",
    color: SPOTIFY_COLORS.white,
  },
  submitButtonContainer: {
    marginTop: 12,
  },
  submitButton: {
    borderRadius: 25,
    overflow: "hidden",
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    paddingHorizontal: 32,
    gap: 12,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: SPOTIFY_COLORS.white,
  },
});

export default PostAdScreen;
