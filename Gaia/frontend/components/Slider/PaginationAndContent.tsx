import { PaginationProps } from "@/types/declarations";
import { DayPlan } from "@/types/type";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState } from "react";
import { Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import DailyPlan from "../DailyPlan";
import ScreenHeader from "../ScreenHeader";
import TabButton from "../TabButton";
const PaginationAndContent = ({
  datesItems: items,
  paginationIndex,
  scrollX,
  width,
  plan,
  generatedPlan,
}: PaginationProps) => {
  // console.log("\nPaginationAndContent: plan id", plan?.id, "\n");
  const buttonsLabels = ["plan", "information", "todo list"];
  const [activeButtonIndex, setActiveButtonIndex] = useState(0);
  const [itinerary, setItinerary] = useState<DayPlan[]>(generatedPlan);

  // render screen based on active button
  const renderScreen = () => {
    switch (activeButtonIndex) {
      case 0:
        // plan screen
        return (
          <View className="mt-2">
            {items[paginationIndex]?.day && (
              <DailyPlan
                daily_plan={itinerary[paginationIndex]}
                item={plan?.id || "unable to load plan id"}
              />
            )}
          </View>
        );
      case 1:
        // information screen

        return (
          <ScrollView className="flex px-5 py-5 h-full">
            {items[paginationIndex]?.day && (
              <View className="justify-start items-center gap-6">
                <View className="items-start justify-center bg-gray-100 shadow-md rounded-2xl px-3 py-3 w-full">
                  {/* transportation */}
                  <View className="flex flex-row items-center">
                    <MaterialIcons
                      name="emoji-transportation"
                      size={24}
                      color="black"
                    />
                    <Text className="text-black text-xl font-JakartaSemiBold m-1 pl-1">
                      Transportation
                    </Text>
                  </View>
                  <Text className="text-black text-lg font-Jakarta m-1">
                    {itinerary[paginationIndex].transportation}
                  </Text>
                </View>
                {/* <View className="items-start justify-center bg-gray-100 shadow-md rounded-2xl px-3 py-3 w-full"> */}
                {/* accommodation */}
                {/* <View className="flex flex-row items-center">
                    <MaterialIcons name="hotel" size={24} color="black" />
                    <Text className="text-black text-xl font-JakartaSemiBold m-1 pl-1">
                      Accommodation
                    </Text>
                  </View> */}

                {paginationIndex !== itinerary.length - 1 && (
                  <View className="items-start justify-center bg-gray-100 shadow-md rounded-2xl px-3 py-3 w-full">
                    <View className="flex flex-row items-center">
                      <MaterialIcons name="hotel" size={24} color="black" />
                      <Text className="text-black text-xl font-JakartaSemiBold m-1 pl-1">
                        Accommodation
                      </Text>
                    </View>
                    <Text className="text-black text-lg font-Jakarta m-1">
                      {itinerary[paginationIndex].accommodation}
                    </Text>
                  </View>
                )}

                {/* </View> */}
              </View>
            )}
          </ScrollView>
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
    <View className="flex-1">
      <View
        className="flex flex-row  justify-center items-center h-[20px]"
        style={{ width: width }}
      >
        {/* pagination dots  */}
        {itinerary.map((_, index) => {
          return (
            <View
              key={index}
              className="h-[8px] w-[8px] mx-1 rounded-full"
              style={{
                backgroundColor: paginationIndex === index ? "#222" : "#aaa",
              }}
            />
          );
        })}
      </View>

      <View className="flex flex-row flex-wrap gap-5 justify-between mb-5 mt-5 mx-5 z-500">
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
      <View className="mt-2 mx-2">{renderScreen()}</View>
    </View>
  );
};

export default PaginationAndContent;
