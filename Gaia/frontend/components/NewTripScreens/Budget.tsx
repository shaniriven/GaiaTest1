import { SectionProps } from "@/types/declarations";
import { View } from "react-native";
import { useEffect, useState } from "react";
import BouncyCheckboxClassic from "../BouncyCheckboxClassic";
import BudgetPicker from "../BudgetPicker";
import { BudgetOptions } from "@/types/type";

const Budget = ({ budgetOptions, onOptionsChange }: SectionProps) => {
  const [tempOptions, setTempOptions] = useState<BudgetOptions>({
    budgetPerNight: budgetOptions.budgetPerNight,
    includeMeals: budgetOptions.includeMeals,
    budgetPerPerson: budgetOptions.budgetPerPerson,
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
    <View className="flex flex-col gap-4 items-center">
      <BouncyCheckboxClassic
        size={20}
        fillColor="white"
        unFillColor="transparent"
        iconStyle={{ borderColor: "#13875b" }}
        innerIconStyle={{ backgroundColor: "#13875b" }}
        textStyle={{
          fontFamily: tempOptions.budgetPerNight
            ? "Jakarta-SemiBold"
            : "Jakarta-Light",
          textDecorationLine: "none",
          fontSize: 18,
          color: "white",
        }}
        label="set budget per night"
        state={tempOptions.budgetPerNight}
        setState={(value: boolean) => {
          setTempOptions((prev) => ({ ...prev, budgetPerNight: value }));
        }}
      />
      <BouncyCheckboxClassic
        size={20}
        fillColor="white"
        unFillColor="transparent"
        iconStyle={{ borderColor: "#13875b" }}
        innerIconStyle={{ backgroundColor: "#13875b" }}
        textStyle={{
          fontFamily: tempOptions.budgetPerPerson
            ? "Jakarta-SemiBold"
            : "Jakarta-Light",
          textDecorationLine: "none",
          fontSize: 18,
          color: "white",
        }}
        label="set budget per person"
        state={tempOptions.budgetPerPerson}
        setState={(value: boolean) => {
          setTempOptions((prev) => ({ ...prev, budgetPerPerson: value }));
        }}
      />
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
