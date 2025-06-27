import ScreenHeader from "@/components/ScreenHeader";
import { TabIconProps } from "@/types/declarations";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { DrawerToggleButton } from "@react-navigation/drawer";
import { router, Tabs } from "expo-router";
import { Platform, TouchableOpacity, View } from "react-native";
import "react-native-get-random-values";

const TabIcon = ({ source, focused }: TabIconProps) => {
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
            bottom: 42,
            marginHorizontal: 15,
            height: 55,
            borderRadius: 5,
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
                onPress={() => {
                  // Your action here
                  console.log("location delete button press");
                }}
                className="w-full flex-row justify-end items-end p-5"
              >
                <AntDesign
                  name="delete"
                  size={20}
                  color="black"
                  className="mr-1"
                />
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
          name="planModal"
          options={{
            href: null,
            headerShown: true,
            headerStyle: {
              height: 110,
            },
            headerTitle: () => <ScreenHeader text="planModal" />,
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
      </Tabs>
    </View>
  );
}
