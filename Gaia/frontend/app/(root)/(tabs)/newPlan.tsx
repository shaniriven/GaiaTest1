/* eslint-disable prettier/prettier */
import ScreenHeader from "@/components/ScreenHeader";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const newPlan = () => {
  return (
    <SafeAreaView className="flex-1 bg-white ">
      <View className="flex-1">
        <ScreenHeader text="New Plan" />
      </View>
    </SafeAreaView>
  );
};

export default newPlan;
