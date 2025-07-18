import { SectionProps } from "@/types/declarations";
import { BudgetOptions } from "@/types/type";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import BouncyCheckboxClassic from "../BouncyCheckboxClassic";
import BudgetPicker from "../BudgetPicker";

const Budget = ({
  budgetOptions = { includeMeals: true, range: [1000, 2000] },
  onOptionsChange,
}: SectionProps) => {
  const [tempOptions, setTempOptions] = useState<BudgetOptions>({
    includeMeals: budgetOptions.includeMeals,
    range: budgetOptions.range,
  });

  const setRange = (newRange: [number, number]) => {
    setTempOptions((prev) => ({
      ...prev,
      range: newRange,
    }));
  };

  useEffect(() => {
    onOptionsChange(tempOptions);
  }, [tempOptions]);

  return (
    <View className="flex flex-col gap-4 items-center mb-1">
      <Text className="text-lg font-JakartaMedium text-white self-start">
        set a budget for your trip
      </Text>

      <BouncyCheckboxClassic
        size={20}
        fillColor="white"
        unFillColor="transparent"
        iconStyle={{ borderColor: "#13875b" }}
        innerIconStyle={{ backgroundColor: "#13875b" }}
        textStyle={{
          fontFamily: tempOptions.includeMeals
            ? "Jakarta-SemiBold"
            : "Jakarta-Light",
          textDecorationLine: "none",
          fontSize: 18,
          color: "white",
        }}
        label="include  meals in budget"
        state={tempOptions.includeMeals}
        setState={(value: boolean) => {
          setTempOptions((prev) => ({ ...prev, includeMeals: value }));
        }}
      />
      <View className="mb-0">
        <BudgetPicker range={tempOptions.range} onRangeChange={setRange} />
      </View>
    </View>
  );
};

export default Budget;
