import React, { useRef, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  Animated,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import IntroScreen from "../screens/IntroScreen";
import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import HomeScreen from "../screens/HomeScreen";
import VehicleDetailScreen from "../screens/VehicleDetailScreen";
import PostAdScreen from "../screens/PostAdScreen";
import ProfileScreen from "../screens/ProfileScreen";
import ChatScreen from "../screens/ChatScreen";
import AnimationScreen from "../screens/AnimationScreen";
import { COLORS } from "../utils/constants";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const forPageTransition = ({ current, next, layouts }) => {
  return {
    cardStyle: {
      transform: [
        {
          translateX: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [layouts.screen.width, 0],
          }),
        },
        {
          scale: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [0.95, 1],
          }),
        },
        {
          rotateY: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: ["10deg", "0deg"],
          }),
        },
      ],
      opacity: current.progress.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, 1, 1],
      }),
      shadowColor: COLORS.accent,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: current.progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.3],
      }),
      shadowRadius: 8,
    },
    outgoingCardStyle: {
      transform: [
        {
          translateX: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -layouts.screen.width],
          }),
        },
        {
          scale: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0.95],
          }),
        },
        {
          rotateY: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: ["0deg", "-10deg"],
          }),
        },
      ],
      opacity: current.progress.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [1, 0, 0],
      }),
    },
  };
};

// Custom Tab Bar Component
const CustomTabBar = ({ state, descriptors, navigation }) => {
  const focusedAnimation = useRef(new Animated.Value(1)).current;

  const animateTabPress = () => {
    focusedAnimation.setValue(0.8); // Scale down on press
    Animated.spring(focusedAnimation, {
      toValue: 1,
      friction: 6,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel || route.name;
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            animateTabPress();
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={styles.tabItem}
            accessibilityRole="button"
            accessibilityState={{ selected: isFocused }}
          >
            <Animated.View
              style={[
                styles.tabIconContainer,
                {
                  transform: [{ scale: isFocused ? focusedAnimation : 1 }],
                  backgroundColor: isFocused
                    ? COLORS.accent // Neon green
                    : "transparent",
                },
              ]}
            >
              {options.tabBarIcon({
                color: isFocused ? COLORS.textPrimary : COLORS.textPrimary,
                focused: isFocused,
              })}
            </Animated.View>
            <Text
              style={[
                styles.tabLabel,
                { color: isFocused ? COLORS.accent : COLORS.textPrimary },
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const MainTabs = () => {
  const sceneAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(sceneAnimation, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [sceneAnimation]);

  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        tabBarStyle: {
          backgroundColor: COLORS.primary, // Dark green
          borderTopWidth: 0,
          elevation: 10,
          height: 60,
          paddingBottom: 5,
        },
        tabBarActiveTintColor: COLORS.accent, // Neon green
        tabBarInactiveTintColor: COLORS.textPrimary, // Light text
        tabBarLabelStyle: { fontSize: 12, marginBottom: 5 },
        sceneContainerStyle: {
          transform: [
            {
              scale: sceneAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [0.98, 1],
              }),
            },
          ],
          opacity: sceneAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
          }),
        },
      }}
      sceneContainerStyle={{
        backgroundColor: COLORS.background, // Dark green fallback
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Icon name="home" size={28} color={color} />
          ),
        }}
        listeners={{
          tabPress: () => {
            sceneAnimation.setValue(0);
            Animated.timing(sceneAnimation, {
              toValue: 1,
              duration: 200,
              useNativeDriver: true,
            }).start();
          },
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Icon name="chat" size={28} color={color} />
          ),
        }}
        listeners={{
          tabPress: () => {
            sceneAnimation.setValue(0);
            Animated.timing(sceneAnimation, {
              toValue: 1,
              duration: 200,
              useNativeDriver: true,
            }).start();
          },
        }}
      />
      <Tab.Screen
        name="Sell"
        component={PostAdScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Icon name="add-circle" size={28} color={color} />
          ),
        }}
        listeners={{
          tabPress: () => {
            sceneAnimation.setValue(0);
            Animated.timing(sceneAnimation, {
              toValue: 1,
              duration: 200,
              useNativeDriver: true,
            }).start();
          },
        }}
      />
      <Tab.Screen
        name="Account"
        component={ProfileScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Icon name="person" size={28} color={color} />
          ),
        }}
        listeners={{
          tabPress: () => {
            sceneAnimation.setValue(0);
            Animated.timing(sceneAnimation, {
              toValue: 1,
              duration: 200,
              useNativeDriver: true,
            }).start();
          },
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = ({ initialRoute }) => (
  <Stack.Navigator
    initialRouteName={initialRoute}
    screenOptions={{
      gestureEnabled: true,
      gestureDirection: "horizontal",
      transitionSpec: {
        open: {
          animation: "spring",
          config: {
            stiffness: 100,
            damping: 20,
            mass: 0.5,
            overshootClamping: false,
            restDisplacementThreshold: 0.01,
            restSpeedThreshold: 0.01,
          },
        },
        close: {
          animation: "spring",
          config: {
            stiffness: 100,
            damping: 20,
            mass: 0.5,
            overshootClamping: false,
            restDisplacementThreshold: 0.01,
            restSpeedThreshold: 0.01,
          },
        },
      },
    }}
  >
    <Stack.Screen
      name="Intro"
      component={IntroScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Animation"
      component={AnimationScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Login"
      component={LoginScreen}
      options={{
        headerShown: false,
        cardStyleInterpolator: forPageTransition,
      }}
    />
    <Stack.Screen
      name="Signup"
      component={SignupScreen}
      options={{
        headerShown: false,
        cardStyleInterpolator: forPageTransition,
      }}
    />
    <Stack.Screen
      name="Main"
      component={MainTabs}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="VehicleDetail"
      component={VehicleDetailScreen}
      options={{
        headerShown: false,
        cardStyleInterpolator: forPageTransition,
      }}
    />
  </Stack.Navigator>
);

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    backgroundColor: COLORS.primary,
    height: 60,
    paddingBottom: 5,
    paddingHorizontal: 10,
    borderTopWidth: 0,
    elevation: 10,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tabIconContainer: {
    borderRadius: 20,
    padding: 8,
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 2,
  },
});

export default AppNavigator;
