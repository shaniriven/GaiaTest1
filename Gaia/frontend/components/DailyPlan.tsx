import { DailyPlanProps } from "@/types/declarations";
import Feather from "@expo/vector-icons/Feather";
import { Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const DailyPlan = ({ daily_plan }: DailyPlanProps) => {
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
        </View>
      ))}
    </ScrollView>
  );
};

export default DailyPlan;
