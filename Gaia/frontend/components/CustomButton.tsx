import { ButtonProps } from "@/types/declarations";
import React from "react";
import { Text, TouchableOpacity } from "react-native";

const getBgVariantStyle = (variant: ButtonProps["bgVariant"]) => {
  switch (variant) {
    case "primary":
      return "bg-gaiaGreen-100";
    case "secondary":
      return "bg-neutral-300";
    case "danger":
      return "bg-red-500";
    case "success":
      return "bg-green-500";
    case "outline":
      return "bg-transparent border-netural-300 border-[0.5px]";
    case "gray-vibe":
      return "bg-[#D9D9D9]";
    default:
      return "bg-[#0286ff]";
  }
};

const getTextVariantStyle = (variant: ButtonProps["textVariant"]) => {
  switch (variant) {
    case "primary":
      return "text-black";
    case "secondary":
      return "text-gray-100";
    case "danger":
      return "text-red-100";
    case "success":
      return "text-green-100";
    case "gray-vibe":
      return "text-gray-vibe";
    default:
      return "text-gray-100";
  }
};

const CustomButton = ({
  onPress,
  title,
  bgVariant = "primary",
  textVariant = "default",
  IconLeft,
  IconRight,
  className,
  textClassName,
  ...props
}: ButtonProps) => (
  <TouchableOpacity
    onPress={onPress}
    className={` rounded-full p-2 flex flex-row justify-center items-center shadow-md shadow-netural-400/70 ${getBgVariantStyle(bgVariant)} ${className}`}
    {...props}
  >
    {React.isValidElement(IconLeft) ? (
      IconLeft
    ) : typeof IconLeft === "function" ? (
      <IconLeft />
    ) : null}
    <Text
      className={`text-lg font-bold mx-4 ${getTextVariantStyle(textVariant)} ${textClassName}`}
    >
      {title}
    </Text>
    {React.isValidElement(IconRight) ? (
      IconRight
    ) : typeof IconRight === "function" ? (
      <IconRight />
    ) : null}
  </TouchableOpacity>
);

export default CustomButton;
