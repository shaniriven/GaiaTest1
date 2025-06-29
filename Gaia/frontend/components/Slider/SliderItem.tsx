import { SliderItemProps } from "@/types/declarations";
import { Text, View } from "react-native";
import Animated, {
    Extrapolation,
    interpolate,
    useAnimatedStyle,
} from "react-native-reanimated";

const SliderItem = ({ item, index, scrollX, width }: SliderItemProps) => {
  const rnAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: interpolate(
            scrollX.value,
            [(index - 1) * width, index * width, (index + 1) * width],
            [-width * 0.7, 0, width * 0.7],
            Extrapolation.CLAMP,
          ),
        },
      ],
    };
  });
  return (
    <Animated.View
      style={[{ width: width }, rnAnimatedStyle]}
      className="justify-start items-center"
    >
      <View className="w-24 h-20 items-center justify-center bg-gray-100 shadow-md rounded-2xl m-3">
        <Text className="text-md font-JakartaSemiBold">{item.day}</Text>
        <Text className="text-md font-Jakarta mt-1">{item.value}</Text>
      </View>
    </Animated.View>
  );
};

export default SliderItem;
