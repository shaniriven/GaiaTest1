import { Stack } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

const SavedChats = () => {
  return (
    <View>
      <Stack.Screen
        options={{
          headerTitle: "",
          headerTintColor: "black",
          headerBackTitle: "back",
        }}
      />
      <Text>Saved Chats Screen</Text>
    </View>
  );
};

export default SavedChats;
