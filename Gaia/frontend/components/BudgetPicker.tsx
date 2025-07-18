// using
import { BudgetRange } from "@/types/type";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import React, { useState } from "react";
import { Text, View } from "react-native";

export default function BudgetPicker({
  range = [1000, 2000],
  onRangeChange,
}: BudgetRange) {
  const [budget, setBudget] = useState(range);

  const handleRangeChange = (values: number[]) => {
    const newRange: number[] = [values[0], values[1]];
    setBudget(newRange);
    onRangeChange?.(newRange);
  };
  return (
    <View className="w-full items-center">
      {/* Bubble Display */}
      <View className="my-2 bg-[white] px-5 py-2 rounded-full shadow">
        <Text className="text-black font-Jakarta-SemiBold">
          ${budget[0]} - ${budget[1]}
        </Text>
      </View>

      {/* MultiSlider */}
      <MultiSlider
        values={budget}
        min={100}
        max={6000}
        step={100}
        sliderLength={200}
        onValuesChange={handleRangeChange}
        selectedStyle={{ backgroundColor: "#d3d3d3" }}
        unselectedStyle={{ backgroundColor: "#777777" }}
        markerStyle={{
          backgroundColor: "#fff",
          borderColor: "#3e5c4d",
          borderWidth: 2,
          height: 24,
          width: 24,
        }}
        pressedMarkerStyle={{
          backgroundColor: "#3e5c4d",
        }}
      />
    </View>
  );
}
