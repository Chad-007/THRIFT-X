import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  ImageBackground,
  Alert,
} from "react-native";
import styled from "styled-components/native";
import Input from "../components/Input";
import Button from "../components/Button";
import AsyncStorage from "@react-native-async-storage/async-storage";
const LoginScreen = ({ navigation }) => {
  const anim1 = useRef(new Animated.Value(0)).current;
  const anim2 = useRef(new Animated.Value(0)).current;
  const anim3 = useRef(new Animated.Value(0)).current;
  const anim4 = useRef(new Animated.Value(0)).current;

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    Animated.parallel([
      Animated.timing(anim1, {
        toValue: 1,
        duration: 300,
        delay: 200,
        easing: Easing.bezier(0.1, 0.7, 0.6, 0.9),
        useNativeDriver: true,
      }),
      Animated.timing(anim2, {
        toValue: 1,
        duration: 300,
        delay: 300,
        easing: Easing.bezier(0.1, 0.7, 0.6, 0.9),
        useNativeDriver: true,
      }),
      Animated.timing(anim3, {
        toValue: 1,
        duration: 300,
        delay: 400,
        easing: Easing.bezier(0.1, 0.7, 0.6, 0.9),
        useNativeDriver: true,
      }),
      Animated.timing(anim4, {
        toValue: 1,
        duration: 300,
        delay: 500,
        easing: Easing.bezier(0.1, 0.7, 0.6, 0.9),
        useNativeDriver: true,
      }),
    ]).start();
  }, [anim1, anim2, anim3, anim4]);

  const handleLogin = async () => {
    try {
      const response = await fetch("https://thrift-x.onrender.com/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      if (response.ok) {
        Alert.alert("Login Successful", "Welcome back!");
        const data = await response.json();
        await AsyncStorage.setItem("username", data.username);
        await AsyncStorage.setItem("userID", data.id.toString());
        console.log("User ID:", data.id);
        console.log("Username:", data.username);
        console.log("Login successful:", data.username);
        console.log("anything");
        navigation.replace("Animation");
      } else if (response.status == 401) {
        Alert.alert("Login Failed", "Invalid username or password.");
      } else {
        Alert.alert("Something went wrong", "Please try again later.");
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", "An error occurred while logging in.");
    }
  };
  return (
    <ImageBackground
      source={require("../assets/images/placeholder.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <Container>
        <Inner>
          <Animated.View
            style={[
              styles.content,
              {
                opacity: anim1,
                transform: [
                  {
                    translateX: anim1.interpolate({
                      inputRange: [0, 1],
                      outputRange: [50, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <Title>Login</Title>
          </Animated.View>
          <Animated.View
            style={[
              styles.inputWrapper,
              {
                opacity: anim2,
                transform: [
                  {
                    translateX: anim2.interpolate({
                      inputRange: [0, 1],
                      outputRange: [50, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <Input
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
            />
          </Animated.View>
          <Animated.View
            style={[
              styles.inputWrapper,
              {
                opacity: anim3,
                transform: [
                  {
                    translateX: anim3.interpolate({
                      inputRange: [0, 1],
                      outputRange: [50, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <Input
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </Animated.View>
          <Animated.View
            style={[
              styles.buttonWrapper,
              {
                opacity: anim4,
                transform: [
                  {
                    translateX: anim4.interpolate({
                      inputRange: [0, 1],
                      outputRange: [50, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <Button
              title="Log In"
              onPress={handleLogin}
              style={styles.button}
            />
            <Link onPress={() => navigation.navigate("Signup")}>
              <LinkText>Don't have an account? Sign Up</LinkText>
            </Link>
          </Animated.View>
        </Inner>
      </Container>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  content: { marginTop: 80 },
  inputWrapper: { width: 300, marginBottom: 16 },
  buttonWrapper: { marginTop: 40 },
  button: {
    backgroundColor: "transparent",
    borderWidth: 3,
    borderColor: "#fff",
    width: 300,
    height: 60,
  },
});

const Container = styled.View`
  flex: 1;
  padding-vertical: 50px;
  align-items: center;
  background: rgba(108, 99, 255, 0.7);
`;

const Inner = styled.View`
  width: 700px;
  max-width: 90%;
  height: 100%;
  align-items: center;
`;

const Title = styled.Text`
  font-size: 48px;
  color: #fff;
  margin-bottom: 40px;
  font-family: System;
  text-align: center;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

const Link = styled.TouchableOpacity`
  margin-top: 16px;
`;

const LinkText = styled.Text`
  color: #fff;
  font-size: 20px;
  text-align: center;
  font-family: System;
  text-decoration: underline;
`;

export default LoginScreen;
