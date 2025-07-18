import { SliderProps } from "@/types/declarations";
import { useRef, useState } from "react";
import { View, ViewToken } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import PaginationAndContent from "./PaginationAndContent";
import SliderItem from "./SliderItem";

const Slider = ({
  datesLabelList,
  width,
  plan,
  generatedPlan,
}: SliderProps) => {
  const scrollX = useSharedValue(0);
  const [paginationIndex, setPaginationIndex] = useState(0);

  const onScrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollX.value = e.contentOffset.x;
    },
  });

  const onViewableItemsChanged = ({
    viewableItems,
  }: {
    viewableItems: ViewToken[];
  }) => {
    if (
      viewableItems[0].index !== undefined &&
      viewableItems[0].index !== null
    ) {
      setPaginationIndex(viewableItems[0].index);
    }
  };

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  const viewabilityConfigCallbackPairs = useRef([
    { viewabilityConfig, onViewableItemsChanged },
  ]);

  return (
    <View>
      <View className={`mt-2 w-[${width.toString()}px] h-[100px] `}>
        <Animated.FlatList
          data={datesLabelList}
          renderItem={({ item, index }) => (
            <SliderItem
              item={item}
              index={index}
              scrollX={scrollX}
              width={width}
            />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          snapToInterval={width}
          decelerationRate="fast"
          onScroll={onScrollHandler}
          viewabilityConfigCallbackPairs={
            viewabilityConfigCallbackPairs.current
          }
        />
      </View>
      <PaginationAndContent
        datesItems={datesLabelList}
        scrollX={scrollX}
        paginationIndex={paginationIndex}
        width={width}
        plan={plan}
        generatedPlan={generatedPlan}
      />
    </View>
  );
};

export default Slider;
