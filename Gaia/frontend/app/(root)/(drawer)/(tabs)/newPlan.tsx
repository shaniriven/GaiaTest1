import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import CustomButton from "@/components/CustomButton";
import TabButton from "@/components/TabButton";
import { screens } from "@/constants/index";
import Location from "@/components/NewTripScreens/Location";
import Animated from "react-native-reanimated";
import {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from "react-native-reanimated";
import axios from "axios";
import config from "@/config";
import { useUser } from "@clerk/clerk-expo";
import Dates from "@/components/NewTripScreens/Dates";
import Travelers from "@/components/NewTripScreens/Travelers";
import MoreSettings from "@/components/NewTripScreens/MoreSettings";
import {
  BudgetOptions,
  DetailsCheckboxes,
  FormFields,
  LocationOptions,
  Locations,
  UserInterestsList,
} from "@/types/type";
import {
  defaultInterestsLabels,
  defaultDetailsCheckboxes,
} from "@/constants/index";

const NewPlan = () => {
  const { user } = useUser();
  const api_url = config.api_url;
  const router = useRouter();

  // -> add loading of exsisting plan instead of always creating a new one
  const [locations, setLocations] = useState<Locations>({});
  const [locationOptions, setLocationOptions] = useState<LocationOptions>({
    multiple: false,
    suggestFlights: false,
    isOptimized: false,
  });

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [optimizedDates, setOptimizedDates] = useState(false);

  const [group, setGroup] = useState({
    adults: 1,
    children: 0,
    total: 1,
    type: "solo",
  });

  const [budget, setBudget] = useState<BudgetOptions>({
    budgetPerNight: false,
    includeMeals: false,
    budgetPerPerson: false,
    range: [0, 200],
  });
  const [details, setDetails] = useState<DetailsCheckboxes>(
    defaultDetailsCheckboxes,
  );
  const [interestsList, setInterestsList] = useState<UserInterestsList>(
    defaultInterestsLabels,
  );
  //

  const [activeIndex, setActiveIndex] = useState(0);
  const isLastScreen = activeIndex === screens.length - 1;

  const [form, setForm] = useState({
    locations: locations,
    multipleDestinations: locationOptions.multiple,
    suggestFlights: locationOptions.suggestFlights,
    isOptimized: locationOptions.isOptimized,
    startDate: startDate,
    endDate: endDate,
    optimizedDates: optimizedDates,
    adults: group.adults,
    children: group.children,
    groupType: group.type,
    budget: budget,
    interestsList: interestsList,
    detailsList: details,
  });

  const translateX = useSharedValue(300);

  useEffect(() => {
    translateX.value = 300;
    translateX.value = withTiming(0, { duration: 1000 });
  }, [activeIndex]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  // handle selection in screens
  // -> location
  const handleSelectLocation = (locations: Locations) => {
    setLocations(locations);
    updateField("locations", locations);
  };
  const handleSelectLocationOptions = (options: LocationOptions) => {
    setLocationOptions(options);
    updateField("multipleDestinations", options.multiple);
    updateField("suggestFlights", options.suggestFlights);
    updateField("isOptimized", options.isOptimized);
  };
  // -> dates
  const onChangeStart = (pickedDate: Date) => {
    setEndDate(pickedDate);
    updateField("endDate", pickedDate);
    setStartDate(pickedDate);
    updateField("startDate", pickedDate);
  };
  const onChangeEnd = (selectedDate?: Date | undefined) => {
    const pickedDate = selectedDate || endDate;
    setEndDate(pickedDate);
    updateField("endDate", pickedDate);
  };
  const handleOptimizedDatesSelect = (optimize: boolean) => {
    setOptimizedDates(optimize);
    updateField("optimizedDates", optimize);
  };
  // -> group
  const handleChangeNumberOfPeople = (adults: number, children: number) => {
    setGroup((prevGroup) => ({
      ...prevGroup,
      adults: adults,
      children: children,
      total: adults + children,
    }));
    updateField("adults", adults);
    updateField("children", children);
  };
  const onChangeGroupType = (value: string) => {
    setGroup((prevGroup) => ({
      ...prevGroup,
      type: value,
    }));
    updateField("groupType", value);
  };

  // -> more settings: budget + trip details + user interests
  const handleMoreSettingsChange = (
    key: "BudgetOptions" | "UserInterestsList" | "DetailsCheckboxes",
    value: BudgetOptions | UserInterestsList | DetailsCheckboxes,
  ) => {
    if (
      key === "BudgetOptions" &&
      typeof value === "object" &&
      "budgetPerNight" in value
    ) {
      setBudget(value as BudgetOptions);
      updateField("budget", value);
    } else if (key === "UserInterestsList") {
      setInterestsList(value as UserInterestsList);
      updateField("interestsList", value);
    } else if (key === "DetailsCheckboxes") {
      setDetails(value as DetailsCheckboxes);
      updateField("detailsList", value);
    }
  };

  const renderScreen = () => {
    switch (activeIndex) {
      case 0:
        return (
          <Location
            handleSelect={handleSelectLocation}
            handleLocationOptionsSelect={handleSelectLocationOptions}
            locationList={locations}
            locationOptions={locationOptions}
          />
        );
      case 1:
        return (
          <Dates
            startDate={startDate}
            endDate={endDate}
            onChangeStart={onChangeStart}
            onChangeEnd={onChangeEnd}
            handleOptimizedDatesSelect={handleOptimizedDatesSelect}
            optimizDates={optimizedDates}
            locationList={locations}
            handleSelect={handleSelectLocation}
          />
        );
      case 2:
        return (
          <Travelers
            handleSelect={handleChangeNumberOfPeople}
            onChangeGroupType={onChangeGroupType}
            currentGroupValue={group}
          />
        );
      case 3:
        return (
          <MoreSettings
            handleSelect={handleMoreSettingsChange}
            budgetOptions={budget}
            detailsCheckboxes={details}
            interestsOptions={interestsList}
          />
        );
      default:
        return null;
    }
  };

  const updateField = (field: FormFields, value: any) => {
    setForm((prevForm) => ({
      ...prevForm,
      [field]: Array.isArray(prevForm[field])
        ? [...prevForm[field], value]
        : value,
    }));
    console.log("Selected place 222:", form);
  };

  const submitForm = async () => {
    try {
      const response = await axios.post(`${api_url}/trip/submitForm/`, {
        form,
        user_id: user.id,
      });
      if (response.status === 200) {
        console.log(
          "newPlan.tsx submitForm(): Form submitted successfully:",
          response.data,
        );
      } else {
        console.error(
          "newPlan.tsx submitForm(): Unexpected response status:",
          response.status,
        );
      }
    } catch (error) {
      console.error(
        "newPlan.tsx submitForm(): Error submitting the form:",
        error,
      );
    }
  };

  const askAgent = async () => {
    submitForm();
    try {
      const response = await axios.post(`${api_url}/trip/askAgent/`, form);
      if (response.status === 200) {
        console.log(
          "newPlan.tsx askAgent(): Agent response:",
          response.data.response,
        ); // Log the response from the backend
      } else {
        console.error(
          "newPlan.tsx askAgent(): Unexpected response status:",
          response.status,
        );
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
          <TabButton
            key={index}
            title={screen.title}
            bgColor="bg-grayTab"
            textColor="text-primary"
            onPress={() => {
              setActiveIndex(index);
            }}
            isActive={activeIndex === index}
          />
        ))}
      </View>

      {/* Animated Screen Content */}
      <Animated.View
        style={animatedStyle}
        className="flex-1 items-center bg-white mt-4"
      >
        {renderScreen()}
      </Animated.View>

      <View className="absolute bottom-[120px] left-0 right-0 items-center">
        <CustomButton
          title={isLastScreen ? "Get Started" : "Next"}
          className="w-[130px]"
          bgVariant="gray-vibe"
          textVariant="primary"
          onPress={() =>
            isLastScreen ? askAgent() : setActiveIndex(activeIndex + 1)
          }
          // onPress={() => isLastScreen
          //   ? router.replace('/')
          //   : setActiveIndex(activeIndex + 1)}
        />
      </View>
    </View>
  );
};

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
