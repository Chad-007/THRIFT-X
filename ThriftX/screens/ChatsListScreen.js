import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ChatsListScreen = ({ navigation }) => {
  const [buyerId, setBuyerId] = useState(null);
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const loadBuyerId = async () => {
      const storedBuyerId = await AsyncStorage.getItem("userID");
      setBuyerId(storedBuyerId);
    };
    loadBuyerId();
  }, []);

  useEffect(() => {
    if (buyerId) {
      fetchConversations(buyerId);
    }
  }, [buyerId]);

  const fetchConversations = async (buyerId) => {
    try {
      const response = await fetch(
        `http://192.168.153.122:8082/api/realtime-messages/latest/${buyerId}`
      );
      const data = await response.json();

      const groupedMap = new Map();

      data.forEach((message) => {
        const sellerId =
          message.senderid === buyerId ? message.receiverid : message.senderid;
        const key = `${sellerId}-${message.adid}`;

        if (!groupedMap.has(key)) {
          groupedMap.set(key, { ...message, sellerId });
        } else {
          const existing = groupedMap.get(key);
          const existingTime = new Date(
            existing.timestamp || existing.createdAt
          );
          const currentTime = new Date(message.timestamp || message.createdAt);
          if (currentTime > existingTime) {
            groupedMap.set(key, { ...message, sellerId });
          }
        }
      });

      const groupedConversations = Array.from(groupedMap.values());
      setConversations(groupedConversations);
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={{
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
      }}
      onPress={() =>
        navigation.navigate("Chatt", {
          sellerId: item.sellerId,
          adId: item.adid,
        })
      }
    >
      <Text style={{ fontWeight: "bold" }}>Seller: {item.sellerId}</Text>
      <Text numberOfLines={1} style={{ color: "#555" }}>
        {item.content}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={conversations}
        keyExtractor={(item) => `${item.sellerId}-${item.adid}`}
        renderItem={renderItem}
        ListEmptyComponent={() => (
          <Text style={{ padding: 20, textAlign: "center" }}>
            No conversations found.
          </Text>
        )}
      />
    </View>
  );
};

export default ChatsListScreen;
