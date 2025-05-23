import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import tw from "twrnc";
import Animated, { FadeIn } from "react-native-reanimated";

export default function MainScreen() {
  const navigation = useNavigation();

  return (
    <View style={tw`flex-1 justify-center items-center bg-gray-100`}>
      <Animated.View entering={FadeIn.duration(600)}>
        <Text style={tw`text-3xl font-bold mb-4`}>
          Welcome to the Main Screen!
        </Text>
        <TouchableOpacity
          style={tw`bg-indigo-600 rounded-xl p-4`}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={tw`text-white font-bold text-lg`}>Logout</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}
