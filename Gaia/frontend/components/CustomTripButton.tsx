import { ButtonProps } from "@/types/declarations";
import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
const CustomTripButton = ({
  onPress,
  title,
  IconLeft,
  IconRight,
  className,
  textClassName,
  tripDate,
  pastTripButton,
  ...props
}: ButtonProps) => (
  <TouchableOpacity
    onPress={onPress}
    className={` rounded-full p-2 flex  flex-row  items-start shadow-md shadow-netural-400/70 relative ${pastTripButton ? "bg-tabs-300" : "bg-gaiaGreen-100"} ${className}`}
    {...props}
  >
    {pastTripButton && (
      <Ionicons
        name="checkmark-circle-outline"
        size={20}
        color="white"
        className="absolute top-2 right-3 text-white z-10"
      />
    )}
    {IconLeft && <IconLeft />}
    <View className="flex-1 justify-start  items-start">
      <Text className={`p-2 text-lg font-bold text-left  ${textClassName}`}>
        {title}
      </Text>
      <Text className={`pl-2 text-sm font-bold text-left  ${textClassName}`}>
        {tripDate}
      </Text>
    </View>
    {IconRight && <IconRight />}
  </TouchableOpacity>
);

export default CustomTripButton;
