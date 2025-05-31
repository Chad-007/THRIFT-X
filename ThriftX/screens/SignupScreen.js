import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  ImageBackground,
  Alert,
  StatusBar,
} from "react-native";
import styled from "styled-components/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Input from "../components/Input";
import Button from "../components/Button";

const SpotifyGreen = "#1DB954";
const SpotifyBlack = "#191414";
const SpotifyWhite = "#FFFFFF";

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
        navigation.replace("Login");
      } else {
        const errorData = await response.json();
        Alert.alert(
          "Error",
          errorData?.message || "Signup failed. Please try again."
        );
      }
    } catch (error) {
      console.error("Signup error:", error);
      Alert.alert("Error", "An error occurred. Please try again.");
    }
  };

  return (
    <Background
      source={require("../assets/images/splash.png")}
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" backgroundColor={SpotifyBlack} />
      <Container>
        <Inner>
          <Animated.View
            style={[
              styles.content,
              {
                opacity: anim1,
                transform: [
                  {
                    translateY: anim1.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-30, 0],
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
                    translateY: anim2.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-20, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <Input
              placeholder="Username"
              placeholderTextColor="#B3B3B3"
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
                    translateY: anim3.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-20, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <Input
              placeholder="Email"
              placeholderTextColor="#B3B3B3"
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
                    translateY: anim4.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-20, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <Input
              placeholder="Password"
              placeholderTextColor="#B3B3B3"
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
                    translateY: anim5.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-20, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <Button
              title="SIGN UP"
              onPress={handleSignup}
              style={styles.button}
            />
            <Link onPress={() => navigation.navigate("Login")}>
              <LinkText>Already have an account? Log in.</LinkText>
            </Link>
          </Animated.View>
        </Inner>
      </Container>
    </Background>
  );
};

const styles = StyleSheet.create({
  content: {
    marginTop: 80,
    marginBottom: 40,
  },
  inputWrapper: {
    width: "100%",
    marginBottom: 16,
  },
  buttonWrapper: {
    marginTop: 32,
    width: "100%",
  },
  button: {
    backgroundColor: SpotifyGreen,
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

const Background = styled(ImageBackground)`
  flex: 1;
  width: 100%;
  height: 100%;
  background-color: ${SpotifyBlack};
`;

const Container = styled.View`
  flex: 1;
  padding-horizontal: 30px;
  padding-top: 80px;
  align-items: center;
  justify-content: flex-start;
`;

const Inner = styled.View`
  width: 100%;
  align-items: center;
`;

const Title = styled.Text`
  font-size: 28px;
  color: ${SpotifyWhite};
  font-weight: bold;
  margin-bottom: 32px;
  text-align: center;
`;

const Link = styled.TouchableOpacity`
  margin-top: 24px;
`;

const LinkText = styled.Text`
  color: ${SpotifyWhite};
  font-size: 16px;
  text-align: center;
  text-decoration: underline;
`;

export default SignupScreen;
