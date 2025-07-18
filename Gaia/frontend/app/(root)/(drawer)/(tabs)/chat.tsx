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
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BouncyCheckboxClassic from '@/components/BouncyCheckboxClassic';
import CustomButton from '@/components/TabButton';
import config from '../../../../config';
import { useUser } from '@clerk/clerk-expo';

const api_url = config.api_url;

export const options = {
  headerShown: true,
};

const chatTags = [
  'Best time to visit...',
  'Things to do in...',
  'Safety tips for travelers...',
  'Local food to try...',
  'Add breakfast to the plan',
  
];

export default function ChatScreen() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState<{ from: 'user' | 'bot'; text: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [useTripContext, setUseTripContext] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const { user } = useUser();
  const userId = user?.id;
  const insets = useSafeAreaInsets();

  const sendMessage = async () => {
    if (!message.trim()) return;

    setChat((prev) => [...prev, { from: 'user', text: message.trim() }]);
    setLoading(true);
    Keyboard.dismiss();

    try {
      const res = await fetch(`${api_url}/api/chat/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: message.trim(),
          useTrips: useTripContext,
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

  const handleTagPress = (text: string) => {
    setMessage(text);
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      {/* Tags */}
      <View className="flex flex-row flex-wrap justify-center gap-0.5 px-4 pt-4 pb-2">
        {chatTags.map((tag, index) => (
          <CustomButton
            key={index}
            title={tag}
            bgVariant="gray-vibe"
            textVariant="primary"
            onPress={() => handleTagPress(tag)}
            className="px-4 min-w-[45%] border border-gray-50 shadow-md shadow-gray-600"
          />
       ))}
      </View>


      {/* Chat messages */}
      <View className="flex-1 px-4">
        <FlatList
          ref={flatListRef}
          data={chat}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <Text
              className={`${
                item.from === 'user'
                  ? 'self-end bg-green-100'
                  : 'self-start bg-gray-200'
              } px-4 py-2 rounded-xl my-1 max-w-[80%]`}
            >
              {item.text}
            </Text>
          )}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
          contentContainerStyle={{ paddingBottom: 12 }}
        />
        {loading && <ActivityIndicator size="small" color="#000" className="mb-2" />}
      </View>

      {/* Checkbox + Input */}
      <View
        className="px-4 pt-2 border-t border-gray-300 bg-white"
        style={{ paddingBottom: insets.bottom || 8 }}
      >
        <BouncyCheckboxClassic
          label="Base your answer on my existing trips"
          state={useTripContext}
          setState={setUseTripContext}
        />

        <View className="flex-row items-end mt-2">
          <TextInput
            className="flex-1 px-4 py-2 bg-gray-100 rounded-full text-base max-h-[100px]"
            placeholder="Ask anything..."
            value={message}
            onChangeText={setMessage}
            multiline
          />
          <TouchableOpacity onPress={sendMessage} className="bg-green-600 p-3 rounded-full ml-2">
            <Ionicons name="send" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
