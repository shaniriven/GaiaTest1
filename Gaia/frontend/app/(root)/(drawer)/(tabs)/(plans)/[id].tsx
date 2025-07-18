import InputField from "@/components/InputField";
import ScreenHeader from "@/components/ScreenHeader";
import Slider from "@/components/Slider/Slider";
import TabButton from "@/components/TabButton";
import config from "@/config";
import { AgentPlan, DayPlan } from "@/types/type";
import axios from "axios";
import { useLocalSearchParams, useNavigation, usePathname } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import { ActivityIndicator, Dimensions, Text, View } from "react-native";

export default function PlanID() {
  const api_url = config.api_url;
  const { id, name, pickedName } = useLocalSearchParams();
  const navigation = useNavigation();
  const pathname = usePathname();
  const { width } = Dimensions.get("screen");
  const ITEM_WIDTH = width;

  // const buttonsLabels = ["plan", "transportation", "todo list"];

  const [activePlan, setActivePlan] = useState<AgentPlan>();
  const [datesList, setDatesList] = useState([]);
  const [generatedPlansList, setGeneratedPlansList] = useState<DayPlan[]>([]);

  const [activeButtonIndex, setActiveButtonIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const [tripName, setTripName] = useState(name);
  const [finishedPickingName, setFinishedPickingName] = useState(
    pickedName === "true",
  );

  // Dynamically set the header by plan name
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: () => <ScreenHeader text={tripName as string} />,
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
        const planData = {
          ...plan,
        } as AgentPlan;
        const imageResponse = await axios.post(
          `${api_url}/plan/fetchPlanImages/`,
          { agent_plan: planData.id },
        );
        if (imageResponse) {
          setActivePlan(planData);
          setDatesList(datesList);
          setGeneratedPlansList(generatedPlansList);
        }
      } catch (error) {
        console.error("error fetching user: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlanData(id as string);
    // fetchImage();
  }, [pathname]);

  return !finishedPickingName ? (
    <View className="flex mx-7 mt-3 items-center justify-center">
      {/* choose name screen */}
      <Text className="text-xl font-JakartaSemiBold text-center">
        Enter a name for your trip
      </Text>
      <Text className="mt-2 mx-1 text-xl font-JakartaLight text-center">
        You can add it later or edit it in the trip settings
      </Text>
      <InputField
        placeholder={"Girl's in Paris"}
        onChangeText={(text: string) => {
          setTripName(text);
        }}
        value={tripName as string}
        className="w-[300px]"
      />
      <View className="flex flex-row flex-wrap gap-5  mb-5 mt-7 w-[270px] z-500">
        <TabButton
          key={1}
          title={"choose for me"}
          bgColor="bg-grayTab"
          textColor="text-primary"
          isActive={false}
          onPress={async () => {
            setFinishedPickingName(true);
            const response = await axios.post(`${api_url}/plan/changeName/`, {
              tripName,
              id,
            });
            if (response.status === 200) {
              console.log("Name changed successfully");
            } else {
              console.error("Failed to change name");
            }
          }}
        />
        <TabButton
          key={2}
          title={"save"}
          bgColor="bg-grayTab"
          textColor="text-primary"
          onPress={() => {
            setFinishedPickingName(true);
          }}
          isActive={false}
        />
      </View>
    </View>
  ) : loading || !activePlan ? (
    <View className="flex-1 justify-center items-center bg-white">
      <ActivityIndicator size="large" color="#13875B" />
      <View className="flex flex-row items-center justify-between mt-2">
        <Text className="text-2xl font-JakartaMedium">loading your trip</Text>
      </View>
    </View>
  ) : (
    <View className="flex-1 p-4 bg-white">
      <View className="flex-1 justify-start items-center">
        <Slider
          datesLabelList={datesList}
          width={ITEM_WIDTH}
          plan={activePlan}
          generatedPlan={generatedPlansList}
        />
      </View>
    </View>
  );

  /* <ActivityIndicator size="large" color="#13875B" />
      <View className="flex flex-row items-center justify-between mt-2">
        <Text className="text-2xl font-JakartaMedium">loading your trip</Text>
      </View> */

  // return loading || !activePlan ? (
  //   <View className="flex-1 justify-center items-center bg-white">
  //     <View className="flex  mt-3 items-center justify-center">
  //       {/* choose name screen */}
  //       <Text className="text-xl font-JakartaSemiBold text-center">
  //         Enter a name for your trip
  //       </Text>
  //       <Text className="mt-2 mx-1 text-xl font-JakartaLight text-center">
  //         You can add it later or edit it in the trip settings
  //       </Text>
  //       <InputField
  //         placeholder="Girl's in Paris"
  //         onChangeText={(text: string) => setTripName(text)}
  //         value={tripName}
  //         className="w-[300px]"
  //       />
  //       <View className="flex flex-row flex-wrap gap-5 justify-between mb-5 mt-7 w-[260px] z-500">
  //         <TabButton
  //           key={1}
  //           title={"choose for me"}
  //           bgColor="bg-grayTab"
  //           textColor="text-primary"
  //           onPress={() => {}}
  //           isActive={false}
  //         />
  //         <TabButton
  //           key={2}
  //           title={"save"}
  //           bgColor="bg-grayTab"
  //           textColor="text-primary"
  //           onPress={() => {}}
  //           isActive={false}
  //         />
  //       </View>
  //     </View>
  //     {/* <ActivityIndicator size="large" color="#13875B" />
  //     <View className="flex flex-row items-center justify-between mt-2">
  //       <Text className="text-2xl font-JakartaMedium">loading your trip</Text>
  //     </View> */}
  //   </View>
  // ) : (
  //   <View className="flex-1 p-4 bg-white">
  //     <View className="flex-1 justify-start items-center">
  //       <Slider
  //         datesLabelList={datesList}
  //         width={ITEM_WIDTH}
  //         plan={activePlan}
  //         generatedPlan={generatedPlansList}
  //       />
  //     </View>
  //   </View>
  // );
}

{
  /* <View className="flex flex-row flex-wrap gap-4 justify-between mb-5 mt-3 z-500">
        {/* Tab Buttons */
}
{
  /* {buttonsLabels.map((screen, index) => (
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
        ))} */
}
{
  /* </View> */
}
