import { PaginationProps } from "@/types/declarations";
import { DayPlan } from "@/types/type";
import { useState } from "react";
import { View } from "react-native";
import DailyPlan from "../DailyPlan";

const PaginationAndContent = ({
  datesItems: items,
  paginationIndex,
  scrollX,
  width,
  plan,
  generatedPlan,
}: PaginationProps) => {
  // console.log("\nPaginationAndContent: plan id", plan?.id, "\n");

  const [itinerary, setItinerary] = useState<DayPlan[]>(generatedPlan);
  // console.log("\nPaginationAndContent itinerary:", itinerary, "\n");
  return (
    <View className="flex-1">
      <View
        className="flex flex-row  justify-center items-center h-[20px]"
        style={{ width: width }}
      >
        {/* pagination dots  */}
        {/* {Object.values(itinerary).map((_, index) => {  */}
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
      <View className="mt-2">
        {/* content */}
        {items[paginationIndex]?.day && (
          <DailyPlan
            daily_plan={itinerary[paginationIndex]}
            item={plan?.id || "unable to load plan id"}
          />
        )}
      </View>
    </View>
  );
};

export default PaginationAndContent;
