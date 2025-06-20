import { View, Text, Button } from "react-native";
import { DrawerActions, useNavigation } from "@react-navigation/native";

export default function Trips() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>🏠 Home Screen (Inside Drawer)</Text>
    </View>
  );
}
