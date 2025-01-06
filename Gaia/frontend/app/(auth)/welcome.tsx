/* eslint-disable prettier/prettier */
import { Text, TouchableOpacity, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import Swiper from "react-native-swiper";
import { useRef, useState } from "react";
import { onboarding } from "../../constants/index";

import CustomButton from "@/components/CustomButton";


const Onboarding = () => {
  const swiperRef = useRef<Swiper>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const isLastSlide = activeIndex === onboarding.length - 1;
  
  return (
    <SafeAreaView className="flex h-full items-center justify-between bg-white">
      <TouchableOpacity onPress={() => { 
        router.replace('/(auth)/sign-up');
        }}
        className="w-full flex justify-end items-end p-5">
        <Text className="text-black text-md font-JakartaBold">Skip</Text>
      </TouchableOpacity>

      <Swiper ref={swiperRef}
        loop={false}
        dot={<View className="w-[32px] h-[6px] mx-1 bg-[#9aa19d] rounded-full"/>}
        activeDot={<View className="w-[32px] h-[6px] mx-1 bg-[#13875b] rounded-full"/>}
        onIndexChanged={(index) => setActiveIndex(index)}
        >
          {onboarding.map((item, index) => (
            <View key={item.id} className="flex items-center justify-center p-1">
              <View className="flex flex-row items-center justify-center w-full mt-5">
                <Text className="text-black text-3xl font-bold mx-10 text-center">
                  {item.title}
                </Text>
              </View>
              <Image
                source={item.image}
                className={index === 1 ? "w-full h-[400px]" : "w-full h-[300px]"}
                resizeMode={index === 1 ? "cover" : "contain"}
              />  
              <Text className="text-2xl font-JakarteSemiBold text-center text-[858585] mx-10 mt-5">{item.description}</Text>
            </View>
          ))}
      </Swiper>
      <CustomButton
        title={isLastSlide ? 'Get Started' : 'Next'} 
        className="w-[130px] mt-10 mb-10"
        bgVariant="gray-vibe"
        textVariant="primary"
        
        onPress={() =>
          isLastSlide
          ? router.replace('/(auth)/sign-up')
          : swiperRef.current?.scrollBy(1)
        }/>
    </SafeAreaView>
  );
};

export default Onboarding;
