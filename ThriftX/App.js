import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import AppNavigator from "./navigation/AppNavigator";

export default function App() {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const checkIntroStatus = async () => {
      try {
        const hasSeenIntro = await AsyncStorage.getItem("hasSeenIntro");
        setInitialRoute(hasSeenIntro === "true" ? "Login" : "Intro");
      } catch (error) {
        console.error("Error checking intro status:", error);
        setInitialRoute("Intro");
      }
    };
    checkIntroStatus();
  }, []);

  if (!initialRoute) return null;

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AppNavigator initialRoute={initialRoute} />
        <StatusBar style="auto" />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
