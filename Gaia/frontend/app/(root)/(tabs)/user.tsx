/* eslint-disable prettier/prettier */
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SignOutButton from "@/components/SignOutButton";
import ScreenHeader from "@/components/ScreenHeader";

const User = () => {
  return (
    <SafeAreaView className="flex-1 bg-white ">
      <View className="flex-1">
        <ScreenHeader text="User" />
        <SignOutButton/>
      </View>
    </SafeAreaView>
  );
};

export default User;
