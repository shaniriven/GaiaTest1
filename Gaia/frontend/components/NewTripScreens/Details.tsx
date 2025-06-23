import { SectionProps } from "@/types/declarations";
import { View, Text } from "react-native";
import { useEffect, useState } from "react";
import BouncyCheckboxClassic from "../BouncyCheckboxClassic";
import { DetailsCheckboxes } from "@/types/type";
import {
  defaultDetailsCheckboxes,
  settingsLabels,
  activitiesLabels,
  accommodationLabels,
} from "@/constants/index";

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
    <View className="flex-1 flex-col  items-center">
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
      <View className="flex items-center mt-3">
        <Text className="text-white font-JakartaSemiBold mb-1 text-xl flex items-center">
          settings
        </Text>
      </View>
      <View className="gap-1 flex flex-col items-start ">
        {settingsLabels.map((item) => (
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
  );
};

export default DetailsContent;
