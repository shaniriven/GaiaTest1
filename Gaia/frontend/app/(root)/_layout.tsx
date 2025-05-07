import React, { useState } from "react";
import { Stack } from "expo-router";
import { Modal, View, Text, Button, StyleSheet } from "react-native";
import axios from "axios";
import config from "../../config";
import { useUser } from "@clerk/clerk-expo";
const api_url = config.api_url;

const Layout = () => {
  const [isConfirmationModalVisible, setConfirmationModalVisible] =
    useState(false);
  const { user } = useUser();

  const handleModalClose = () => {
    setConfirmationModalVisible(true);
  };

  const handleSave = () => {
    setConfirmationModalVisible(false);
  };

  const handleDelete = async () => {
    try {
      const response = await axios.post(`${api_url}/trip/delete/`, {
        user_id: user?.id,
      });
      console.log(response.data);
    } catch (error) {
      console.error(`Error deleting ${user?.id}`, error);
    }
    console.log("Instance deleted from the database");
    setConfirmationModalVisible(false);
  };

  return (
    <>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="(modals)/newPlan"
          options={{
            headerShown: false,
            presentation: "modal",
            animation: "slide_from_bottom",
            animationDuration: 1200,
          }}
          listeners={{
            // Trigger when the modal is closed
            beforeRemove: handleModalClose,
          }}
        />
      </Stack>

      {/* Confirmation Modal */}
      {isConfirmationModalVisible && (
        <Modal
          transparent={true}
          animationType="fade"
          visible={isConfirmationModalVisible}
          onRequestClose={() => setConfirmationModalVisible(false)}
        >
          <View className="flex-1 justify-center items-center bg-black/50">
            <View className="w-72 p-5 bg-white rounded-lg items-center">
              <Text className="text-lg font-semibold mb-4">
                Do you want to save or delete?
              </Text>
              <View className="flex-row justify-between w-full">
                <Button title="Save" onPress={handleSave} />
                <Button title="Delete" onPress={handleDelete} color="red" />
              </View>
            </View>
          </View>
        </Modal>
      )}
    </>
  );
};

export default Layout;
