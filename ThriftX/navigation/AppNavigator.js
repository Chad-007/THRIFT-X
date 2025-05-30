import React, { useRef, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  Animated,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Dimensions,
  Platform,
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
import ChatListScreen from "../screens/ChatsListScreen";
import AnimationScreen from "../screens/AnimationScreen";

import { COLORS } from "../utils/constants";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const { width: screenWidth } = Dimensions.get("window");

const forPageTransition = ({ current, next, layouts }) => {
  const { width } = layouts.screen;
  return {
    cardStyle: {
      transform: [
        {
          translateX: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [width, 0],
          }),
        },
        {
          scale: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [0.92, 1],
          }),
        },
        {
          rotateY: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: ["15deg", "0deg"],
          }),
        },
      ],
      opacity: current.progress.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, 0.7, 1],
      }),
    },
    overlayStyle: {
      opacity: current.progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.3],
      }),
    },
  };
};

const CustomTabBar = ({ state, descriptors, navigation }) => {
  return (
    <View style={styles.tabBarContainer}>
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel ?? options.title ?? route.name;
          const isFocused = state.index === index;

          const iconAnim = useRef(
            new Animated.Value(isFocused ? 1 : 0)
          ).current;

          useEffect(() => {
            Animated.spring(iconAnim, {
              toValue: isFocused ? 1 : 0,
              friction: 5,
              tension: 80,
              useNativeDriver: true,
            }).start();
          }, [isFocused, iconAnim]);

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          const iconScale = iconAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 1.15],
          });

          const labelTranslateY = iconAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -2],
          });

          const iconContainerOpacity = iconAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
          });

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tabItem}
            >
              <View style={styles.iconWrapper}>
                <Animated.View
                  style={[
                    styles.tabIconBackground,
                    {
                      opacity: iconContainerOpacity,
                      transform: [{ scale: iconAnim }],
                    },
                  ]}
                />
                <Animated.View style={[{ transform: [{ scale: iconScale }] }]}>
                  {options.tabBarIcon({
                    focused: isFocused,
                    color: isFocused ? COLORS.green : COLORS.textSecondary,
                    size: 26,
                  })}
                </Animated.View>
              </View>
              <Animated.Text
                style={[
                  styles.tabLabel,
                  {
                    color: isFocused ? COLORS.green : COLORS.textSecondary,
                    transform: [{ translateY: labelTranslateY }],
                  },
                ]}
                numberOfLines={1}
              >
                {label}
              </Animated.Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const MainTabs = () => {
  const sceneAnimation = useRef(new Animated.Value(0)).current;
  const currentTab = useRef(null);

  const handleTabPress = (route) => {
    if (currentTab.current !== route.name) {
      sceneAnimation.setValue(0);
      Animated.timing(sceneAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      currentTab.current = route.name;
    }
  };

  useEffect(() => {
    Animated.timing(sceneAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Icon name="home" size={size} color={color} />
          ),
        }}
        listeners={({ navigation, route }) => ({
          tabPress: (e) => {
            handleTabPress(route);
          },
        })}
      />
      <Tab.Screen
        name="ChatList"
        component={ChatListScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Icon name="chat-bubble-outline" size={size} color={color} />
          ),
        }}
        listeners={({ navigation, route }) => ({
          tabPress: (e) => {
            handleTabPress(route);
          },
        })}
      />
      <Tab.Screen
        name="Sell"
        component={PostAdScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Icon name="add-circle-outline" size={size} color={color} />
          ),
        }}
        listeners={({ navigation, route }) => ({
          tabPress: (e) => {
            handleTabPress(route);
          },
        })}
      />
      <Tab.Screen
        name="Account"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Icon name="person-outline" size={size} color={color} />
          ),
        }}
        listeners={({ navigation, route }) => ({
          tabPress: (e) => {
            handleTabPress(route);
          },
        })}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = ({ initialRoute = "Intro" }) => (
  <Stack.Navigator
    initialRouteName={initialRoute}
    screenOptions={{
      headerShown: false,
      gestureEnabled: true,
      gestureDirection: "horizontal",
      transitionSpec: {
        open: {
          animation: "spring",
          config: {
            stiffness: 200,
            damping: 25,
            mass: 0.7,
            overshootClamping: false,
            restDisplacementThreshold: 0.01,
            restSpeedThreshold: 0.01,
          },
        },
        close: {
          animation: "spring",
          config: {
            stiffness: 200,
            damping: 25,
            mass: 0.7,
          },
        },
      },
      cardStyleInterpolator: forPageTransition,
    }}
  >
    <Stack.Screen name="Intro" component={IntroScreen} />
    <Stack.Screen name="Animation" component={AnimationScreen} />
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Signup" component={SignupScreen} />
    <Stack.Screen name="Main" component={MainTabs} />
    <Stack.Screen name="VehicleDetail" component={VehicleDetailScreen} />
    <Stack.Screen name="Chatt" component={ChatScreen} />
  </Stack.Navigator>
);

const styles = StyleSheet.create({
  tabBarContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: Platform.OS === "ios" ? 20 : 0,
    paddingHorizontal: 10,
    elevation: 0,
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: COLORS.black,
    height: 65,
    borderRadius: 32.5,
    marginHorizontal: 10,
    marginBottom: Platform.OS === "android" ? 10 : 5,
    alignItems: "center",
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  iconWrapper: {
    alignItems: "center",
    justifyContent: "center",
    width: 44,
    height: 44,
  },
  tabIconBackground: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: COLORS.green,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: "600",
    marginTop: 4,
    textAlign: "center",
  },
});

export default AppNavigator;
