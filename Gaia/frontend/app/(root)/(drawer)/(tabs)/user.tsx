import { useAuth } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

import CustomButton from "@/components/CustomButton";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
const User = () => {
  const router = useRouter();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace("/sign-in");
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };

  return (
    <View className="flex-1 bg-white p-6">
      <View className="flex-row flex-wrap justify-between gap-y-5">
        <Link href="/settings" asChild>
          <CustomButton
            title={"Settings"}
            IconLeft={<AntDesign name="setting" size={24} color="white" />}
            className="w-[48%] flex-row items-center rounded-[10px] h-[80px]"
          />
        </Link>

        

        <Link href="/documents" asChild>
          <CustomButton
            title={"Documents"}
            IconLeft={
              <Ionicons name="documents-outline" size={24} color="white" />
            }
            className="w-[48%] flex-row items-center rounded-[10px] h-[80px]"
          />
        </Link>

        <Link href="/savedChats" asChild>
          <CustomButton
            title={"Saved Chats"}
            IconLeft={
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={24}
                color="white"
              />
            }
            className="w-[48%] flex-row items-center rounded-[10px] h-[80px]"
          />
        </Link>

        <Link href="/contactUs" asChild>
          <CustomButton
            title={"Contact Us"}
            IconLeft={<AntDesign name="phone" size={24} color="white" />}
            className="w-[48%] flex-row items-center rounded-[10px] h-[80px]"
          />
        </Link>

        <Link href="/todoLists" asChild>
          <CustomButton
            title={"To Do Lists"}
            IconLeft={
              <MaterialCommunityIcons
                name="clipboard-list-outline"
                size={24}
                color="white"
              />
            }
            className="w-[48%] flex-row items-center rounded-[10px] h-[80px]"
          />
        </Link>
        <View className="w-full rounded-[10px] items-center">
          <CustomButton
            title={"Sign Out"}
            className="w-[130px] mt-10 mb-10 border border-gray-400"
            bgVariant="gray-vibe"
            textVariant="primary"
            onPress={handleSignOut}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  header: {
    fontSize: 30,
    fontWeight: "600",
    textAlign: "left",
  },
  buttonGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  button: {
    width: "47%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#49735A",
    paddingVertical: 30,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 35,
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: 10,
    resizeMode: "contain",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  signOutWrapper: {
    width: "100%",
    backgroundColor: "#D32F2F",
    paddingVertical: 20,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  signOutText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default User;
