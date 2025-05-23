import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";
import { COLORS } from "../utils/constants";

const dummyChats = [
  {
    id: "1",
    seller: "John Doe",
    lastMessage: "Hi, is the Toyota Camry still available?",
    timestamp: "10:30 AM",
  },
  {
    id: "2",
    seller: "Jane Smith",
    lastMessage: "Can you share more photos of the bike?",
    timestamp: "Yesterday",
  },
  {
    id: "3",
    seller: "Mike Johnson",
    lastMessage: "What’s the lowest price for the Tesla?",
    timestamp: "2 days ago",
  },
];

const ChatScreen = ({ navigation }) => {
  const [chats, setChats] = useState([]);
  const [search, setSearch] = useState("");
  const scaleAnims = useRef(
    dummyChats.map(() => new Animated.Value(1))
  ).current;

  useEffect(() => {
    setChats(dummyChats);
  }, []);

  useEffect(() => {
    if (search) {
      const filtered = dummyChats.filter((chat) =>
        chat.seller.toLowerCase().includes(search.toLowerCase())
      );
      setChats(filtered);
    } else {
      setChats(dummyChats);
    }
  }, [search]);

  const renderChatItem = ({ item, index }) => {
    const handlePress = () => {
      Animated.spring(scaleAnims[index], {
        toValue: 0.95,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }).start(() => {
        scaleAnims[index].setValue(1);
        // Add navigation to chat details if needed
      });
    };

    return (
      <TouchableOpacity onPress={handlePress}>
        <Animated.View
          style={[
            styles.chatItem,
            { transform: [{ scale: scaleAnims[index] }] },
          ]}
        >
          <View style={styles.avatar}>
            <Icon name="person" size={24} color={COLORS.inputBackground} />
          </View>
          <View style={styles.chatInfo}>
            <Text style={styles.sellerName}>{item.seller}</Text>
            <Text style={styles.lastMessage} numberOfLines={1}>
              {item.lastMessage}
            </Text>
          </View>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient
      colors={[COLORS.primary, COLORS.secondary]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Chats</Text>
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search sellers..."
          placeholderTextColor={COLORS.textSecondary}
          value={search}
          onChangeText={setSearch}
        />
        <Icon
          name="search"
          size={20}
          color={COLORS.textSecondary}
          style={styles.searchIcon}
        />
      </View>
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={renderChatItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 40 }, // Reduced
  header: {
    padding: 12, // Compact
    alignItems: "center",
  },
  title: {
    fontSize: 24, // Smaller
    color: COLORS.textPrimary, // Dark gray
    fontWeight: "700",
    fontFamily: "Roboto",
    letterSpacing: 0.5,
  },
  searchContainer: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    backgroundColor: COLORS.inputBackground, // White
    borderRadius: 20,
    padding: 10,
    paddingLeft: 36,
    fontSize: 14,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.border,
    fontFamily: "Roboto",
    shadowColor: COLORS.textSecondary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  searchIcon: {
    position: "absolute",
    left: 24,
  },
  list: { padding: 12, paddingBottom: 60 },
  chatItem: {
    flexDirection: "row",
    backgroundColor: COLORS.inputBackground, // White
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.textSecondary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  avatar: {
    width: 40, // Smaller
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.accent, // Teal
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  chatInfo: { flex: 1 },
  sellerName: {
    fontSize: 16, // Smaller
    fontWeight: "600",
    color: COLORS.textPrimary,
    fontFamily: "Roboto",
  },
  lastMessage: {
    fontSize: 12, // Smaller
    color: COLORS.textSecondary,
    fontFamily: "Roboto",
    marginTop: 3,
  },
  timestamp: {
    fontSize: 11, // Smaller
    color: COLORS.textSecondary,
    fontFamily: "Roboto",
  },
});

export default ChatScreen;
