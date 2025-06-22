/* eslint-disable prettier/prettier */
import { Full_Trip, TripsFlatListProps } from "@/types/declarations";
import { useEffect, useRef, useState } from "react";
import { icons } from "@/constants/index";
import TripSwiper from "./TripSwiper";

import { TouchableOpacity, FlatList, Text, Animated, Dimensions, View } from "react-native";

const TripsFlatList = ({ allTripsList, numColumns, squareSize, updatePlan }: TripsFlatListProps) => {
    const color = "#13875b";
    const [selectedScreen, setSelectedScreen] = useState<Full_Trip | null>(null,);
    const [allTrips, setAllTrips] = useState([...allTripsList])
    const screenWidth = Dimensions.get("window").width;
    const slideAnim = useRef(new Animated.Value(screenWidth)).current;

    const openPanel = (screen: Full_Trip) => {
        setSelectedScreen(screen);
        Animated.timing(slideAnim, {
            toValue: 0, // Slide in
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const closePanel = () => {
        Animated.timing(slideAnim, {
            toValue: screenWidth, // Slide out
            duration: 300,
            useNativeDriver: true,
        }).start(() => setSelectedScreen(null));
    };

    const formatDateRange = (startDate: string, endDate: string) => {
        const [day1, month1, year1] = startDate.split("-").map(Number);
        const [day2, month2, year2] = endDate.split("-").map(Number);
    
        if (year1 === year2 && month1 === month2) 
            return `${day1}-${day2}.${month1}.${String(year1).slice(2)}`;
        else if (year1 === year2) 
            return `${day1}.${month1}-${day2}.${month2}.${String(year1).slice(2)}`;
        else 
            return `${day1}.${month1}.${year1}-${day2}.${month2}.${year2}`;
        
    };


    return (
        <View className="flex-1 p-4">
            {/* planned trips list */}
            <FlatList data={allTrips} keyExtractor={(item) => item.id.toString()} numColumns={numColumns}
                renderItem={({ item }) => (
                    <TouchableOpacity className={`bg-gaiaGreen-100 justify-center items-center m-2 rounded-lg`} style={{ width: squareSize, height: squareSize }} onPress={() => openPanel(item)} >
                        <Text className="text-white text-lg">{item.title}</Text>
                    </TouchableOpacity>
                )}
            />
            {/* selected trip modal */}
            {selectedScreen && (
                <Animated.View
                    className="absolute top-0 bottom-0 right-0 bg-white shadow-lg bg-tabs-400"
                    style={{ width: screenWidth, transform: [{ translateX: slideAnim }], }}
                >
                    <View className="flex-1 mt-2 ">
                        <View className="flex-row justify-between items-end">
                            {/* close button and title */}
                            <View className="flex-row items-end gap-2">
                                <TouchableOpacity onPress={closePanel}>
                                    <Animated.Image source={icons.backArrow} style={{ width: 24, height: 24 }} />
                                </TouchableOpacity>
                                <Text className="text-3xl font-JakartaSemiBold">{selectedScreen.title}</Text>
                            </View>
                            {/* dates above progress bar */}
                            <View className="flex-row items-end mr-2">
                                <Text className="text-lg font-JakartaMedium">{formatDateRange(selectedScreen.startDate, selectedScreen.endDate)}</Text>
                            </View>
                        </View>
                        {/* trip swiper */}
                        <View className="flex-1 mt-1 mx-2 ">
                            <TripSwiper allDaysTripData={selectedScreen.dayTrips} color={color} handleSave={undefined}/>
                        </View>
                    </View>
                </Animated.View>
            )}
        </View>
    );
};

export default TripsFlatList;
