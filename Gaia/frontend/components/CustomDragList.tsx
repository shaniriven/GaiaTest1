import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import { CustomDragListProps, Trip } from "@/declarations";
import { useState } from "react";
import { TouchableOpacity, Text, View, Image } from "react-native";
import { singUpImage, icons } from "@/constants/index";

const renderItem = ({
  item: { name, type, time_hours },
  drag,
  isActive,
}: RenderItemParams<Trip>) => {
  return (
    <ScaleDecorator>
      <View className="flex flex-row items-center justify-center bg-white rounded-lg shadow-sm shadow-neutral-300 mb-3">
        <TouchableOpacity
          onLongPress={drag}
          disabled={isActive}
          className="flex flex-row justify-center p-3"
          style={[{ backgroundColor: isActive ? "#D9D9D9" : "" }]}
        >
          <View className="flex flex-row items-center justify-between">
            <Image
              source={singUpImage}
              className="w-[80px] h-[90px] rounded-lg"
            />
            <View className="flex flex-col mx-5 gap-y-5 flex-1">
              <View className="flex flex-row items-center gap-x-2">
                <Image source={icons.point} className="w-5 h-5" />
                <Text
                  className="text-md font-JakartaMedium text-black"
                  numberOfLines={1}
                >
                  {name}
                </Text>
              </View>
              <View className="flex flex-row items-center gap-x-2">
                <Image source={icons.to} className="w-5 h-5" />
                <Text
                  className="text-md font-JakartaMedium text-black"
                  numberOfLines={1}
                >
                  {type}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </ScaleDecorator>
  );
};

const CustomDragList = ({ data, className, ...props }: CustomDragListProps) => {
  const [listData, setData] = useState(data);
  return (
    <DraggableFlatList
      data={listData}
      keyExtractor={(item) => item.key}
      renderItem={renderItem}
      onDragEnd={({ data }) => setData(data)}
      className={className}
      keyboardShouldPersistTaps="handled"
      ListHeaderComponent={() => (
            <View>
                <View className="flex flex-row items-center justify-between my-5">
                    <Text className="text-2xl font-JakartaExtraBold">Saved Locations</Text>
                </View>
            </View>
      )}
      {...props}
    />
  );
};

export default CustomDragList;
