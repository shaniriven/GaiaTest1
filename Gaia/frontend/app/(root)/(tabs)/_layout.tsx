/* eslint-disable prettier/prettier */
import { router, Tabs } from "expo-router";
import { Platform, TouchableOpacity, View, } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { TabIconProps } from "@/declarations";

const TabIcon = ({ source, focused }: TabIconProps) => {
  const color = "#13875b";
  if (source === "plus") {
    return (
      <TouchableOpacity onPress={() => router.push("/(root)/(modals)/newPlan")}>
        <View className={`flex flex-row justify-center items-center rounded-full`}>
          <View className={`w-14 h-14 bg-[${color}] rounded-full justify-center items-center mb-${Platform.OS === "android" ? "12" : "7"}`}>
            <FontAwesome name="plus" size={22} color="white" />
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
      <View className="rounded-full justify-center items-center top-2">
        {focused
          ? (<FontAwesome name={source} size={30} color={color} />)
          : (<FontAwesome name={source} size={27} color="black" />)}
      </View>
  );
};


export default function Layout() {
  return (
    <View className="flex-1">
      <Tabs
        initialRouteName="home"
        screenOptions={{
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
        <Tabs.Screen name="home"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ focused }) => (<TabIcon source="home" focused={focused} />),
          }}
        />
        <Tabs.Screen name="user"
          options={{
            title: "User",
            headerShown: false,
            tabBarIcon: ({ focused }) => (<TabIcon source="user" focused={focused} />),
          }}
        />
        <Tabs.Screen name="newPlan"
          options={{
            title: "New Plan",
            headerShown: false,
            tabBarIcon: ({ focused }) => (<TabIcon source="plus" focused={focused} />),
          }}
        />
        <Tabs.Screen name="search"
          options={{
            title: "Search",
            headerShown: false,
            tabBarIcon: ({ focused }) => (<TabIcon source="search" focused={focused} />),
          }}
        />
        <Tabs.Screen name="chat"
          options={{
            title: "Chat",
            headerShown: false, tabBarIcon: ({ focused }) => (<TabIcon source="wechat" focused={focused} />),
          }}
        />
      </Tabs>
    </View>
  );
}
