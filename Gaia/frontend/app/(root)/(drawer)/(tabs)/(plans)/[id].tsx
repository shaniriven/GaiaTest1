import ScreenHeader from "@/components/ScreenHeader";
import Slider from "@/components/Slider/Slider";
import TabButton from "@/components/TabButton";
import config from "@/config";
import { AgentPlan, DayPlan } from "@/types/type";
import axios from "axios";
import { useLocalSearchParams, useNavigation, usePathname } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import { ActivityIndicator, Dimensions, View } from "react-native";

export default function PlanID() {
  const api_url = config.api_url;
  const { id, name } = useLocalSearchParams();
  const navigation = useNavigation();
  const pathname = usePathname();
  const { width } = Dimensions.get("screen");
  const ITEM_WIDTH = width;

  const buttonsLabels = ["plan", "transportation", "todo list"];

  const [activePlan, setActivePlan] = useState<AgentPlan>();
  const [datesList, setDatesList] = useState([]);
  const [generatedPlansList, setGeneratedPlansList] = useState<DayPlan[]>([]);

  const [activeButtonIndex, setActiveButtonIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  // Dynamically set the header by plan name
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: () => <ScreenHeader text={name as string} />,
      headerStyle: {
        height: 110,
      },
    });
  }, [pathname]);

  useEffect(() => {
    const fetchPlanData = async (plan_id: string) => {
      try {
        setLoading(true);
        setActivePlan(undefined);
        setDatesList([]);
        setGeneratedPlansList([]);
        const response = await axios.get(`${api_url}/plan/fetchPlanData/`, {
          params: { plan_id },
        });
        const { datesList, plan, generatedPlansList } = response.data;
        setActivePlan(plan as AgentPlan);
        setDatesList(datesList);
        setGeneratedPlansList(generatedPlansList);
      } catch (error) {
        console.error("error fetching user: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlanData(id as string);
  }, [pathname]);

  // temp data for dates label
  // const data = [
  //   { label: "day 1", value: "4.6" },
  //   { label: "day 2", value: "5.6" },
  //   { label: "day 3", value: "6.6" },
  //   { label: "day 4", value: "7.6" },
  // ];

  // render screen based on active button
  const renderScreen = () => {
    if (loading || !activePlan) {
      return (
        <View className="flex-1 justify-center items-center bg-white">
          <ActivityIndicator size="large" color="#13875B" />
          <ScreenHeader text={"creating your new trip"} />
        </View>
      );
    }
    switch (activeButtonIndex) {
      case 0:
        return (
          <View className="flex-1 justify-start items-center">
            <Slider
              datesLabelList={datesList}
              width={ITEM_WIDTH}
              plan={activePlan}
              generatedPlan={generatedPlansList}
            />
          </View>
        );
      case 1:
        return (
          <View className="flex-1 justify-center items-center bg-white">
            <ScreenHeader text="1" />
          </View>
        );
      case 2:
        return (
          <View className="flex-1 justify-center items-center bg-white">
            <ScreenHeader text="2" />
          </View>
        );
      case 3:
        return (
          <View className="flex-1 justify-center items-center bg-white">
            <ScreenHeader text="3" />
          </View>
        );
    }
  };

  return (
    <View className="flex-1 p-4 bg-white">
      <View className="flex flex-row flex-wrap gap-4 justify-between mb-5 mt-3 z-500">
        {/* Tab Buttons */}
        {buttonsLabels.map((screen, index) => (
          <TabButton
            key={index}
            title={screen}
            bgColor="bg-grayTab"
            textColor="text-primary"
            onPress={() => {
              setActiveButtonIndex(index);
            }}
            isActive={activeButtonIndex === index}
          />
        ))}
      </View>
      {renderScreen()}
    </View>
  );
}
