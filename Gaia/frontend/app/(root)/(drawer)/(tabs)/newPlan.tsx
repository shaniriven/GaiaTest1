/* eslint-disable prettier/prettier */
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import CustomButton from "@/components/CustomButton";
import ScreenHeader from "@/components/ScreenHeader";
import TabButton from "@/components/TabButton";
import { screens } from "@/constants/index";
import Location from "@/components/NewTripScreens/Location";
import DatesScreen from "@/components/NewTripScreens/DatesScreen";
import TravelersScreen from "@/components/NewTripScreens/TravelersScreen";
import InterestScreen from "@/components/NewTripScreens/InterestsScreen";
import Animated from 'react-native-reanimated';
import { useSharedValue, withTiming, useAnimatedStyle } from 'react-native-reanimated';
import axios from 'axios';
import config from '@/config';
import { useUser } from "@clerk/clerk-expo";
import Dates from "@/components/NewTripScreens/Dates";
import Travelers from "@/components/NewTripScreens/Travelers";
import MoreSettings from "@/components/NewTripScreens/MoreSettings";

const NewPlan = () => {
  // fake budget data 

  const [budget, setBudget] = useState<BudgetOptions>({
    budgetPerNight: true,
    includeMeals: true,
    budgetPerPerson: false,
  })

  //////////////////////////////////////
  const { user } = useUser();
  const api_url = config.api_url;
  const router = useRouter();

  const [activeIndex, setActiveIndex] = useState(0);
  const isLastScreen = activeIndex === screens.length - 1;

  const [locations, setLocations] = useState<Locations>({});
  const [locationOptions, setLocationOptions] = useState<LocationOptions>({
    multiple: false,
    suggestFlights: false,
    isOptimized: false,
  });

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [optimizedDates, setOptimizedDates] = useState(false);
  const [group, setGroup] = useState({ adults: 1, children: 0, total: 1, type: 'solo' });
  const [interestsList, setInterestsList] = useState<UserInterestesSelections>({
    'Food & Drinks': ['Restaurants'],
    'Music & Concerts': ['Concerts'],
  });

  const [form, setForm] = useState(
    {
      start: startDate,
      end: endDate,
      optimizedDates: optimizedDates,
      location: locations,
      groupType: group.type,
      adults: group.adults,
      children: group.children,
      interestsList: interestsList,
      multipleDestinations: locationOptions.multiple,
      suggestFlights: locationOptions.suggestFlights,
      isOptimized: locationOptions.isOptimized,

    }
  );

  const translateX = useSharedValue(300);

  useEffect(() => {
    translateX.value = 300;
    translateX.value = withTiming(0, { duration: 1000 });
  }, [activeIndex]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));


  const renderScreen = () => {
    switch (activeIndex) {
      case 0:
        return <Location handleSelect={handleSelectLocation} handleLocationOptionsSelect={handleSelectLocationOptions} locationList={locations} locationOptions={locationOptions} />;
      case 1:
        return <Dates startDate={startDate} endDate={endDate} onChangeStart={onChangeStart} onChangeEnd={onChangeEnd} handleOptimizedDatesSelect={handleOptimizedDatesSelect} optimizDates={optimizedDates} locationList={locations}/>;
      case 2:
        return <Travelers handleSelect={handleChangeNumberOfPeople} onChangeGroupType={onChangeGroupType} currentGroupValue={group} />;
      case 3:
        return <MoreSettings handleSelect={onChangeInterests} userInterests={interestsList} budgetOptions={budget} />;
      default:
        return null;
    }
  };

  // type FormFields = 'start' | 'end' | 'location' | 'groupType' | 'adults' | 'children' | 'interestsList' | 'includeRestaurants' | 'includeFlights';

  const updateField = (field: FormFields, value: any) => {
    setForm((prevForm) => ({
      ...prevForm,
      [field]: Array.isArray(prevForm[field]) ? [...prevForm[field], value] : value,
    }));
    console.log('Selected place 222:', form);
  };

  const handleSelectLocationOptions = (options: LocationOptions) => {
    setLocationOptions(options);
    updateField('multipleDestinations', options.multiple);
    updateField('suggestFlights', options.suggestFlights);
    updateField('isOptimized', options.isOptimized);
  }

  const handleSelectLocation = (locations: Locations) => {
    setLocations(locations);
    updateField('location', locations)
  }
  
  const handleOptimizedDatesSelect = (optimize: boolean) => {
    setOptimizedDates(optimize);
    updateField('optimizedDates', optimize);
  }

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


  const onChangeStart = (pickedDate: Date) => {
    setEndDate(pickedDate);
    updateField('end', pickedDate)
    setStartDate(pickedDate);
    updateField('start', pickedDate)
  };

  const onChangeEnd = (selectedDate?: Date | undefined) => {
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
    <View className="flex-1 bg-white p-5">

      {/* Tab Buttons */}
      <View className="flex flex-row flex-wrap gap-4 justify-between mb-5 mt-3 z-500">
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
      <Animated.View style={animatedStyle} className="flex-1 items-center bg-white mt-4">
        {renderScreen()}
      </Animated.View>


      <View className="absolute bottom-[120px] left-0 right-0 items-center">
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
    </View>
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
