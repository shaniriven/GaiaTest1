import ScreenHeader from "@/components/ScreenHeader";
import { AntDesign } from "@expo/vector-icons";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useLayoutEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function PlanID() {
  const { id, name } = useLocalSearchParams();
  const navigation = useNavigation();

  // Dynamically set the header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: () => <ScreenHeader text={name as string} />,
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-4">
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
      ),
      headerStyle: {
        height: 110,
      },
    });
  }, [navigation, id]);

  return (
    <View className="flex-1 p-4 bg-white">
      <View className="flex-row flex-wrap justify-center">
        <Text className="text-xl">Plan ID: {id}</Text>
      </View>
    </View>
  );
}
