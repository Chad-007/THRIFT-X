import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  ImageBackground,
  Alert,
} from "react-native";
import styled from "styled-components/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Input from "../components/Input";
import Button from "../components/Button";

const SignupScreen = ({ navigation }) => {
  const anim1 = useRef(new Animated.Value(0)).current;
  const anim2 = useRef(new Animated.Value(0)).current;
  const anim3 = useRef(new Animated.Value(0)).current;
  const anim4 = useRef(new Animated.Value(0)).current;
  const anim5 = useRef(new Animated.Value(0)).current;

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
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
      Animated.timing(anim5, {
        toValue: 1,
        duration: 300,
        delay: 600,
        easing: Easing.bezier(0.1, 0.7, 0.6, 0.9),
        useNativeDriver: true,
      }),
    ]).start();
  }, [anim1, anim2, anim3, anim4, anim5]);

  const handleSignup = async () => {
    try {
      const response = await fetch("https://thrift-x.onrender.com/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (response.ok) {
        Alert.alert("Success", "Account created successfully");
        navigation.replace("Animation");
      } else {
        Alert.alert("Error", "Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      Alert.alert("Error", "An error occurred. Please try again.");
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
            <Title>Sign Up</Title>
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
              placeholderTextColor="#999"
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
              placeholder="Email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
          </Animated.View>
          <Animated.View
            style={[
              styles.inputWrapper,
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
            <Input
              placeholder="Password"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </Animated.View>
          <Animated.View
            style={[
              styles.buttonWrapper,
              {
                opacity: anim5,
                transform: [
                  {
                    translateX: anim5.interpolate({
                      inputRange: [0, 1],
                      outputRange: [50, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <Button
              title="Sign Up"
              onPress={handleSignup}
              style={styles.button}
            />
            <Link onPress={() => navigation.navigate("Login")}>
              <LinkText>Already have an account? Log In</LinkText>
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
  inputWrapper: {
    width: 300,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonWrapper: { marginTop: 40 },
  button: {
    backgroundColor: "transparent",
    borderWidth: 3,
    borderColor: "#fff",
    width: 300,
    height: 60,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
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
  text-decoration: underline;
`;

export default SignupScreen;
