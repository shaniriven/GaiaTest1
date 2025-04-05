/* eslint-disable prettier/prettier */
import GooglePlacesInput from "@/components/GooglePlaceInput";
import ScreenHeader from "@/components/ScreenHeader";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Chat = () => {
  return (
    <SafeAreaView className="flex-1 bg-white ">
      <View className="flex-1">
        <ScreenHeader text="Chat" />
        <Text>dfdf</Text>
        <GooglePlacesInput/>
      </View>
    </SafeAreaView>
  );
};

export default Chat;
