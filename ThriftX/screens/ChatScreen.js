import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ImageBackground,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";
import { COLORS } from "../utils/constants";

const ChatScreen = ({ route, navigation }) => {
  const sellerId = route?.params?.sellerId;
  const adId = route?.params?.adId;
  const [buyerId, setBuyerId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const flatListRef = useRef(null);
  const sendButtonScale = useRef(new Animated.Value(1)).current;
  const messageAnimations = useRef(new Map()).current;
  const inputContainerBottom = useRef(new Animated.Value(0)).current;

  console.log("ChatScreen rendered with sellerId:", sellerId, "adId:", adId);

  useEffect(() => {
    const loadBuyerId = async () => {
      const storedBuyerId = await AsyncStorage.getItem("userID");
      setBuyerId(storedBuyerId);
    };
    loadBuyerId();
  }, []);

  useEffect(() => {
    if (buyerId) {
      if (sellerId && adId) {
        fetchChats(buyerId, sellerId, adId);
        const interval = setInterval(() => {
          fetchChats(buyerId, sellerId, adId);
        }, 2000);
        return () => clearInterval(interval);
      } else {
        fetchPreviousChats(buyerId);
      }
    }
  }, [buyerId, sellerId, adId]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      if (buyerId && sellerId && adId) {
        fetchChats(buyerId, sellerId, adId);
      }
    });

    return unsubscribe;
  }, [navigation, buyerId, sellerId, adId]);

  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (e) => {
        const height = e.endCoordinates.height + 10;
        setKeyboardHeight(height);
        Animated.timing(inputContainerBottom, {
          toValue: height,
          duration: Platform.OS === "ios" ? e.duration : 250,
          useNativeDriver: false,
        }).start();
        setTimeout(
          () => {
            flatListRef.current?.scrollToEnd({ animated: true });
          },
          Platform.OS === "ios" ? e.duration : 250
        );
      }
    );

    const keyboardWillHideListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      (e) => {
        setKeyboardHeight(0);
        Animated.timing(inputContainerBottom, {
          toValue: 0,
          duration: Platform.OS === "ios" ? e.duration : 250,
          useNativeDriver: false,
        }).start();
      }
    );

    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, []);

  useEffect(() => {
    messages.forEach((_, index) => {
      if (!messageAnimations.has(index)) {
        messageAnimations.set(index, new Animated.Value(0));
      }
    });

    messages.forEach((_, index) => {
      const animation = messageAnimations.get(index);
      Animated.timing(animation, {
        toValue: 1,
        duration: 300,
        delay: index * 50,
        useNativeDriver: true,
      }).start();
    });

    return () => {
      messageAnimations.forEach((_, index) => {
        if (index >= messages.length) {
          messageAnimations.delete(index);
        }
      });
    };
  }, [messages]);

  const fetchChats = async (buyerId, sellerId, adId) => {
    try {
      const response = await fetch(
        `http://192.168.153.122:8082/api/realtime-messages/${buyerId}/${sellerId}/${adId}`
      );
      const data = await response.json();

      if (JSON.stringify(data) !== JSON.stringify(messages)) {
        setMessages(data);
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    } catch (error) {
      console.error("Failed to fetch chats:", error);
    }
  };

  const fetchPreviousChats = async (buyerId) => {
    try {
      const response = await fetch(
        `http://192.168.153.122:8082/api/realtime-messages/${buyerId}`
      );
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("Failed to fetch previous chats:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    if (!sellerId || !adId) {
      alert("Cannot send message: missing seller or ad info.");
      return;
    }

    const messagePayload = {
      senderid: buyerId,
      receiverid: sellerId,
      adid: adId,
      content: newMessage,
    };

    try {
      const response = await fetch(
        "http://192.168.153.122:8082/api/realtime-messages",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(messagePayload),
        }
      );
      const savedMessage = await response.json();
      setMessages((prev) => [...prev, savedMessage]);
      setNewMessage("");
      flatListRef.current?.scrollToEnd({ animated: true });
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const animateSendButton = () => {
    Animated.sequence([
      Animated.timing(sendButtonScale, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(sendButtonScale, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const renderMessage = ({ item, index }) => {
    const animation = messageAnimations.get(index) || new Animated.Value(1);

    return (
      <Animated.View
        style={[
          styles.messageContainer,
          {
            alignSelf: item.senderid === buyerId ? "flex-end" : "flex-start",
            backgroundColor:
              item.senderid === buyerId ? COLORS.accent : "#1E90FF",
            transform: [
              {
                translateY: animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                }),
              },
              {
                scale: animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1],
                }),
              },
            ],
            opacity: animation,
          },
        ]}
      >
        <Text style={styles.messageText}>{item.content}</Text>
        <Text style={styles.messageTime}>
          {new Date(item.timestamp || item.createdAt).toLocaleTimeString()}
        </Text>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/images/chatbaground.jpg")}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay} />

        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderMessage}
          contentContainerStyle={[
            styles.chatList,
            { paddingBottom: keyboardHeight > 0 ? keyboardHeight + 20 : 80 },
          ]}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />
        <Animated.View
          style={[
            styles.inputContainer,
            {
              bottom: inputContainerBottom,
            },
          ]}
        >
          <TextInput
            style={styles.input}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type a message"
            placeholderTextColor="rgba(255, 255, 255, 0.7)"
            editable={!!sellerId && !!adId}
            underlineColorAndroid="transparent"
          />
          <Animated.View style={{ transform: [{ scale: sendButtonScale }] }}>
            <TouchableOpacity
              style={[
                styles.sendButton,
                { opacity: sellerId && adId ? 1 : 0.5 },
              ]}
              onPress={() => {
                animateSendButton();
                handleSendMessage();
              }}
              disabled={!sellerId || !adId}
              accessibilityLabel="Send message"
            >
              <Icon name="send" size={24} color="#fff" />
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  chatList: {
    padding: 16,
    flexGrow: 1,
  },
  messageContainer: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 20,
    marginVertical: 4,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
    borderWidth: 0,
  },
  messageText: {
    fontSize: 16,
    color: "#fff",
    lineHeight: 22,
    fontWeight: "500",
  },
  messageTime: {
    fontSize: 10,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 4,
    alignSelf: "flex-end",
  },
  inputContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    padding: 10,
    backgroundColor: "transparent",
  },
  input: {
    flex: 1,
    backgroundColor: "transparent",
    borderRadius: 20,
    padding: 12,
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
    marginRight: 10,
    borderWidth: 2,
    borderColor: COLORS.accent,
    elevation: 0,
  },
  sendButton: {
    backgroundColor: COLORS.accent,
    borderRadius: 25,
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.accent,
    shadowOpacity: 0.6,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
});

export default ChatScreen;
