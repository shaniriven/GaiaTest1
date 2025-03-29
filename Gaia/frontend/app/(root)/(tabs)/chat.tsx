/* eslint-disable prettier/prettier */
import ScreenHeader from "@/components/ScreenHeader";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Chat = () => {
  return (
    <SafeAreaView className="flex-1 bg-white ">
      <View className="flex-1">
        <ScreenHeader text="Chat" />
      </View>
    </SafeAreaView>
  );
};

export default Chat;
