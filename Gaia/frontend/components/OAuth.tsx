// social authentication
import { View, Text, Image } from "react-native";
import CustomButton from "./CustomButton";
import { icons } from "@/constants";

const OAuth = () => (
  <View>
    <View className="flex flex-row justify-center mt-4 gap-x-3">
      <View className="flex-1 h-[1px] bg-general-100 mt-3" />
      <Text className="text-lg">Or</Text>
      <View className="flex-1 h-[1px] bg-general-100 mt-3" />
    </View>

    <CustomButton
        title="Log In with Google"
        bgVariant="outline"
        textVariant="primary"
        className="mt-2 w-full shadow-none mt-3 border-neutral-400"
        IconLeft={ () => (
            <Image source={icons.google} resizeMode="contain" className="w-5 h-5 mx-2"/>
        )}
    />
  </View>
);

export default OAuth;
