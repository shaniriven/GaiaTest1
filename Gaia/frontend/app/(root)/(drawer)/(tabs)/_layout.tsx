import ScreenHeader from "@/components/ScreenHeader";
import { useReset } from "@/contexts/ResetContext";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { DrawerToggleButton } from "@react-navigation/drawer";
import { Tabs, useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Modal, Platform, Text, TouchableOpacity, View } from "react-native";
import "react-native-get-random-values";

const validFontAwesomeIcons = [
  "home",
  "user",
  "plus",
  "search",
  "wechat",
  // add any other icon names you use here
] as const;

type FontAwesomeIconName = (typeof validFontAwesomeIcons)[number];

interface TabIconPropsFixed {
  source: FontAwesomeIconName;
  focused: boolean;
}

const TabIcon = ({ source, focused }: TabIconPropsFixed) => {
  const color = "#13875b";
  if (source === "plus") {
    return (
      <View className="flex flex-row justify-center items-center rounded-full">
        <View
          className={`w-14 h-14 rounded-full justify-center items-center mb-${
            Platform.OS === "android" ? "12" : "7"
          }`}
          style={{ backgroundColor: color }}
        >
          <FontAwesome name="plus" size={22} color="white" />
        </View>
      </View>
    );
  }

  return (
    <View className="rounded-full justify-center items-center top-2">
      {focused ? (
        <FontAwesome name={source} size={30} color={color} />
      ) : (
        <FontAwesome name={source} size={27} color="black" />
      )}
    </View>
  );
};

export default function Layout() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { triggerReset } = useReset();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  return (
    <View className="flex-1">
      <Tabs
        initialRouteName="home"
        screenOptions={{
          headerShown: true,
          headerLeft: () => <DrawerToggleButton tintColor="#000" />,
          tabBarActiveTintColor: "white",
          tabBarInactiveTintColor: "white",
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: "#D9D9D9",
            position: "absolute",
            bottom: 0,
            marginHorizontal: 0,
            height: 70,
            borderRadius: 0,
            shadowColor: "#000",
            shadowOpacity: 0.3,
            shadowOffset: {
              width: 0,
              height: 10,
            },
            shadowRadius: 5,
            paddingHorizontal: 10,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            headerShown: true,
            headerStyle: {
              height: 110,
            },
            headerTitle: () => <ScreenHeader text="Planned Trips" />,
            tabBarIcon: ({ focused }) => (
              <TabIcon source="home" focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="user"
          options={{
            headerShown: true,
            headerStyle: {
              height: 110,
            },
            headerTitle: () => <ScreenHeader text="Profile" />,
            tabBarIcon: ({ focused }) => (
              <TabIcon source="user" focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="newPlan"
          options={{
            headerShown: true,
            headerStyle: {
              height: 110,
            },
            headerTitle: () => <ScreenHeader text="New Trip" />,
            headerRight: () => (
              <TouchableOpacity
                onPress={() => setShowConfirmModal(true)}
                className="w-full flex-row justify-end items-end p-5"
              >
                <AntDesign name="delete" size={20} color="black" />
              </TouchableOpacity>
            ),
            tabBarIcon: ({ focused }) => (
              <TabIcon source="plus" focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            headerShown: true,
            headerStyle: {
              height: 110,
            },
            headerTitle: () => <ScreenHeader text="Search" />,
            tabBarIcon: ({ focused }) => (
              <TabIcon source="search" focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="chat"
          options={{
            headerShown: true,
            headerStyle: {
              height: 110,
            },
            headerTitle: () => <ScreenHeader text="Chat" />,
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => router.back()}
                className="pl-4 pr-2"
              >
                <AntDesign name="arrowleft" size={24} color="black" />
              </TouchableOpacity>
            ),
            tabBarIcon: ({ focused }) => (
              <TabIcon source="wechat" focused={focused} />
            ),
            tabBarStyle: {
              display: "none",
            },
          }}
        />
        <Tabs.Screen
          name="(plans)/[id]"
          options={{
            href: null,
            headerShown: true,
            headerStyle: {
              height: 110,
            },
            headerTitle: () => <ScreenHeader text="plan" />,
          }}
        />
        <Tabs.Screen
          name="(plans)/planModal"
          options={{
            href: null,
            headerShown: true,
            headerStyle: {
              height: 110,
            },
            headerTitle: () => <ScreenHeader text="plan" />,
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => router.back()}
                className="pl-4 pr-2"
              >
                <AntDesign name="arrowleft" size={24} color="black" />
              </TouchableOpacity>
            ),
          }}
        />
      </Tabs>
      {showConfirmModal && (
        <Modal
          transparent
          animationType="fade"
          visible={showConfirmModal}
          onRequestClose={() => setShowConfirmModal(false)}
        >
          <View className="flex-1 justify-center items-center bg-black/50">
            <View className="w-4/5 bg-white rounded-2xl items-center py-14 px-4">
              <Text className="text-xl font-JakartaSemiBold mb-4 text-center">
                Are you sure you want to delete your trip?
              </Text>
              <View className="flex-row gap-4 mt-4">
                <TouchableOpacity
                  onPress={() => setShowConfirmModal(false)}
                  className="px-4 py-2 bg-gray-200 rounded-xl"
                >
                  <Text className="text-black text-md font-JakartaSemiBold">
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    triggerReset();
                    setShowConfirmModal(false);
                  }}
                  className="px-4 py-2 bg-[#c64c4c] rounded-xl"
                >
                  <Text className="text-white text-black text-md font-JakartaSemiBold">
                    Delete
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}
