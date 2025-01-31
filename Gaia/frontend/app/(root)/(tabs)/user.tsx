/* eslint-disable prettier/prettier */
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import  SignOutButton  from "@/components/SignOutButton";

const User = () => {
  return (
    <SafeAreaView>
      <Text>User</Text>
      <SignOutButton></SignOutButton>
    </SafeAreaView>
  );
};

export default User;
