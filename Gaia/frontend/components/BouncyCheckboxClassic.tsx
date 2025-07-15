// using
import { BouncyCheckboxClassicProps } from "@/types/declarations";
import { Ionicons } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Text, View } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";

const BouncyCheckboxClassic = ({
  state,
  setState,
  label,
  className,
  size = 18,
  icon,
  ...props
}: BouncyCheckboxClassicProps) => {
  const createIconLabel = () => {
    if (icon === "flights") {
      return (
        <View className="flex-1 flex-row items-center justify-start ml-4">
          <Ionicons
            name={"airplane"}
            size={24}
            color={state ? "#13875b" : "gray"}
          />
          <Text
            className={`${state ? "font-JakartaBold" : "font-JakartaMedium"} ml-2 text-xl`}
          >
            {label}
          </Text>
        </View>
      );
    } else if (icon === "anywhere") {
      return (
        <View className="flex-1 flex-row items-center justify-start ml-4">
          <Ionicons
            name={"earth"}
            size={24}
            color={state ? "#13875b" : "gray"}
          />
          <Text
            className={`${state ? "font-JakartaBold" : "font-JakartaMedium"} ml-2 text-xl`}
          >
            {label}
          </Text>
        </View>
      );
    } else if (icon === "timeOptimize") {
      return (
        <View className="flex-1 flex-row items-center justify-start ml-4">
          <MaterialCommunityIcons
            name={"airplane-clock"}
            size={24}
            color={state ? "#13875b" : "gray"}
          />
          <Text
            className={`${state ? "font-JakartaBold" : "font-JakartaMedium"} ml-2 text-xl`}
          >
            {label}
          </Text>
        </View>
      );
    } else {
      // no icon case
      return (
        <View className="flex-1 flex-row items-center justify-start ml-2">
          <Text
            className={`${state ? "font-JakartaBold" : "font-JakartaMedium"} ml-2 text-lg`}
          >
            {label}
          </Text>
        </View>
      );
    }
  };

  return (
    <View className="flex-row items-center">
      {/* {icon === "flights" && (
        <Ionicons
          name={"airplane"}
          size={24}
          color={state ? "#13875b" : "gray"}
        />
      )} */}
      <BouncyCheckbox
        isChecked={state}
        useBuiltInState={false}
        size={size}
        fillColor="#13875b"
        unFillColor="#FFFFFF"
        text={label}
        iconStyle={{ borderColor: "red" }}
        innerIconStyle={{ borderWidth: 2 }}
        textStyle={{
          fontFamily: state ? "Jakarta-Bold" : "Jakarta-Medium",
          textDecorationLine: "none",
          fontSize: 17,
        }}
        onPress={(checked: boolean) => {
          setState(!state);
        }}
        textComponent={createIconLabel()}
        {...props}
      />
    </View>
  );
};
export default BouncyCheckboxClassic;
