import ScreenHeader from "@/components/ScreenHeader";
import config from "@/config";
import { useUser } from "@clerk/clerk-expo";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import axios from "axios";
import { router, usePathname } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { useEffect, useState } from "react";

import type { DrawerContentComponentProps } from "@react-navigation/drawer";
import { Text, View } from "react-native";

type PlanLabel = {
  _id: string;
  name: string;
  formmated_date: string;
  is_past: boolean;
};

const DrawerMenu = (props: DrawerContentComponentProps) => {
  const [plansLabels, setPlansLabels] = useState<PlanLabel[]>([]);
  const { user } = useUser();
  const user_id = user?.id || "1";
  const pathname = usePathname();

  // useEffect(() => {
  //   console.log(pathname);
  // }, [pathname]);

  // fetch data when path changes
  useEffect(() => {
    const fetchPlansLabels = async () => {
      try {
        const response = await axios.get(
          `${config.api_url}/home/fetchPlansLabels/`,
          {
            params: { user_id },
          },
        );
        setPlansLabels(response.data);
      } catch (error) {
        console.error("error fetching plans:", error);
      }
    };

    fetchPlansLabels();
  }, [pathname]);

  return (
    <DrawerContentScrollView {...props}>
      <View className="m-3">
        <Text className="text-2xl font-JakartaSemiBold">Planned Trips</Text>
      </View>
      {plansLabels
        .filter((item) => item.is_past === false)
        .map((item, index) => {
          const isActive = pathname.includes(item._id);
          return (
            <DrawerItem
              key={index}
              label={item.name}
              labelStyle={{
                marginLeft: 2,
                fontFamily: isActive ? "Jakarta-Bold" : "Jakarta-Medium",
                fontSize: isActive ? 18 : 16,
                padding: 2,
                color: isActive ? "#333" : "#000",
              }}
              style={{
                backgroundColor: isActive ? "#f3f3f3" : "transparent",
                borderRadius: 8,
                marginHorizontal: 8,
                shadowColor: isActive ? "#000" : "transparent",
                shadowOpacity: isActive ? 0.1 : 0,
                shadowOffset: { width: 0, height: 2 },
                shadowRadius: 4,
                elevation: isActive ? 2 : 0, // for Android shadow
              }}
              onPress={() =>
                router.push(`/(plans)/${item._id}?name=${item.name}`)
              }
              icon={({ color, size }) => (
                <FontAwesome6
                  name="plane"
                  size={16}
                  color={isActive ? "#13875B" : "gray"}
                />
              )}
            />
          );
        })}
      <View className="ml-5 mt-10">
        <Text className="text-2xl font-JakartaSemiBold mt-5">Past Trips</Text>
      </View>
      {plansLabels
        .filter((item) => item.is_past === true)
        .map((item, index) => {
          const isActive = pathname.includes(item._id);
          return (
            <DrawerItem
              key={index}
              label={item.name}
              labelStyle={{
                marginLeft: 2,
                fontFamily: isActive ? "Jakarta-Bold" : "Jakarta-Medium",
                fontSize: isActive ? 18 : 16,
                padding: 2,
                color: isActive ? "#333" : "#000",
              }}
              style={{
                backgroundColor: isActive ? "#f3f3f3" : "transparent",
                borderRadius: 8,
                marginHorizontal: 8,
                shadowColor: isActive ? "#000" : "transparent",
                shadowOpacity: isActive ? 0.1 : 0,
                shadowOffset: { width: 0, height: 2 },
                shadowRadius: 4,
                elevation: isActive ? 2 : 0, // for Android shadow
              }}
              onPress={() =>
                router.push(
                  `/(plans)/${item._id}?name=${item.name}&pickedName=ture`,
                )
              }
              icon={({ color, size }) => (
                <FontAwesome6
                  name="plane"
                  size={16}
                  color={isActive ? "#13875B" : "gray"}
                />
              )}
            />
          );
        })}
    </DrawerContentScrollView>
  );
};

export default function Layout() {
  return (
    <Drawer
      screenOptions={{ headerShown: false }}
      drawerContent={(props) => <DrawerMenu {...props} />}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{
          drawerItemStyle: { display: "flex" },
          headerTitle: () => <ScreenHeader text="plan" />,
        }}
      />
    </Drawer>
  );
}
