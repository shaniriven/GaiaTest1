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
import { UserInterestesSelections, Locations,  } from "@/declarations";
import InterestScreen from "@/components/NewTripScreens/InterestsScreen";
import Animated from 'react-native-reanimated';
import { useSharedValue, withTiming, useAnimatedStyle } from 'react-native-reanimated';
import axios from 'axios';
import config from '../../../config';
import { useUser } from "@clerk/clerk-expo"; 

const NewPlan = () => {
  const { user } = useUser(); 
  const api_url = config.api_url;
  const router = useRouter();

  const [activeIndex, setActiveIndex] = useState(0);
  const isLastScreen = activeIndex === screens.length - 1;

  const [locations, setLocations] = useState<Locations>({}); 

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
      location: locations,
      groupType: group.type,
      adults: group.adults,
      children: group.children,
      interestsList: interestsList,
      includeRestaurants: 'this is a test',
      includeFlights: '',
    }
  );

  const translateX = useSharedValue(300);

  useEffect(() => {
    translateX.value =  300;
    translateX.value = withTiming(0, { duration: 1000 });
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
  console.log('Selected place 222:', form);    
  };
  
  const handleSelectLocation = (locations: Locations) => {
    setLocations(locations);
    updateField('location', locations)
  }

  const renderScreen = () => {
    switch (activeIndex) {
      case 0:
        return <LocationScreen handleSelect={handleSelectLocation} locationList={locations} />;
      case 1:
        return <DatesScreen startDate={startDate} endDate={endDate} onChangeStart={onChangeStart} onChangeEnd={onChangeEnd} />;
      case 2:
        return <TravelersScreen handleSelect={handleChangeNumberOfPeople} onChangeGroupType={onChangeGroupType} currentGroupValue={group} />;
      case 3:
        return <InterestScreen handleSelect={onChangeInterests} userInterests={interestsList} />;
      default:
        return null;
    }
  };

  const submitForm = async () => {
    try {
      const response = await axios.post(`${api_url}/trip/submitForm/`, { form, user_id: user.id });
      if (response.status === 200) {
        console.log("newPlan.tsx submitForm(): Form submitted successfully:", response.data);
      } else {
        console.error("newPlan.tsx submitForm(): Unexpected response status:", response.status);
      }
    } catch (error) {
      console.error("newPlan.tsx submitForm(): Error submitting the form:", error);
    }
  };


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
  
  const askAgent = async () => {
    submitForm();
    try {
      const response = await axios.post(`${api_url}/trip/askAgent/`, form);
      if (response.status === 200) {
          console.log("newPlan.tsx askAgent(): Agent response:", response.data.response); // Log the response from the backend
      } else {
          console.error("newPlan.tsx askAgent(): Unexpected response status:", response.status);
      }
    } catch (error) {
        console.error("newPlan.tsx askAgent(): Error asking agent:", error);
    }
    console.log("newPlan.tsx askAgent(): Agent asked for help");
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



      {/* Animated Screen Content */}
      <Animated.View style={animatedStyle} className="flex-1 items-center justify-between bg-white">
        {renderScreen()}
      </Animated.View>

      
      <View className="absolute bottom-10 left-0 right-0 items-center">
        <CustomButton
          title={isLastScreen ? 'Get Started' : 'Next'}
          className="w-[130px]"
          bgVariant="gray-vibe"
          textVariant="primary"
          onPress={() => isLastScreen
            ? askAgent()
            : setActiveIndex(activeIndex + 1)} 
          // onPress={() => isLastScreen
          //   ? router.replace('/')
          //   : setActiveIndex(activeIndex + 1)} 
          />
      </View>
    </SafeAreaView>
  );
}

// ----------------------------------------------------------------------
// DONT DELETE THIS CODE - UPDATING EACH FIELD TO THE BACKEND
  // const submitField = async (fieldData: any, fieldName: 'location' | 'start' | 'end' | 'group' | 'interests') => {
  //   try {
  //     const response = await axios.post(`${api_url}/trip/submit/${fieldName}/`, { fieldData, user_id: user.id });
  //     console.log(`Step '${fieldName}' submitted successfully:`);
  //     console.log(response.data);
  //   } catch (error) {
  //     console.error(`Error submitting step ${fieldName}:`, error);
  //   }
  // }

 // useEffect(() => {
  //   submitField({ ['location']: selectedCountries }, 'location')
  // }, [form.location]);

  // useEffect(() => {
  //   submitField({ ['start']: startDate }, 'start')
  // }, [form.start]);

  // useEffect(() => {
  //   submitField({ ['end']: endDate }, 'end')
  // }, [form.end]);

  // useEffect(() => {
  //   submitField({ ['end']: endDate }, 'end')
  // }, [form.end]);

  // useEffect(() => {
  //   submitField({ ['group']: group }, 'group')
  // }, [group]);

  // useEffect(() => {
  //   submitField({ ['interests']: interestsList }, 'interests')
  // }, [form.interestsList]);
// ----------------------------------------------------------------------

export default NewPlan;
