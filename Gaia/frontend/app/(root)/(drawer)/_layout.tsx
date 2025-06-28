import ScreenHeader from "@/components/ScreenHeader";
import config from "@/config";
import { useUser } from "@clerk/clerk-expo";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import axios from "axios";
import { router } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { useEffect, useState } from "react";

import type { DrawerContentComponentProps } from "@react-navigation/drawer";

type PlanLabel = { _id: string; name: string };

const DrawerMenu = (props: DrawerContentComponentProps) => {
  const [plansLabels, setPlansLabels] = useState<PlanLabel[]>([]);
  const { user } = useUser();
  const user_id = user?.id || "1";

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
  }, []);

  return (
    <DrawerContentScrollView {...props}>
      {plansLabels.map((item, index) => (
        <DrawerItem
          key={index}
          label={item.name}
          onPress={() => router.push(`/(plans)/${item._id}?name=${item.name}`)}
        />
      ))}
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
