import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ImageBackground,
  RefreshControl,
  StatusBar,
  Dimensions,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";
import { COLORS } from "../utils/constants";

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const { width, height } = Dimensions.get("window");

const ChatsListScreen = ({ navigation }) => {
  const [buyerId, setBuyerId] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const animationRefs = useRef(new Map()).current;
  const headerAnimation = useRef(new Animated.Value(0)).current;
  const scrollY = useRef(new Animated.Value(0)).current;
  const fadeInAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loadBuyerId = async () => {
      try {
        const storedBuyerId = await AsyncStorage.getItem("userID");
        setBuyerId(storedBuyerId);
      } catch (error) {
        console.error("Failed to load buyer ID:", error);
      }
    };
    loadBuyerId();
  }, []);

  useEffect(() => {
    if (buyerId) {
      fetchConversations(buyerId);
    }
  }, [buyerId]);

  useEffect(() => {
    Animated.timing(headerAnimation, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    Animated.timing(fadeInAnimation, {
      toValue: 1,
      duration: 600,
      delay: 200,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    conversations.forEach((_, index) => {
      if (!animationRefs.has(index)) {
        animationRefs.set(index, {
          scale: new Animated.Value(0),
          opacity: new Animated.Value(0),
          translateY: new Animated.Value(50),
        });
      }
    });

    const animations = conversations.map((_, index) => {
      const refs = animationRefs.get(index);
      return Animated.parallel([
        Animated.timing(refs.scale, {
          toValue: 1,
          duration: 400,
          delay: index * 80,
          useNativeDriver: true,
        }),
        Animated.timing(refs.opacity, {
          toValue: 1,
          duration: 400,
          delay: index * 80,
          useNativeDriver: true,
        }),
        Animated.timing(refs.translateY, {
          toValue: 0,
          duration: 400,
          delay: index * 80,
          useNativeDriver: true,
        }),
      ]);
    });

    Animated.stagger(50, animations).start();

    return () => {
      animationRefs.forEach((_, index) => {
        if (index >= conversations.length) {
          animationRefs.delete(index);
        }
      });
    };
  }, [conversations]);

  const fetchConversations = async (buyerId, isRefresh = false) => {
    try {
      if (!isRefresh) setLoading(true);

      const response = await fetch(
        `http://192.168.153.122:8082/api/realtime-messages/latest/${buyerId}`
      );
      const data = await response.json();

      const groupedMap = new Map();

      data.forEach((message) => {
        const isBuyerSender = message.senderid === buyerId;
        const otherUserId = isBuyerSender
          ? message.receiverid
          : message.senderid;

        const groupKey = `${otherUserId}-${message.adid}`;

        if (!groupedMap.has(groupKey)) {
          groupedMap.set(groupKey, {
            ...message,
            otherUserId,
            isUnread: Math.random() > 0.5,
          });
        } else {
          const existing = groupedMap.get(groupKey);
          const existingTime = new Date(
            existing.timestamp || existing.createdAt
          );
          const currentTime = new Date(message.timestamp || message.createdAt);
          if (currentTime > existingTime) {
            groupedMap.set(groupKey, {
              ...message,
              otherUserId,
              isUnread: Math.random() > 0.5,
            });
          }
        }
      });

      const groupedConversations = Array.from(groupedMap.values()).sort(
        (a, b) =>
          new Date(b.timestamp || b.createdAt) -
          new Date(a.timestamp || a.createdAt)
      );

      setConversations(groupedConversations);
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
    } finally {
      setLoading(false);
      if (isRefresh) setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    if (buyerId) {
      fetchConversations(buyerId, true);
    }
  }, [buyerId]);

  const handlePress = (item, index) => {
    const refs = animationRefs.get(index);

    Animated.sequence([
      Animated.parallel([
        Animated.timing(refs.scale, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(refs.opacity, {
          toValue: 0.8,
          duration: 100,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.spring(refs.scale, {
          toValue: 1,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(refs.opacity, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      navigation.navigate("Chatt", {
        sellerId: item.otherUserId,
        adId: item.adid,
      });
    });
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getInitials = (userId) => {
    return `U${userId?.toString().slice(-2) || "00"}`;
  };

  const renderItem = ({ item, index }) => {
    const refs = animationRefs.get(index) || {
      scale: new Animated.Value(1),
      opacity: new Animated.Value(1),
      translateY: new Animated.Value(0),
    };

    return (
      <Animated.View
        style={[
          styles.conversationCard,
          {
            opacity: refs.opacity,
            transform: [{ scale: refs.scale }, { translateY: refs.translateY }],
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => handlePress(item, index)}
          style={styles.touchableContent}
          activeOpacity={0.8}
        >
          <View style={styles.conversationContent}>
            <View style={styles.leftSection}>
              <View
                style={[styles.avatar, item.isUnread && styles.unreadAvatar]}
              >
                <Text style={styles.avatarText}>
                  {getInitials(item.otherUserId)}
                </Text>
                {item.isUnread && <View style={styles.unreadDot} />}
              </View>

              <View style={styles.messageInfo}>
                <View style={styles.userRow}>
                  <Text
                    style={[
                      styles.userText,
                      item.isUnread && styles.unreadUserText,
                    ]}
                  >
                    User {item.otherUserId}
                  </Text>
                  <Text style={styles.timeText}>
                    {formatTime(item.timestamp || item.createdAt)}
                  </Text>
                </View>

                <Text
                  style={[
                    styles.messageText,
                    item.isUnread && styles.unreadMessageText,
                  ]}
                  numberOfLines={2}
                >
                  {item.content}
                </Text>
              </View>
            </View>

            <View style={styles.rightSection}>
              <Icon
                name="chevron-right"
                size={24}
                color="rgba(255, 255, 255, 0.4)"
              />
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -20],
    extrapolate: "clamp",
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.8],
    extrapolate: "clamp",
  });

  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <ImageBackground
        source={require("../assets/images/chatbaground.jpg")}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <LinearGradient
          colors={[
            COLORS.primary + "E6",
            COLORS.secondary + "E6",
            COLORS.primary + "F0",
          ]}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Animated.View
            style={[
              styles.header,
              {
                transform: [
                  {
                    translateY: headerAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-50, 0],
                    }),
                  },
                  { translateY: headerTranslateY },
                ],
                opacity: Animated.multiply(headerAnimation, headerOpacity),
              },
            ]}
          >
            <View style={styles.headerContent}>
              <Text style={styles.headerTitle}>Messages</Text>
              <Text style={styles.headerSubtitle}>
                {conversations.length} conversation
                {conversations.length !== 1 ? "s" : ""}
              </Text>
            </View>
          </Animated.View>

          <Animated.View
            style={[styles.listWrapper, { opacity: fadeInAnimation }]}
          >
            <AnimatedFlatList
              data={conversations}
              keyExtractor={(item) => `${item.otherUserId}-${item.adid}`}
              renderItem={renderItem}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                { useNativeDriver: true }
              )}
              scrollEventThrottle={16}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  tintColor="#fff"
                  colors={[COLORS.accent]}
                />
              }
              ListEmptyComponent={() => (
                <View style={styles.emptyContainer}>
                  <Icon
                    name="forum"
                    size={64}
                    color="rgba(255, 255, 255, 0.3)"
                  />
                  <Text style={styles.emptyTitle}>No conversations yet</Text>
                  <Text style={styles.emptyText}>
                    Your messages will appear here once you start chatting
                  </Text>
                </View>
              )}
            />
          </Animated.View>
        </LinearGradient>
      </ImageBackground>
    </>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingHorizontal: 24,
    paddingBottom: 20,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  headerContent: {
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#fff",
    textAlign: "center",
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.7)",
    marginTop: 4,
    fontWeight: "500",
  },
  listWrapper: {
    flex: 1,
  },
  listContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  conversationCard: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
    marginVertical: 6,
  },
  touchableContent: {
    padding: 18,
  },
  conversationContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  leftSection: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.accent + "80",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    position: "relative",
  },
  unreadAvatar: {
    backgroundColor: COLORS.accent,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.5,
  },
  unreadDot: {
    position: "absolute",
    top: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.accent,
  },
  messageInfo: {
    flex: 1,
  },
  userRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  userText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    flex: 1,
  },
  unreadUserText: {
    color: "#fff",
    fontWeight: "700",
  },
  messageText: {
    fontSize: 15,
    color: "rgba(255, 255, 255, 0.85)",
    lineHeight: 20,
    marginRight: 8,
  },
  unreadMessageText: {
    color: "#fff",
    fontWeight: "500",
  },
  timeText: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.6)",
    fontWeight: "500",
    marginLeft: 8,
  },
  rightSection: {
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    marginTop: 24,
    marginBottom: 12,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
    lineHeight: 24,
  },
});

export default ChatsListScreen;
