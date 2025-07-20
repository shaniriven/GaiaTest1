import React, { useState, useRef, useEffect } from 'react';
import {
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Keyboard,
  View,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import BouncyCheckboxClassic from '@/components/BouncyCheckboxClassic';
import CustomButton from '@/components/TabButton';
import config from '../../../../config';
import { useUser } from '@clerk/clerk-expo';
import { useRoute } from '@react-navigation/native';

const api_url = config.api_url;

export const options = {
  headerShown: true,
};

const chatTags = [
  'Check my trip plan',
  'Best time to visit...',
  'Things to do in...',
  'Safety tips for travelers...',
  'Local food to try...',
];

export default function ChatScreen() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState<{ from: 'user' | 'bot'; text: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [useTripContext, setUseTripContext] = useState(false);
  const [chatStarted, setChatStarted] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const { user } = useUser();
  const userId = user?.id;
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const { params } = useRoute<any>();
  const savedChatString = params?.savedChat;

  useEffect(() => {
    let savedChat = null;
    if (typeof savedChatString === 'string') {
      try {
        savedChat = JSON.parse(savedChatString);
      } catch (e) {
        savedChat = null;
      }
    }
    if (savedChat && savedChat.conversation) {
      const formatted = savedChat.conversation.map((msg: any) => ({
        from: msg.sender,
        text: msg.message,
      }));
      setChat(formatted);
      setChatStarted(true);
    }
  }, [savedChatString]);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            if (!chat.length) {
              navigation.goBack();
              return;
            }

            Alert.alert(
              'Leave Chat?',
              'Do you want to save this chat before leaving?',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Exit Without Saving',
                  style: 'destructive',
                  onPress: () => {
                    setChat([]);
                    setMessage('');
                    setChatStarted(false);
                    navigation.goBack();
                  },
                },
                {
                  text: 'Save & Exit',
                  onPress: async () => {
                    await saveChat();
                    setChat([]);
                    setMessage('');
                    setChatStarted(false);
                    navigation.goBack();
                  },
                },
              ]
            );
          }}
          style={{ paddingHorizontal: 16 }}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, chat]);

  const sendMessage = async (msgToSend?: string) => {
    const text = msgToSend ?? message.trim();
    if (!text) return;

    setChat((prev) => [...prev, { from: 'user', text }]);
    setLoading(true);
    Keyboard.dismiss();
    setChatStarted(true);

    try {
      const res = await fetch(`${api_url}/chat/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          useTrips: useTripContext,
          user_id: userId,
        }),
      });

      const data = await res.json();
      if (data.response) {
        setChat((prev) => [...prev, { from: 'bot', text: data.response }]);
      } else {
        setChat((prev) => [...prev, { from: 'bot', text: 'No response from AI.' }]);
      }
    } catch (err) {
      setChat((prev) => [...prev, { from: 'bot', text: 'Something went wrong. Please try again.' }]);
    }

    setMessage('');
    setLoading(false);
  };

  const saveChat = async () => {
    if (!chat.length || !userId) {
      Alert.alert('Cannot save', 'No chat to save or user not identified.');
      return;
    }

    try {
      const formattedChat = chat.map((msg) => ({
        sender: msg.from,
        message: msg.text,
      }));

      const res = await fetch(`${api_url}/documents/save_chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          trip_id: null,
          conversation: formattedChat,
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        Alert.alert('Error', result.error || 'Failed to save chat.');
      }
    } catch (err) {
      Alert.alert('Error', 'Something went wrong while saving the chat.');
    }
  };

  const handleTagPress = (text: string) => {
    setMessage(text);
    setChatStarted(true);
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <FlatList
        ref={flatListRef}
        data={chat}
        keyExtractor={(_, index) => index.toString()}
        ListHeaderComponent={
          <>
            {!chatStarted && (
              <View className="pt-8 pb-2 px-4 items-center">
                <Text className="text-base font-bold text-black mb-2">Gaia chat</Text>
                <Text className="text-lg font-medium text-center text-gray-800 mb-1">what can i help you with?</Text>
                <Text className="text-xs text-center text-gray-500 mb-4">
                  start a conversation or click on a subject to start your message
                </Text>
              </View>
            )}
            {!chatStarted && (
              <View className="flex flex-row flex-wrap justify-center gap-2 px-4 pb-2">
                {chatTags.map((tag, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleTagPress(tag)}
                    className="px-4 py-2 bg-gray-100 rounded-full border border-gray-200 mb-2 mr-2 shadow-sm"
                    style={{ minWidth: '45%' }}
                  >
                    <Text className="text-gray-700 text-sm text-center">{tag}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </>
        }
        renderItem={({ item }) => (
          <Text
            className={`${
              item.from === 'user'
                ? 'self-end bg-green-100'
                : 'self-start bg-gray-200'
            } px-4 py-2 rounded-xl my-1 max-w-[80%] text-base`}
            style={{ fontFamily: 'System' }}
          >
            {item.text}
          </Text>
        )}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
        contentContainerStyle={{ paddingBottom: 12, paddingHorizontal: 16, flexGrow: 1 }}
        ListFooterComponent={loading ? <ActivityIndicator size="small" color="#000" className="mb-2" /> : null}
      />

      <View className="px-4 pt-2 border-t border-gray-200 bg-white" style={{ paddingBottom: insets.bottom || 8 }}>
        <View className="flex-row items-center mb-2">
          <BouncyCheckboxClassic
            state={useTripContext}
            setState={setUseTripContext}
            label="Base your answer on my existing trips"
            size={20}
            fillColor="#2563eb"
            unFillColor="#FFFFFF"
            iconStyle={{ borderColor: '#2563eb', borderRadius: 6 }}
            innerIconStyle={{ borderWidth: 2 }}
          />
        </View>

        <View className="flex-row items-end mt-2">
          <TextInput
            className="flex-1 px-4 py-2 bg-gray-100 rounded-full text-base max-h-[100px] border border-gray-200"
            placeholder="Ask anything..."
            value={message}
            onChangeText={setMessage}
            multiline
            style={{ fontFamily: 'System' }}
          />
          <TouchableOpacity onPress={() => sendMessage()} className="bg-green-600 p-3 rounded-full ml-2 shadow-md">
            <Ionicons name="send" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
