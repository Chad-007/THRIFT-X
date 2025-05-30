import "react-native-url-polyfill/auto"; // ✅ required by supabase-js
import { Buffer } from "buffer";
import process from "process";
import stream from "stream";
import util from "util";

if (!global.Buffer) global.Buffer = Buffer;
if (!global.process) global.process = process;
if (!global.stream) global.stream = stream;
if (!global.util) global.util = util;

import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
