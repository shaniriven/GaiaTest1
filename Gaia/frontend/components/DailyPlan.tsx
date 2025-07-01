import config from "@/config";
import { DailyPlanProps } from "@/types/declarations";
import { Activity } from "@/types/type";
import Feather from "@expo/vector-icons/Feather";
import axios from "axios";
import { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const DailyPlan = ({ daily_plan }: DailyPlanProps) => {
  const api_url = config.api_url;

  const [loading, setLoading] = useState(false);
  const [currentActivities, setCurrentActivities] = useState<Activity[]>();

  useEffect(() => {
    const fetchActivitiesImages = async (daily_plan_activities: Activity[]) => {
      try {
        setLoading(true);
        setCurrentActivities([]);
        const response = await axios.post(
          `${api_url}/plan/fetchActivitiesImages/`,
          { daily_plan_activities },
        );
        const { updatedActivities } = response.data;
        setCurrentActivities(updatedActivities);
        console.log("here");
      } catch (error) {
        console.error("error fetching user: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivitiesImages(daily_plan.activities);
  }, []);

  console.log("\ndaily_plan: ", daily_plan.activities, "\n");

  return (
    <ScrollView
      contentContainerStyle={{
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        margin: 16,
      }}
      style={{ height: "80%" }}
    >
      <Text className="text-black text-lg font-JakartaSemiBold m-2">
        {daily_plan.theme}
      </Text>
      {daily_plan.activities.map((activity, index) => (
        <View
          key={index}
          className="w-full items-start justify-start bg-white shadow-sm my-2 h-[100px] py-4 relative"
        >
          {/* activity card */}
          {/* Info Icon Button */}
          <TouchableOpacity
            className="absolute right-3 bottom-3 p-1.5"
            onPress={() => {
              // handle info press
            }}
          >
            <Feather name="info" size={22} color="black" />
          </TouchableOpacity>
          <Text className="text-black text-base font-JakartaExtraBold text-lg mx-4">
            {activity.title}
          </Text>
          <Image source={{ uri: `data:image/png;base64,${activity.image}` }} />
        </View>
      ))}
    </ScrollView>
  );
};

export default DailyPlan;
