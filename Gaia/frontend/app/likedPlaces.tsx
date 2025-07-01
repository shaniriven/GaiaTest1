import { Stack } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

const LikedPlaces = () => {
  return (
    <View>
      <Stack.Screen
        options={{
          headerTitle: "",
          headerTintColor: "black",
          headerBackTitle: "back",
        }}
      />
      <Text>Liked Places Screen</Text>
    </View>
  );
};

export default LikedPlaces;
