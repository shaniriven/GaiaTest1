/* eslint-disable prettier/prettier */
import { Tabs } from "expo-router";
import { Animated, Platform, TouchableOpacity, View, } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";                  
import { useRef } from "react";

const TabIcon = ({ source, focused }) => {
  const color = "#13875b";
  if (source === "plus") {
    return (
      <TouchableOpacity>
        <View className={`flex flex-row justify-center items-center rounded-full`}>
          <View className={`w-14 h-14 bg-[${color}] rounded-full justify-center items-center mb-${Platform.OS === "android" ? "12" : "7"}`}>
            <FontAwesome name="plus" size={22} color="white" />
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View className={`flex flex-row justify-center items-center rounded-full`}>
        <View className={`rounded-full mt-5 w-12 h-12 items-center justify-center`}>
            {focused
            ? ( <FontAwesome name={source} size={27} color={color} /> ) 
            : ( <FontAwesome name={source} size={25} color="black" /> )}
        </View>
    </View>
  );
};

export default function Layout() {
    
    return (
      <View className="flex-1 bg-gray-200">
        <Tabs
          initialRouteName="home"
          screenOptions={{
            tabBarActiveTintColor: "white",
            tabBarInactiveTintColor: "white",
            tabBarShowLabel: false,
            tabBarStyle: {
              backgroundColor: "#D9D9D9",
              position: "absolute",
              bottom: 40,
              marginHorizontal: 20,
              height: 60,
              borderRadius: 10,
              shadowColor: "#000",
              shadowOpacity: 0.2,
              shadowOffset: {
                width: 10,
                height: 10,
              },
              paddingHorizontal: 20,
            },
          }}
        >
          <Tabs.Screen name="home"
            options={{
              title: "Home",
              headerShown: false,
              tabBarIcon: ({ focused }) => ( <TabIcon source="home" focused={focused} /> ),
            }}
          />
          <Tabs.Screen name="user"
            options={{
              title: "User",
              headerShown: false,
              tabBarIcon: ({ focused }) => ( <TabIcon source="user" focused={focused} /> ),
            }}
          />
          <Tabs.Screen name="newPlan"
            options={{
              title: "New Plan",
              headerShown: false,
              tabBarIcon: ({ focused }) => ( <TabIcon source="plus" focused={focused} /> ),
            }}
          />
          <Tabs.Screen name="search"
            options={{
              title: "Search",
              headerShown: false,
              tabBarIcon: ({ focused }) => ( <TabIcon source="search" focused={focused} /> ),
            }}
          />
          <Tabs.Screen name="chat"
            options={{
              title: "Chat",
              headerShown: false, tabBarIcon: ({ focused }) => ( <TabIcon source="wechat" focused={focused} /> ),
            }}
          />
        </Tabs>
      </View>
    );
  }
  