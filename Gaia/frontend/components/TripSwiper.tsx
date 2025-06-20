/* eslint-disable prettier/prettier */
import React, { useEffect, useRef, useState } from "react";
import { View, Text, Dimensions, TouchableOpacity, ActivityIndicator, Image } from "react-native";
import * as Progress from "react-native-progress";
import { Day_Trip, Destination, TripSwiperProps } from "@/types/declarations";
import Swiper from "react-native-swiper";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import CustomDragList from "./CustomDragList";


const TripSwiper = ({ dayTrips, color }: TripSwiperProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [days, setDaysTrips] = useState(dayTrips);
    const swiperRef = useRef<Swiper>(null);

    const [loading, setLoading] = useState(true);
    const [dragDisabled, setDragDisabled] = useState(true);
    const [swipeEnabled, setSwipeEnabled] = useState(true);
    const [editButtonMode, setEditButtonMode] = useState<'edit' | 'save'>('edit');

    const [dragEndPlan, setDragEndPlan] = useState([...days[0].plan]);
    const [currentDayTrip, setCurrentDayTrip] = useState([...days[0].plan]);
    const [dayTripBeforeEdit, setDayTripBeforeEdit] = useState([...days[0].plan]);

    const progressValue = (currentIndex + 1) / days.length;

    useEffect(() => {
        console.log('date:', days[currentIndex].date);
        console.log('current trip:' + currentDayTrip.map((item) => (item.name + item.id)));
        console.log('before trip:' + dayTripBeforeEdit.map((item) => (item.name + item.id)));
    },[editButtonMode]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        setEditButtonMode('edit');
        setSwipeEnabled(true);
        setCurrentDayTrip([...days[currentIndex]?.plan || []]);
        setDayTripBeforeEdit([...days[currentIndex]?.plan || []]);

    }, [currentIndex]);



    const handleNext = () => {
        if (swiperRef.current) {
            swiperRef.current.scrollBy(1);
            setCurrentIndex((prevIndex) => {
                const newIndex = Math.min(prevIndex + 1, days.length - 1);
                return newIndex;
            });
        }
    };

    const handlePrev = () => {
        if (swiperRef.current) {
            swiperRef.current.scrollBy(-1);
            setCurrentIndex((prevIndex) => {
                const newIndex = Math.max(prevIndex - 1, 0);
                return newIndex;
            });
        }
    };

    const onSave = (updatedAllDaysTripData: Day_Trip[]) => {
        // console.log('TripSwiper onSave: updatedAllDaysTripData: ', updatedAllDaysTripData);
    };

    const onEditPress = () => {
        setSwipeEnabled(false);
        setDayTripBeforeEdit(currentDayTrip);
        setEditButtonMode('save');
    }

    const onSavePress = () => {
        setSwipeEnabled(true);
        const updatedAllDaysTripData = days.map((dayTripItem, index) => {
            if (index === currentIndex) {
                return { ...dayTripItem, plan: currentDayTrip };
            }
            return dayTripItem;
        });
        onSave(updatedAllDaysTripData);
        setDaysTrips(updatedAllDaysTripData);
        setCurrentDayTrip(currentDayTrip);
        setEditButtonMode('edit');
    }

    const editSaveFunction = () => {
        if (editButtonMode === 'edit') {
            onEditPress();
        } else {
            onSavePress();
        }
        setDragDisabled(prev => !prev);
    };

    useEffect(() => {
        setCurrentDayTrip(dragEndPlan);
        console.log('here');
    }, [dragEndPlan]);

    const handleDragEnd = (plan: Destination[]) => {
        setDragEndPlan(plan);  
        setCurrentDayTrip(plan); // Force immediate update
    };

    const cancelFunction = () => { 
        setCurrentDayTrip([...dayTripBeforeEdit]);
        setEditButtonMode('edit');
        setSwipeEnabled(true);
        setDragDisabled(prev => !prev);
    }

    return (
        <View className="flex-1">
            {loading
                ? (<ActivityIndicator size="small" color={color} />)
                : (<View className="flex-1">

                    {/* progress bar */}
                    <Progress.Bar progress={progressValue} width={null} height={2} color={color} />

                    {/* swiper container */}
                    <Swiper
                        ref={swiperRef}
                        loop={false}
                        showsPagination={false}
                        scrollEnabled={swipeEnabled}
                        onIndexChanged={(index: number) => setCurrentIndex(index)}
                    >

                        {days.map((dayTripItem, index) => (
                            <View key={index} className=" items-center items-center justify-center mt-16 h-[75%]">


                                {/* date of the day */}
                                <Text className="text-xl font-JakartaSemiBold p-2 mt-2">{dayTripItem.date}</Text>

                                {/* edit || save button */}
                                <View className="flex flex-row mt-1 mb-4">
                                    <TouchableOpacity key={index}
                                        onPress={() => editSaveFunction()}
                                        className={`rounded-xl w-[65] h-[32] justify-center items-center shadow-[2px_2px_4px_rgba(0,0,0,0.3)] bg-white ${editButtonMode === 'edit' ? '' : 'border border-[0.7pxx] border-gaiaGreen-100'}`}>
                                        <Text className="text-md text-center font-JakartaMedium text-primary">{editButtonMode === 'edit' ? 'edit' : 'save'}</Text>
                                    </TouchableOpacity>
                                </View>
                                
                                <TouchableOpacity onPress={() => cancelFunction()}
                                    className="w-full justify-center items-center" 
                                    style={{ opacity: editButtonMode === 'edit' ? 0 : 1 }}>
                                    <Text className="text-black text-md font-JakartaBold">cancel</Text>
                                </TouchableOpacity>
                                <View className="flex mt-2">
                                    {/* draglist plan of the day */}
                                    <CustomDragList plan={currentDayTrip} dragDisabled={dragDisabled} onDragEnd={setCurrentDayTrip}/>
                                </View>
                            </View>
                        ))}
                    </Swiper>
                </View>
                )}
            <TouchableOpacity onPress={handlePrev}
                style={{ position: 'absolute', left: 30, top: 70, transform: [{ translateY: -25 }], zIndex: 1, }} >
                <FontAwesome name="chevron-left" size={20} color={'black'} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleNext}
                style={{ position: 'absolute', right: 30, top: 70, transform: [{ translateY: -25 }], zIndex: 1, }} >
                <FontAwesome name="chevron-right" size={20} color={'black'} />
            </TouchableOpacity>
        </View>

    );
};

export default TripSwiper;