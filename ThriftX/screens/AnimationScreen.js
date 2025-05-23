import React, { useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";
import LottieView from "lottie-react-native";

const AnimationScreen = ({ navigation }) => {
  const minimumDuration = 3000;
  const maxLoops = 3;
  const animationRef = useRef(null);
  const loopCount = useRef(0);

  const handleAnimationFinish = () => {
    loopCount.current += 1;
    console.log(`Animation loop ${loopCount.current} finished`);

    if (loopCount.current < maxLoops) {
      animationRef.current?.play();
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      console.log("Minimum duration of 5 seconds reached");
      if (loopCount.current >= maxLoops) {
        navigation.replace("Main");
      }
    }, minimumDuration);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <LottieView
        ref={animationRef}
        source={require("../assets/newani.json")}
        autoPlay
        loop={false}
        speed={1.333}
        onAnimationFinish={handleAnimationFinish}
        style={styles.animation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  animation: {
    width: 300,
    height: 300,
  },
});

export default AnimationScreen;
