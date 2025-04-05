/* eslint-disable prettier/prettier */
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import CustomButton from "@/components/CustomButton";
import ScreenHeader from "@/components/ScreenHeader";
import TabButton from "@/components/TabButton";
import { screens } from "../../../constants/index";
import LocationScreen from "@/components/NewTripScreens/LocationScreen";
import DatesScreen from "@/components/NewTripScreens/DatesScreen";
import TravelersScreen from "@/components/NewTripScreens/TravelersScreen";
import { UserInterestesSelections } from "@/declarations";
import InterestScreen from "@/components/NewTripScreens/InterestsScreen";
import Animated from 'react-native-reanimated';
import { useSharedValue, withTiming, useAnimatedStyle } from 'react-native-reanimated';
import axios from 'axios';
import config from '../../../config';
import { useUser } from "@clerk/clerk-expo"; 

const NewPlan = () => {
  const { user } = useUser(); 
  console.log(user.id);
  const api_url = config.api_url;
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const isLastScreen = activeIndex === screens.length - 1;
  const [selectedCountries, setSelectedCountries] = useState<{ name: string; code: string }[]>([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [group, setGroup] = useState({ adults: 1, children: 0, total: 1, type: 'solo' });
  const [interestsList, setInterestsList] = useState<UserInterestesSelections>({
    'Food & Drinks': ['Restaurants'],
    'Music & Concerts': ['Concerts'],
  });

  const [form, setForm] = useState(
    {
      start: startDate,
      end: endDate,
      location: [] as string[],
      groupType: group.type,
      adults: group.adults,
      children: group.children,
      interestsList: interestsList,
      includeRestaurants: '',
      includeFlights: '',
    }
  );

  const translateX = useSharedValue(0);
  const previousIndex = useSharedValue(activeIndex);

  useEffect(() => {
    translateX.value = 300;
    translateX.value = withTiming(0, { duration: 1000 }); 
    previousIndex.value = activeIndex;
  }, [activeIndex]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  type FormFields = 'start' | 'end' | 'location' | 'groupType' | 'adults' | 'children' | 'interestsList' | 'includeRestaurants' | 'includeFlights';

  const updateField = (field: FormFields, value: any) => {
    setForm((prevForm) => ({
      ...prevForm,
      [field]: Array.isArray(prevForm[field]) ? [...prevForm[field], value] : value,
    }));
  };

  const submitField = async (fieldData: any, fieldName: 'location' | 'start' | 'end' | 'group' | 'interests') => {
    try {
      const response = await axios.post(`${api_url}/trip/submit/${fieldName}/`, { fieldData, user_id: user.id });
      console.log(`Step '${fieldName}' submitted successfully:`);
      console.log(response.data);
    } catch (error) {
      console.error(`Error submitting step ${fieldName}:`, error);
    }
  }

  useEffect(() => {
    submitField({ ['location']: selectedCountries }, 'location')
  }, [form.location]);

  useEffect(() => {
    submitField({ ['start']: startDate }, 'start')
  }, [form.start]);

  useEffect(() => {
    submitField({ ['end']: endDate }, 'end')
  }, [form.end]);

  useEffect(() => {
    submitField({ ['end']: endDate }, 'end')
  }, [form.end]);

  useEffect(() => {
    submitField({ ['group']: group }, 'group')
  }, [group]);

  useEffect(() => {
    submitField({ ['interests']: interestsList }, 'interests')
  }, [form.interestsList]);

  const handleSelectCountry = (country: { name: string; code: string }) => {
    setSelectedCountries((prevSelected) => {
      const alreadySelected = prevSelected.find((c) => c.code === country.code);
      if (alreadySelected) {
        return prevSelected.filter((c) => c.code !== country.code);
      } else {
        return [...prevSelected, country];
      }
    });

    updateField('location', country.name)
  }

  const onChangeStart = (event: Event, selectedDate?: Date | undefined) => {
    const pickedDate = selectedDate || startDate;
    if (pickedDate > endDate) {
      setEndDate(pickedDate);
      updateField('end', pickedDate)
    }
    setStartDate(pickedDate);
    updateField('start', pickedDate)
  };

  const onChangeEnd = (event: Event, selectedDate?: Date | undefined) => {
    const pickedDate = selectedDate || endDate;
    setEndDate(pickedDate);
    updateField('end', pickedDate)
  };

  const handleChangeNumberOfPeople = (adults: number, children: number) => {
    updateField('adults', adults);
    updateField('children', children);
    setGroup((prevGroup) => ({
      ...prevGroup,
      adults: adults,
      children: children,
      total: adults + children,

    }));
  };
  
  const onChangeGroupType = (value: string) => {
    updateField('groupType', value);
    setGroup((prevGroup) => ({
      ...prevGroup,
      type: value,
    }))
  }

  const onChangeInterests = (userInterestsSelections: UserInterestesSelections) => {
    setInterestsList(userInterestsSelections);
    updateField('interestsList', userInterestsSelections);
  };
  

  return (
    <SafeAreaView className="flex-1 bg-white p-5 ">

      {/* Title and close Button */}
      {/* באג- כשלוחצים על האיקס חוזרים אחורה בניווט ולא עולה חלון המחק\שמור ולכן נתקע */}
      <View className="flex items-center">
        <TouchableOpacity onPress={() => router.back()} className="w-full flex justify-end items-end pt-3 pr-3" >
          <FontAwesome name="close" size={22} />
        </TouchableOpacity>
        <ScreenHeader text="New Trip" />
      </View>

      {/* Tab Buttons */}
      <View className="flex flex-row flex-wrap gap-4 justify-between mb-5 mt-3">
        {screens.map((screen, index) => (
          <TabButton key={index}
            title={screen.title}
            bgColor="bg-grayTab"
            textColor="text-primary"
            onPress={() => {
              setActiveIndex(index)
            }}
            isActive={activeIndex === index} />
        ))}
      </View>

      {/* filled data list */}
      {/* <View className="flex flex-row flex-wrap gap-4 justify-between mb-5 mt-3">
        <TouchableOpacity
          className="p-2 flex-1  justify-center items-center shadow-md shadow-netural-400/70 bg-gaiaGreen-100"
          style={{ minHeight: 35 }}
        >
          <Text className="text-m font-bold text-center text-black">Date</Text>
        </TouchableOpacity>
      </View> */}

      {/* Animated Screen Content */}
      <Animated.View style={animatedStyle} className="flex-1 items-center justify-between bg-white" key={`content-${activeIndex}`}>
        {activeIndex === 0 && <LocationScreen handleSelect={handleSelectCountry} currentValue={selectedCountries} />}
        {activeIndex === 1 && <DatesScreen startDate={startDate} endDate={endDate} onChangeStart={onChangeStart} onChangeEnd={onChangeEnd} />}
        {activeIndex === 2 && <TravelersScreen handleSelect={handleChangeNumberOfPeople} onChangeGroupType={onChangeGroupType} currentGroupValue={group} />}
        {activeIndex === 3 && <InterestScreen handleSelect={onChangeInterests} userInterests={interestsList} />}
      </Animated.View>
      
      <View className="absolute bottom-10 left-0 right-0 items-center">
        <CustomButton
          title={isLastScreen ? 'Get Started' : 'Next'}
          className="w-[130px]"
          bgVariant="gray-vibe"
          textVariant="primary"
          onPress={() => isLastScreen
            ? router.replace('/')
            : setActiveIndex(activeIndex + 1)} 
          // onPress={() => isLastScreen
          //   ? router.replace('/')
          //   : setActiveIndex(activeIndex + 1)} 
          />
      </View>
    </SafeAreaView>
  );
}


      // {/* screens */}
      // <Animated.View
      //   style={animatedStyle}
      //   className="flex items-center justify-between bg-white"
      //   key={`content-${activeIndex}`}
      // >
      //   {/* locations */}
      //   {activeIndex === 0 && <LocationScreen handleSelect={handleSelectCountry} currentValue={selectedCountries} />}

      //   {/* dates */}
      //   {activeIndex === 1 &&
      //     <DatesScreen
      //       startDate={startDate}
      //       endDate={endDate}
      //       onChangeStart={onChangeStart}
      //       onChangeEnd={onChangeEnd}
      //     />
      //   }

      //   {/* travelers */}
      //   {activeIndex === 2 && <TravelersScreen handleSelect={handleChangeNumberOfPeople} onChangeGroupType={onChangeGroupType} currentValue={group}/>}

      //   {/* interests */}
      //   {activeIndex === 3 && <InterestScreen handleSelect={onChangeInterests} currentValue={interestsList}/>}
      
      //   </Animated.View>

//
// animated version 
// {/* Sticky Headers */}
// <View className="absolute top-10 left-5 w-full">
//   {headers.map((title, index) => (
//     <TouchableOpacity key={index} onPress={handleBack}>
//     <Text className="text-lg font-bold">{title}</Text>
//   </TouchableOpacity>
//   ))}
// </View>

// {/* Animated Screens */}
// <Animated.View style={{ transform: [{ translateY }] }} className="mt-20 flex-1">
//   <View className="p-5">
//     <Text className="text-2xl font-bold">{screens[activeIndex].title}</Text>
//     {screens[activeIndex].fields.map((field, index) => (
//       <TextInput key={index} placeholder={field} className="w-80 border-b-2 p-2 mt-4" />
//     ))}
//     {activeIndex < screens.length - 1 && (
//       <TouchableOpacity onPress={handleNext} className="mt-5 p-3 bg-green-600 rounded-lg">
//         <Text className="text-white">Next</Text>
//       </TouchableOpacity>
//     )}
//   </View>
// </Animated.View>
//  const swiperRef = useRef<Swiper>(null);
// <SafeAreaView className="flex-1 bg-white">

//   <View className="flex-row justify-end pr-5 pt-5">
//     <TouchableOpacity onPress={() => router.back()}>
//       <FontAwesome name="close" size={22} />
//     </TouchableOpacity>
//   </View>

//   <Swiper
//     ref={swiperRef}
//     loop={false}
//     dot={<View className="w-[32px] h-[6px] mx-1 bg-[#9aa19d] rounded-full" />}
//     activeDot={<View className="w-[32px] h-[6px] mx-1 bg-[#13875b] rounded-full" />}
//     onIndexChanged={(index) => setActiveIndex(index)}
//   >
//     {/* Page 1 */}
//     <View className="flex-1 items-center mt-10">

//       <Text className="text-3xl font-JakartaExtraBold">Where would you like to go?</Text>
//       <FontAwesome name="globe" size={100} />
//       <View className="w-full items-center mt-5">
//         {/* Set InputField to full width */}
//         <InputField
//           label="Dates"
//           placeholder="Enter Dates:"
//           icon={icons.person}
//           value={form.dates}
//           onChangeText={(value: string) =>
//             setForm({
//               ...form,
//               dates: value,
//             })
//           }
//           className="w-full"
//         />
//         <InputField
//           label="Location"
//           placeholder="Where would you want to go?"
//           icon={icons.email}
//           value={form.location}
//           onChangeText={(value: string) =>
//             setForm({
//               ...form,
//               location: value,
//             })
//           }
//           className="w-full"
//         />
//       </View>
//     </View>


//     {/* Page 1 */}
//     <View className="flex items-center justify-center p-6">
//       <View className="flex flex-row items-center justify-center w-full mt-5">
//         <View className="ml-5 mr-5">
//           <InputField
//             label="Dates"
//             placeholder="Enter Dates:"
//             icon={icons.person}
//             value={form.dates}
//             onChangeText={(value: string) =>
//               setForm({
//                 ...form,
//                 dates: value,
//               })
//             }
//           />
//           <InputField
//             label="Location"
//             placeholder="Where would you want to go?"
//             icon={icons.email}
//             value={form.location}
//             onChangeText={(value: string) =>
//               setForm({
//                 ...form,
//                 location: value,
//               })
//             }
//           />
//         </View>
//       </View>
//     </View>


//     <View className="flex items-center justify-center p-1">
//       <View className="flex flex-row items-center justify-center w-full mt-5">
//         <Text className="text-black text-3xl font-bold mx-10 text-center">
//           Date
//         </Text>
//       </View>
//     </View>
//     <View className="flex items-center justify-center p-1">
//       <View className="flex flex-row items-center justify-center w-full mt-5">
//         <Text className="text-black text-3xl font-bold mx-10 text-center">
//           Date
//         </Text>
//       </View>
//     </View>
//   </Swiper>
//   <CustomButton
//     title={isLastSlide ? 'Get Started' : 'Next'}
//     className="w-[130px] mt-10 mb-10"
//     bgVariant="gray-vibe"
//     textVariant="primary"

//     onPress={() => isLastSlide
//       ? router.replace('/(auth)/sign-up')
//       : swiperRef.current?.scrollBy(1)} IconLeft={undefined} IconRight={undefined} />
// </SafeAreaView>

export default NewPlan;
