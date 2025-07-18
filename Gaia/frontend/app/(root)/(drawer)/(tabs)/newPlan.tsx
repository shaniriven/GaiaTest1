import CustomButton from "@/components/CustomButton";
import Dates from "@/components/NewTripScreens/Dates";
import Location from "@/components/NewTripScreens/Location";
import MoreSettings from "@/components/NewTripScreens/MoreSettings";
import Travelers from "@/components/NewTripScreens/Travelers";
import ScreenHeader from "@/components/ScreenHeader";
import TabButton from "@/components/TabButton";
import config from "@/config";
import {
  defaultDetailsCheckboxes,
  defaultInterestsLabels,
  screens,
} from "@/constants/index";
import {
  BudgetOptions,
  DetailsCheckboxes,
  LocationOptions,
  Locations,
  UserInterestsList,
} from "@/types/type";
import { useUser } from "@clerk/clerk-expo";
import axios from "axios";
import { addDays } from "date-fns";
import { usePathname, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
const NewPlan = () => {
  const { user } = useUser();
  const api_url = config.api_url;
  const router = useRouter();
  const [resetTrigger, setResetTrigger] = useState(0);
  const [loading, setLoading] = useState(false);
  const [locations, setLocations] = useState<Locations>({});
  const [locationOptions, setLocationOptions] = useState<LocationOptions>({
    anywhere: false,
    suggestFlights: false,
  });

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(addDays(new Date(), 1));
  const [optimizedDates, setOptimizedDates] = useState(false);
  const [tripLength, setTripLength] = useState(1);

  const [group, setGroup] = useState({
    adults: 1,
    children: 0,
    total: 1,
    type: "solo",
  });

  const [budget, setBudget] = useState<BudgetOptions>({
    includeMeals: false,
    range: [100, 1000],
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

  const translateX = useSharedValue(300);
  const pathname = usePathname();
  // useEffect(() => {
  //   if (pathname === "/newPlan") {
  //     setActiveIndex(0);
  //     reset("all");
  //   }
  // }, [pathname]);
  useEffect(() => {
    translateX.value = 300;
    translateX.value = withTiming(0, { duration: 1000 });
  }, [activeIndex]);

  useEffect(() => {
    console.log("NewPlan.tsx useEffect: tripLength changed to", tripLength);
  }, [tripLength]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  // const resetAllScreens = () => {
  //   resetAll();
  //   setResetTrigger((prev) => prev + 1); // forces all children to reset
  // };

  // const resetAll = () => {
  //   setLocations({});
  //   setLocationOptions({ anywhere: false, suggestFlights: false });
  //   setStartDate(new Date());
  //   setEndDate(addDays(new Date(), 1));
  //   setOptimizedDates(false);
  //   setGroup({ adults: 1, children: 0, total: 1, type: "solo" });
  //   setBudget({
  //     budgetPerNight: false,
  //     includeMeals: false,
  //     budgetPerPerson: false,
  //     range: [0, 200],
  //   });
  //   setDetails(defaultDetailsCheckboxes);
  //   setInterestsList(defaultInterestsLabels);
  //   setActiveIndex(0);
  // };

  // handle selection in screens
  // const reset = (field: string) => {
  //   switch (field) {
  //     case "Locations":
  //       setLocations({});
  //       break;

  //     case "all":
  //       resetAll();
  //       break;

  //     default:
  //       break;
  //   }
  // };
  // -> location

  // const calculateTripLength = (): number => {
  // if (optimizedDates) {
  //   return tripLength;
  // } else {
  //   const values = Object.values(locations);
  //   if (values.length === 0) return 0;
  //   // Sort by startDate to find first and last
  //   const sortedByStart = [...values].sort(
  //     (a, b) =>
  //       new Date(a.startDate || 0).getTime() -
  //       new Date(b.startDate || 0).getTime(),
  //   );
  //   const sortedByEnd = [...values].sort(
  //     (a, b) =>
  //       new Date(b.endDate || 0).getTime() -
  //       new Date(a.endDate || 0).getTime(),
  //   );
  //   const firstStart = sortedByStart[0].startDate;
  //   const lastEnd = sortedByEnd[0].endDate;
  //   if (!firstStart || !lastEnd) return 0;
  //   return differenceInDays(new Date(lastEnd), new Date(firstStart)) + 1;
  // }
  // };

  const handleSelectLocation = (locations: Locations) => {
    console.log("newPlan.tsx handleSelectLocation:", locations);
    setLocations(locations);
  };

  const handleSelectLocationOptions = (options: LocationOptions) => {
    // if (options.anywhere) {
    //   reset("Locations");
    // }
    setLocationOptions(options);
  };

  // -> dates
  const onChangeStart = (pickedDate: Date) => {
    setStartDate(pickedDate);
  };

  const onChangeEnd = (pickedDate: Date) => {
    setEndDate(pickedDate);
  };

  const handleOptimizedDatesSelect = (optimize: boolean) => {
    setOptimizedDates(optimize);
  };

  const handleTripLengthChange = (length: number) => {
    setTripLength(length);
  };

  // -> group
  const handleChangeNumberOfPeople = (adults: number, children: number) => {
    setGroup((prevGroup) => ({
      ...prevGroup,
      adults: adults,
      children: children,
      total: adults + children,
    }));
  };

  const onChangeGroupType = (value: string) => {
    setGroup((prevGroup) => ({
      ...prevGroup,
      type: value,
    }));
  };

  // -> more settings: budget + trip details + user interests
  const handleMoreSettingsChange = (
    key: "BudgetOptions" | "UserInterestsList" | "DetailsCheckboxes",
    value: BudgetOptions | UserInterestsList | DetailsCheckboxes,
  ) => {
    if (key === "BudgetOptions" && typeof value === "object") {
      setBudget(value as BudgetOptions);
    } else if (key === "UserInterestsList") {
      setInterestsList(value as UserInterestsList);
    } else if (key === "DetailsCheckboxes") {
      setDetails(value as DetailsCheckboxes);
    }
  };

  const renderScreen = () => {
    if (loading) {
      return (
        <View className="flex-1 justify-center items-center bg-white">
          <ActivityIndicator size="large" color="#13875B" />
          <ScreenHeader text={"creating your new trip"} />
        </View>
      );
    }
    switch (activeIndex) {
      case 0:
        return (
          <Location
            handleSelect={handleSelectLocation}
            handleLocationOptionsSelect={handleSelectLocationOptions}
            locationList={locations}
            locationOptions={locationOptions}
            resetTrigger={resetTrigger}
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
            tripLength={tripLength}
            setTripLength={handleTripLengthChange}
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

  // const submitForm = async () => {
  //   const interestsKeysAndActiveLabels = defaultInterestsLabels.map(
  //     ({ key, activeLabels }) => ({
  //       key,
  //       activeLabels,
  //     }),
  //   );
  //   try {
  //     const response = await axios.post(`${api_url}/trip/submitFormData/`, {
  //       locations,
  //       locationOptions,
  //       startDate,
  //       endDate,
  //       optimizedDates,
  //       tripLength,
  //       group,
  //       budget,
  //       details,
  //       interestsKeysAndActiveLabels,
  //       user_id: user?.id,
  //     });
  //     if (response.status === 200) {
  //       console.log(
  //         "newPlan.tsx submitForm(): Form submitted successfully:",
  //         response.data,
  //       );
  //     } else {
  //       console.error(
  //         "newPlan.tsx submitForm(): Unexpected response status:",
  //         response.status,
  //       );
  //     }
  //   } catch (error) {
  //     console.error(
  //       "newPlan.tsx submitForm(): Error submitting the form:",
  //       error,
  //     );
  //   }
  // };

  const askAgent = async () => {
    setLoading(true);
    try {
      //submitForm();
      const interests_keys_activeLavels = defaultInterestsLabels.map(
        ({ key, activeLabels }) => ({
          key,
          activeLabels,
        }),
      );
      const response = await axios.post(`${api_url}/trip/askAgent/`, {
        locations,
        locationOptions,
        startDate,
        endDate,
        optimizedDates,
        tripLength,
        group,
        budget,
        details,
        user_id: user?.id,
      });
      if (response.status === 200) {
        setLoading(false);
        console.log("newPlan.tsx askAgent(): Agent response:", response.data); // Log the response from the backend
        router.push(
          `/(plans)/${response.data.id}?name=${response.data.name}&pickedName=false`,
        );
      } else {
        console.error(
          "newPlan.tsx askAgent(): Unexpected response status:",
          response.status,
        );
      }
    } catch (error) {
      console.error("newPlan.tsx askAgent(): Error asking agent:", error);
    }
  };

  return (
    <View className="flex-1 bg-white p-5">
      <View className="flex flex-row flex-wrap gap-4 justify-between mb-5 mt-3 z-500">
        {/* Tab Buttons */}
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
        {!loading && (
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
        )}
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
