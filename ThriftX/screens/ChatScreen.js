import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ChatScreen = ({ route, navigation }) => {
  const sellerId = route?.params?.sellerId;
  const adId = route?.params?.adId;
  const [buyerId, setBuyerId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

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
      } else {
        fetchPreviousChats(buyerId);
      }
    }
  }, [buyerId, sellerId, adId]);

  const fetchChats = async (buyerId, sellerId, adId) => {
    try {
      const response = await fetch(
        `http://192.168.153.122:8082/api/realtime-messages/${buyerId}/${sellerId}/${adId}`
      );
      const data = await response.json();
      setMessages(data);
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
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View
            style={{
              alignSelf: item.senderid === buyerId ? "flex-end" : "flex-start",
              backgroundColor:
                item.senderid === buyerId ? "#DCF8C6" : "#ECECEC",
              borderRadius: 10,
              padding: 10,
              margin: 5,
              maxWidth: "80%",
            }}
          >
            <Text>{item.content}</Text>
            <Text style={{ fontSize: 10, color: "#555", marginTop: 4 }}>
              {new Date(item.timestamp || item.createdAt).toLocaleTimeString()}
            </Text>
          </View>
        )}
      />

      <View style={{ flexDirection: "row", padding: 10 }}>
        <TextInput
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 20,
            padding: 10,
          }}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message"
          editable={!!sellerId && !!adId}
        />
        <TouchableOpacity
          onPress={handleSendMessage}
          disabled={!sellerId || !adId}
        >
          <Text
            style={{
              marginLeft: 10,
              color: sellerId && adId ? "blue" : "gray",
              fontWeight: "bold",
            }}
          >
            Send
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatScreen;
