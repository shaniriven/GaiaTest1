import {
  accommodationLabels,
  activitiesLabels,
  defaultDetailsCheckboxes,
} from "@/constants/index";
import { SectionProps } from "@/types/declarations";
import { DetailsCheckboxes } from "@/types/type";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import BouncyCheckboxClassic from "../BouncyCheckboxClassic";

const DetailsContent = ({
  onOptionsChange,
  detailsOptions = defaultDetailsCheckboxes,
}: SectionProps) => {
  const [detailsCheckboxes, setDetailsCheckboxes] =
    useState<DetailsCheckboxes>(detailsOptions);

  const toggleCheckbox = (key: keyof DetailsCheckboxes) => {
    setDetailsCheckboxes((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  useEffect(() => {
    onOptionsChange(detailsCheckboxes);
  }, [detailsCheckboxes]);

  return (
    <View className="flex flex-col  items-center mb-10">
      <View className="flex-row justify-between">
        {/* accomodation checkboxes */}
        <View className="flex-1  mr-2 gap-1">
          <Text className="text-white font-JakartaSemiBold mb-1 text-xl">
            accommodation
          </Text>
          {accommodationLabels.map((item) => (
            <BouncyCheckboxClassic
              key={item.key}
              size={16}
              fillColor="white"
              unFillColor="transparent"
              iconStyle={{ borderColor: "#13875b" }}
              innerIconStyle={{ backgroundColor: "#13875b" }}
              textStyle={{
                fontFamily: detailsCheckboxes[item.key]
                  ? "Jakarta-SemiBold"
                  : "Jakarta-Light",
                textDecorationLine: "none",
                fontSize: 16,
                color: "white",
              }}
              label={item.label}
              state={detailsCheckboxes[item.key]}
              setState={() => toggleCheckbox(item.key)}
            />
          ))}
        </View>

        {/* activities checkboxes */}
        <View className="flex-1 mr-2 gap-1">
          <Text className="text-white font-JakartaSemiBold mb-1 text-xl">
            activities
          </Text>
          {activitiesLabels.map((item) => (
            <BouncyCheckboxClassic
              key={item.key}
              size={16}
              fillColor="white"
              unFillColor="transparent"
              iconStyle={{ borderColor: "#13875b" }}
              innerIconStyle={{ backgroundColor: "#13875b" }}
              textStyle={{
                fontFamily: detailsCheckboxes[item.key]
                  ? "Jakarta-SemiBold"
                  : "Jakarta-Light",
                textDecorationLine: "none",
                fontSize: 16,
                color: "white",
              }}
              label={item.label}
              state={detailsCheckboxes[item.key]}
              setState={() => toggleCheckbox(item.key)}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

export default DetailsContent;
