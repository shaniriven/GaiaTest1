/* eslint-disable prettier/prettier */
import { TouchableOpacity, Text } from "react-native";
import { TabButtonProps } from "@/declarations";

const TabButton = ({ onPress, title, className, bgColor, textColor, isActive, ...props }: TabButtonProps &
{ isActive: boolean }) => (
    <TouchableOpacity
        onPress={onPress}
        className={` rounded-full p-2 flex-1  justify-center items-center shadow-md shadow-netural-400/70 ${bgColor} ${className} ${isActive ? 'border-[0.5px] border-gaiaGreen-100' : ''}`}
        style={{ minHeight: 35 }}
        {...props}
    >
        <Text className={`text-m font-bold text-center font-JakartaMedium ${textColor}`}>{title}</Text>
    </TouchableOpacity>
);

export default TabButton;
