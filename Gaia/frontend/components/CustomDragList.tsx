/* eslint-disable prettier/prettier */
import DraggableFlatList, { RenderItemParams, ScaleDecorator } from "react-native-draggable-flatlist";
import { CustomDragListProps, Destination, } from "@/declarations";
import { memo, useEffect, useState } from "react";
import { TouchableOpacity, Text, View, Image, Pressable, StyleSheet, ListRenderItemInfo } from "react-native";
import { singUpImage, icons } from "@/constants/index";
import ReorderableList, {
  ReorderableListReorderEvent,
  reorderItems,
  useReorderableDrag,
} from 'react-native-reorderable-list';


// eslint-disable-next-line react/display-name
const Card: React.FC<Destination & { dragDisabled: boolean }> = memo(({ type, name, id, dragDisabled }) => {
  const drag = useReorderableDrag();

  return (
    <Pressable onLongPress={dragDisabled ? undefined : drag}>
      <View className="flex flex-row items-center justify-center rounded-lg  mx-4 mb-3">

        {/* destination */}
        <TouchableOpacity onLongPress={dragDisabled ? undefined : drag} className="flex flex-row justify-center rounded-lg shadow-md shadow-neutral-300 border border-[#D9D9D9]" style={[{ backgroundColor: true ? "#D9D9D9" : "" }]} >
          <View className="flex flex-row items-center justify-between bg-white  rounded-lg ">

            {/* image */}
            <Image source={singUpImage} className="w-[80px] h-[90px] rounded-lg" />

            {/* description */}
            <View className="flex flex-col mx-5 gap-y-5 flex-1">
              {/* destination name */}
              <View className="flex flex-row items-center gap-x-2">
                <Image source={icons.point} className="w-5 h-5" />
                <Text className="text-md font-JakartaMedium text-black" numberOfLines={1} >
                  {name}
                </Text>
              </View>
              {/* destination type */}
              <View className="flex flex-row items-center gap-x-2">
                <Image source={icons.to} className="w-5 h-5" />
                <Text className="text-md font-JakartaMedium text-black" numberOfLines={1}>
                  {type}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </Pressable>
  );
});

const CustomDragList = ({ plan, className, onSave, dragDisabled, onDragEnd, ...props }: CustomDragListProps) => {
  const [updatedPlan, setUpdatedPlan] = useState(plan);


  const handleReorder = ({ from, to }: ReorderableListReorderEvent) => {
    if (!dragDisabled) {
      setUpdatedPlan(value => reorderItems(value, from, to));
      onDragEnd(updatedPlan);
    }
  };

  // const renderItem = ({ item }: ListRenderItemInfo<Destination>) => (
  //   <View className="flex mt-3">
  //     <Card {...item} />
  //   </View>
  // );

  return (
    <View pointerEvents={"auto"}>
      <ReorderableList
        data={updatedPlan}
        onReorder={handleReorder}
        renderItem={({ item }) => <Card {...item} dragDisabled={dragDisabled ?? false} />}
        keyExtractor={item => item.id}
        scrollEnabled={true}
        
      />
    </View>
  );
};

export default CustomDragList;
