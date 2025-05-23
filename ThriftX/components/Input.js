import React from "react";
import { StyleSheet, TextInput } from "react-native";

const Input = ({
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType,
  multiline,
}) => (
  <TextInput
    style={styles.input}
    placeholder={placeholder}
    placeholderTextColor="#ccc"
    value={value}
    onChangeText={onChangeText}
    secureTextEntry={secureTextEntry}
    keyboardType={keyboardType}
    multiline={multiline}
    autoCapitalize={keyboardType === "email-address" ? "none" : "sentences"}
  />
);

const styles = StyleSheet.create({
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 8,
    padding: 12,
    fontSize: 18,
    color: "#333",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});

export default Input;
