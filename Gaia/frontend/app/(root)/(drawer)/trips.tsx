import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function Trips() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>🏠 Home Screen (Inside Drawer)</Text>

      <TouchableOpacity
        onPress={() => router.push("/home")}
        className="pl-4 pr-2"
      >
        <AntDesign name="arrowleft" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
}
