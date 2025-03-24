/* eslint-disable prettier/prettier */
import { test_trip_I, test_trip_II } from '@/constants/testData';
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { Link } from 'expo-router'
import { Text, View, Dimensions, Animated, Pressable, FlatList, TouchableOpacity, StyleSheet, ListRenderItemInfo } from 'react-native'
import { useClerk } from '@clerk/clerk-react'
import { SafeAreaView } from 'react-native-safe-area-context'
import ScreenHeader from '@/components/ScreenHeader';
import {  useEffect, useRef, useState } from 'react';
import {  Full_Trip } from '@/declarations';
import { icons } from '@/constants';
import TripSwiper from '@/components/TripSwiper';

const screenWidth = Dimensions.get("window").width;
const numColumns = 4;
const squareSize = screenWidth / numColumns - 20;


export default function Page() {
  const [fullTripList, setFullTripList] = useState([test_trip_I, test_trip_II]);
  const color = "#13875b";
  const [selectedScreen, setSelectedScreen] = useState<Full_Trip | null>(null,);
  const [fullTripListCopy, setFullTripListCopy] = useState([...fullTripList])
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

  const handleClosePanel = () => {
    // Fade out the arrow before sliding the panel out
    Animated.timing(arrowOpacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      closePanel();
    });
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

  const arrowOpacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (selectedScreen) {
      // fade in 
      setTimeout(() => {
        Animated.timing(arrowOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      }, 300);
    } else {
      // fade out 
      Animated.timing(arrowOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [selectedScreen]);

  return (
    <SafeAreaView className="flex-1 bg-white">

      {/* header and back arrow */}
      <View className="flex-row items-center justify-between">
        {selectedScreen && (
          <TouchableOpacity onPress={handleClosePanel} className="absolute left-4 pt-2">
            <Animated.Image
              source={icons.backArrow}
              className="w-[24px] h-[24px]"
              style={{ opacity: arrowOpacity }}
            />
          </TouchableOpacity>
        )}
        <View className="flex-1 items-center">
          <ScreenHeader text="Planned Trips" />
        </View>
      </View>

      <View className="flex-1 p-4">

        {/* planned trips list */}
        <FlatList data={fullTripListCopy} keyExtractor={(item) => item.id.toString()} numColumns={numColumns}
          renderItem={({ item }) => (
            <TouchableOpacity className={`bg-gaiaGreen-100 justify-center items-center m-2 rounded-lg`} style={{ width: squareSize, height: squareSize }} onPress={() => openPanel(item)} >
              <Text className="text-white text-lg font-JakartaMedium">{item.title}</Text>
            </TouchableOpacity>
          )}
        />

        {/* selected trip modal */}
        {selectedScreen && (
          <Animated.View
            className="absolute top-0 bottom-0 bg-white shadow-lg bg-tabs-400 self-center rounded-xl p-2"
            style={{
              width: screenWidth - 20, // Adjust width to account for the margins
              transform: [{ translateX: slideAnim }],
            }}
          >
            <View className="flex-1 mt-4">
              <View className="flex-row justify-between items-end">

                {/* trip name (selected screen title) */}
                <View className="flex-row items-end ml-2">
                  <Text className="text-3xl font-JakartaMedium">{selectedScreen.title}</Text>
                </View>

                {/* dates above progress bar */}
                <View className="flex-row items-end mr-2">
                  <Text className="text-lg font-JakartaMedium">{formatDateRange(selectedScreen.startDate, selectedScreen.endDate)}</Text>
                </View>
              </View>
              
              {/* trip swiper */}
              <View className="flex-1 m-2 ">
                <TripSwiper dayTrips={selectedScreen.dayTrips} color={color} />
              </View>
            </View>
          </Animated.View>
        )}
      </View>
    </SafeAreaView>
  );
}



