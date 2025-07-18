import {
  defaultDetailsCheckboxes,
  defaultInterestsLabels,
} from "@/constants/index";
import { NewTripScreenProps } from "@/types/declarations";
import {
  BudgetOptions,
  DetailsCheckboxes,
  SectionType,
  UserInterestsList,
} from "@/types/type";
import { useEffect, useRef, useState } from "react";
import { Animated, Easing, Text, TouchableOpacity, View } from "react-native";
import Budget from "./Budget";
import Details from "./Details";
import Interests from "./Interests";

const MoreSettings = ({
  handleSelect,
  detailsCheckboxes = defaultDetailsCheckboxes,
  interestsOptions = defaultInterestsLabels,
  budgetOptions = {
    includeMeals: false,
    range: [100, 1000],
  },
}: Omit<NewTripScreenProps, "handleSelect"> & {
  handleSelect: (
    key: "BudgetOptions" | "UserInterestsList" | "DetailsCheckboxes",
    value: BudgetOptions | UserInterestsList | DetailsCheckboxes,
  ) => void;
}) => {
  const sections: SectionType[] = [
    "budget",
    "trip details and content",
    "personal interests",
  ];
  const [openSection, setOpenSection] = useState<SectionType | null>(null);
  const [budget, setBudgetOptions] = useState<BudgetOptions>({
    includeMeals: budgetOptions.includeMeals,
    range: budgetOptions.range,
  });
  const [checkboxSelection, setcheckboxSelection] =
    useState<DetailsCheckboxes>(detailsCheckboxes);
  const [interestsList, setInterestsList] =
    useState<UserInterestsList>(interestsOptions);
  const animations = useRef<Record<SectionType, Animated.Value>>({
    budget: new Animated.Value(0),
    "trip details and content": new Animated.Value(0),
    "personal interests": new Animated.Value(0),
  }).current;

  const handleToggle = (section: SectionType) => {
    if (openSection === section) {
      Animated.timing(animations[section], {
        toValue: 0,
        duration: 400,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }).start(() => setOpenSection(null));
    } else {
      // Close current open section first
      if (openSection !== null) {
        Animated.timing(animations[openSection], {
          toValue: 0,
          duration: 400,
          easing: Easing.out(Easing.ease),
          useNativeDriver: false,
        }).start(() => {
          setOpenSection(section);
          Animated.timing(animations[section], {
            toValue: 1,
            duration: 400,
            easing: Easing.out(Easing.ease),
            useNativeDriver: false,
          }).start();
        });
      } else {
        setOpenSection(section);
        Animated.timing(animations[section], {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.ease),
          useNativeDriver: false,
        }).start();
      }
    }
  };

  // fix form
  // -> budget
  useEffect(() => {
    handleSelect("BudgetOptions", budget);
  }, [budget]);

  const handleBudgetOptionsChange = (options: BudgetOptions) => {
    setBudgetOptions(options);
    handleSelect("BudgetOptions", options);
  };

  // -> details
  useEffect(() => {
    handleSelect("DetailsCheckboxes", checkboxSelection);
  }, [checkboxSelection]);

  const saveCheckboxesSelection = (details: DetailsCheckboxes) => {
    setcheckboxSelection(details);
  };
  // -> interests
  useEffect(() => {
    handleSelect("UserInterestsList", interestsList);
  }, [interestsList]);

  const saveInterestsSelection = (interests: UserInterestsList) => {
    setInterestsList(interests);
  };

  const renderContent = (section: SectionType) => {
    switch (section) {
      case "budget":
        return (
          <Budget
            budgetOptions={budget}
            onOptionsChange={handleBudgetOptionsChange}
          />
        );
      case "trip details and content":
        return (
          <Details
            detailsOptions={checkboxSelection}
            onOptionsChange={saveCheckboxesSelection}
          />
        );
      case "personal interests":
        return (
          <Interests
            interestsOptions={interestsOptions}
            onOptionsChange={saveInterestsSelection}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View className="flex-1 items-center mt-2 ">
      <View className="flex items-center mb-7">
        <Text className="text-xl font-JakartaMedium text-center">
          add additional info to plan your ideal trip
        </Text>
      </View>
      {/* acordion view */}
      {sections.map((section) => (
        <View key={section} className="flex mb-0 w-[320px]">
          <TouchableOpacity
            onPress={() => handleToggle(section)}
            className={`flex-row justify-between p-3 ${
              section === "budget"
                ? "bg-cardsGreen-100"
                : section === "trip details and content"
                  ? "bg-cardsGreen-200"
                  : section === "personal interests"
                    ? "bg-cardsGreen-300"
                    : "bg-gray-500"
            } ${openSection === section ? "opacity-90 rounded-t-xl" : "opacity-100 rounded-xl"}`}
          >
            <Text className="text-xl text-white text-base font-JakartaLight">
              {section}
            </Text>
            <Text className="text-white text-base mr-2 text-lg">
              {openSection === section ? "✓" : "+"}
            </Text>
          </TouchableOpacity>

          {/* Animated view for content */}
          {openSection === section && (
            <Animated.View
              style={{
                overflow: "hidden",
                height: animations[section].interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 190],
                }),
              }}
            >
              <View
                className={`p-3 bg-black rounded-b-xl ${
                  section === "budget"
                    ? "bg-cardsGreen-100 "
                    : section === "trip details and content"
                      ? "bg-cardsGreen-200 "
                      : section === "personal interests"
                        ? "bg-cardsGreen-300"
                        : "bg-gray-500"
                } ${openSection === section ? "opacity-90" : "opacity-100"}`}
              >
                {renderContent(section)}
              </View>
            </Animated.View>
          )}
        </View>
      ))}
    </View>
  );
};
export default MoreSettings;
