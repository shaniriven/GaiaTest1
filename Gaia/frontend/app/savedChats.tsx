import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import config from '../config';
import { useRouter } from 'expo-router';

const api_url = config.api_url;
const screenWidth = Dimensions.get('window').width;
const cardWidth = (screenWidth - 48) / 2;

export default function SavedChats() {
  const { user } = useUser();
  const userId = user?.id;
  const router = useRouter();

  const [savedChats, setSavedChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await fetch(`${api_url}/documents/get_chats/${userId}`);
        const data = await res.json();
        setSavedChats(data);
      } catch (err) {
        console.error("Error fetching saved chats:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchChats();
  }, [userId]);

  const handleDelete = async (item: any) => {
    console.log("Deleting chat with ID:", item._id);
    Alert.alert(
      'Delete Chat',
      'Are you sure you want to delete this saved chat?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              const res = await fetch(`${api_url}/documents/delete_chat/${item._id}`, {
                method: 'DELETE',
              });
  
              if (res.ok) {
                setSavedChats(prev => prev.filter(c => c._id !== item._id));
                Alert.alert('Deleted', 'Chat deleted successfully.');
              } else {
                Alert.alert('Error', 'Failed to delete chat.');
              }
            } catch (err) {
              console.error("❌ Delete error:", err);
              Alert.alert('Error', 'Something went wrong.');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };
  

  const renderChatCard = ({ item }: { item: any }) => {
    const firstUserMsg = item.conversation.find((msg: any) => msg.sender === 'user')?.message || 'Saved Chat';
  
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          router.push({
            pathname: '/(root)/(drawer)/(tabs)/chat',
            params: { savedChat: JSON.stringify(item) }
          })
        }
        onLongPress={() => handleDelete(item)} // ✅ Make sure _id exists
      >
        <Text style={styles.cardText} numberOfLines={3}>
          {firstUserMsg}
        </Text>
      </TouchableOpacity>
    );
  };
  

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
    <FlatList
      data={savedChats}
      keyExtractor={(item) => item._id}
      renderItem={renderChatCard}
      numColumns={2}
      contentContainerStyle={styles.grid}
    />
    <View style={styles.tipContainer}>
      <Text style={styles.tipText}>💡 Long press to delete a chat</Text>
    </View>
  </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    padding: 12,
    gap: 12,
  },
  card: {
    backgroundColor: '#f0f9ff',
    borderRadius: 16,
    padding: 16,
    margin: 6,
    width: cardWidth,
    minHeight: 120,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e3a8a',
  },

  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e3a8a',
  },
  timestamp: {
    marginTop: 8,
    fontSize: 12,
    color: '#64748b',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  tipContainer: {
    paddingVertical: 20,
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  tipText: {
    fontSize: 13,
    color: '#475569',
  },
  
});
