import { NewTripScreenProps } from "@/types/declarations";
import {
  Keyboard,
  View,
  Text,
  TouchableWithoutFeedback,
  Animated,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
  Easing,
} from "react-native";
import { useEffect, useState, useRef } from "react";
import { DetailsCheckboxes, SectionType, BudgetOptions } from "@/types/type";
import Budget from "./Budget";
import Details from "./Details";
import { defaultDetailsCheckboxes } from "@/constants/index";
import Interests from "./Interests";

const MoreSettings = ({
  handleSelect,
  detailsCheckboxes = defaultDetailsCheckboxes,
  budgetOptions = {
    budgetPerNight: false,
    includeMeals: false,
    budgetPerPerson: false,
    range: [0, 200],
  },
}: NewTripScreenProps) => {
  const sections: SectionType[] = [
    "budget",
    "trip details and content",
    "personal interests",
  ];
  const [openSection, setOpenSection] = useState<SectionType | null>(null);
  const [options, setBudgetOptions] = useState<BudgetOptions>({
    budgetPerNight: budgetOptions.budgetPerNight,
    includeMeals: budgetOptions.includeMeals,
    budgetPerPerson: budgetOptions.budgetPerPerson,
    range: budgetOptions.range,
  });
  const [checkboxSelection, setcheckboxSelection] =
    useState<DetailsCheckboxes>(detailsCheckboxes);

  const saveCheckboxesSelection = (details: DetailsCheckboxes) => {
    setcheckboxSelection(details);
  };
  const animations = useRef<Record<SectionType, Animated.Value>>({
    budget: new Animated.Value(0),
    "trip details and content": new Animated.Value(0),
    "personal interests": new Animated.Value(0),
  }).current;

  const contentHeights = useRef<Record<SectionType, number>>({
    budget: 0,
    "trip details and content": 0,
    "personal interests": 0,
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

  const handleBudgetOptionsChange = (options: BudgetOptions) => {
    setBudgetOptions(options);
    console.log(options.range);
  };

  const renderContent = (section: SectionType) => {
    switch (section) {
      case "budget":
        return (
          <Budget
            budgetOptions={options}
            onOptionsChange={handleBudgetOptionsChange}
          />
        );
      case "trip details and content":
        return <Details onOptionsChange={saveCheckboxesSelection} />;
      case "personal interests":
        return <Interests onOptionsChange={saveCheckboxesSelection} />;
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
        <View key={section} className="mb-0 w-[320px]">
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
            <Text className="text-white text-base mr-2">
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
                  outputRange: [0, contentHeights[section] || 1],
                }),
              }}
            >
              <View
                className={`p-3 h-[300px] rounded-b-xl ${
                  section === "budget"
                    ? "bg-cardsGreen-100"
                    : section === "trip details and content"
                      ? "bg-cardsGreen-200"
                      : section === "personal interests"
                        ? "bg-cardsGreen-300"
                        : "bg-gray-500"
                } ${openSection === section ? "opacity-90" : "opacity-100"}`}
                onLayout={(event) => {
                  const height = event.nativeEvent.layout.height;
                  contentHeights[section] = height;
                }}
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
