import DailyPlan from "@/components/DailyPlan";
import ScreenHeader from "@/components/ScreenHeader";
import TabButton from "@/components/TabButton";
import { useLocalSearchParams, useNavigation, usePathname } from "expo-router";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Text,
  View,
  ViewToken,
} from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

export default function PlanID() {
  const { id, name } = useLocalSearchParams();
  const navigation = useNavigation();
  const buttonsLabels = ["plan", "transportation", "todo list"];
  const [activeButtonIndex, setActiveButtonIndex] = useState(0);
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  // const { width } = Dimensions.get("window");
  const pathname = usePathname();
  const window = Dimensions.get("window");

  // Dynamically set the header by plan name
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: () => <ScreenHeader text={name as string} />,
      headerStyle: {
        height: 110,
      },
    });
  }, [pathname]);

  useEffect(() => {
    console.log(activeDayIndex);
  }, [activeDayIndex]);
  // temp data for dates label
  const data = [
    { label: "day 1", value: "4.6" },
    { label: "day 2", value: "5.6" },
    { label: "day 3", value: "6.6" },
    { label: "day 4", value: "7.6" },
  ];

  type DateLabel = { label: string; value: string };
  type SliderItemProps = {
    item: DateLabel;
    index: number;
    scrollX: SharedValue<number>;
  };
  type SliderProps = {
    itemList: DateLabel[];
  };

  type PaginationProps = {
    items: DateLabel[];
    paginationIndex: number;
    scrollX: SharedValue<number>;
  };

  const { width } = Dimensions.get("screen");
  const ITEM_WIDTH = width;

  const SliderItem = ({ item, index, scrollX }: SliderItemProps) => {
    const rnAnimatedStyle = useAnimatedStyle(() => {
      return {
        transform: [
          {
            translateX: interpolate(
              scrollX.value,
              [
                (index - 1) * ITEM_WIDTH,
                index * ITEM_WIDTH,
                (index + 1) * ITEM_WIDTH,
              ],
              [-ITEM_WIDTH * 0.7, 0, ITEM_WIDTH * 0.7],
              Extrapolation.CLAMP,
            ),
          },
        ],
      };
    });
    return (
      <Animated.View
        style={[{ width: ITEM_WIDTH }, rnAnimatedStyle]}
        className="justify-start items-center"
      >
        <View className="w-20 h-20 items-center justify-center bg-gray-100 shadow-md rounded-2xl m-3">
          <Text className="text-md font-JakartaSemiBold">{item.label}</Text>
          <Text className="text-md font-Jakarta mt-1">{item.value}</Text>
        </View>
      </Animated.View>
    );
  };

  const Pagination = ({ items, paginationIndex, scrollX }: PaginationProps) => {
    return (
      <View className="flex-1 bg-black">
        <View
          className="flex flex-row bg-gaiaGreen-200 justify-center items-center h-[20px]"
          style={{ width: ITEM_WIDTH }}
        >
          {items.map((_, index) => {
            return (
              <View
                key={index}
                className="h-[8px] w-[8px] mx-1 rounded-full"
                style={{
                  backgroundColor: paginationIndex === index ? "#222" : "#aaa",
                }}
              />
            );
          })}
        </View>
        <View className="mt-2">
          {items[paginationIndex]?.label && (
            // <Text className="text-white">{items[paginationIndex].label}</Text>
            <DailyPlan item={items[paginationIndex].label} />
          )}
        </View>
      </View>
    );
  };

  const Slider = ({ itemList }: SliderProps) => {
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
        <View className={`mt-2 w-[${ITEM_WIDTH.toString()}px] h-[100px] `}>
          <Animated.FlatList
            data={itemList}
            renderItem={({ item, index }) => (
              <SliderItem item={item} index={index} scrollX={scrollX} />
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            snapToInterval={ITEM_WIDTH}
            decelerationRate="fast"
            onScroll={onScrollHandler}
            viewabilityConfigCallbackPairs={
              viewabilityConfigCallbackPairs.current
            }
          />
        </View>
        <Pagination
          items={itemList}
          scrollX={scrollX}
          paginationIndex={paginationIndex}
        />
      </View>
    );
  };

  // render screen based on active button
  const renderScreen = () => {
    if (loading) {
      return (
        <View className="flex-1 justify-center items-center bg-white">
          <ActivityIndicator size="large" color="#13875B" />
          <ScreenHeader text={"creating your new trip"} />
        </View>
      );
    }
    switch (activeButtonIndex) {
      case 0:
        return (
          <View className="flex-1 justify-start items-center">
            <Slider itemList={data} />
          </View>
        );
      case 1:
        return (
          <View className="flex-1 justify-center items-center bg-white">
            <ScreenHeader text="1" />
          </View>
        );
      case 2:
        return (
          <View className="flex-1 justify-center items-center bg-white">
            <ScreenHeader text="2" />
          </View>
        );
      case 3:
        return (
          <View className="flex-1 justify-center items-center bg-white">
            <ScreenHeader text="3" />
          </View>
        );
    }
  };

  return (
    <View className="flex-1 p-4 bg-white">
      <View className="flex flex-row flex-wrap gap-4 justify-between mb-5 mt-3 z-500">
        {/* Tab Buttons */}
        {buttonsLabels.map((screen, index) => (
          <TabButton
            key={index}
            title={screen}
            bgColor="bg-grayTab"
            textColor="text-primary"
            onPress={() => {
              setActiveButtonIndex(index);
            }}
            isActive={activeButtonIndex === index}
          />
        ))}
      </View>
      {renderScreen()}
    </View>
  );
}

//   <View className="flex-row items-center justify-center mt-4 space-x-4">
//     {/* Parallax Carousel */}
//     <Carousel
//       data={data}
//       width={window.width * 0.6}
//       height={258}
//       loop={false}
//       pagingEnabled={true}
//       snapEnabled={true}
//       mode="parallax"
//       modeConfig={{
//         parallaxScrollingScale: 0.9,
//         parallaxScrollingOffset: 40,
//       }}
//       // onSnapToItem={(index) => setActiveDayIndex(index)}
//       renderItem={renderItem({ rounded: true })}
//     />
//   </View>

//   <View className="mt-6 w-full flex-1 px-4">
//     <Text className="text-center text-xl font-JakartaMedium">
//       {data[activeDayIndex].label}
//     </Text>
//   </View>
// </View>

// const renderItem =
//   ({ rounded = false }) =>
//   ({ item, index }) => {
//     const isActive = index === activeDayIndex;
//     return (
//       <View
//         className={`items-center justify-center p-4 mx-2 ${
//           isActive ? "bg-white shadow-md" : "opacity-50"
//         } ${rounded ? "rounded-2xl" : ""}`}
//       >
//         <Text className={`text-sm ${isActive ? "font-semibold" : ""}`}>
//           {item.label}
//         </Text>
//         <Text className="text-sm">{item.value}</Text>
//       </View>
//     );
//   };
