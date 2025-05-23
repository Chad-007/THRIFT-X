import React from "react";
import { StyleSheet, ActivityIndicator, View } from "react-native";
import { COLORS } from "../utils/constants";

const LoadingSpinner = () => (
  <View style={styles.container}>
    <ActivityIndicator size="large" color={COLORS.accent} />
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
});

export default LoadingSpinner;
