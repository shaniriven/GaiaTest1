import { NewTripScreenProps, SectionProps } from "@/types/declarations";
import { addDays, differenceInDays } from "date-fns";
import {
  View,
  Text,
  ScrollView,
  Animated,
  Easing,
  TouchableOpacity,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import BouncyCheckboxClassic from "../BouncyCheckboxClassic";
import DateTimePicker from "@react-native-community/datetimepicker";
import Fontisto from "@expo/vector-icons/Fontisto";
import Ionicons from "@expo/vector-icons/Ionicons";
import BudgetPicker from "../BudgetPicker";
import { DetailsCheckboxes, InterestsSectionType } from "@/types/type";
import {
  defaultDetailsCheckboxes,
  settingsLabels,
  activitiesLabels,
  accommodationLabels,
} from "@/constants/index";

const Interests = ({
  onOptionsChange,
  detailsOptions = defaultDetailsCheckboxes,
}: SectionProps) => {
  //   const [detailsCheckboxes, setDetailsCheckboxes] =
  //     useState<DetailsCheckboxes>(detailsOptions);

  //   const toggleCheckbox = (key: keyof DetailsCheckboxes) => {
  //     setDetailsCheckboxes((prev) => ({
  //       ...prev,
  //       [key]: !prev[key],
  //     }));
  //   };

  //   useEffect(() => {
  //     onOptionsChange(detailsCheckboxes);
  //   }, [detailsCheckboxes]);

  const sections: InterestsSectionType[] = [
    "restaurant and nightlife",
    "entertainment",
    "extreme sports",
    "wellness",
  ];

  const [openSection, setOpenSection] = useState<InterestsSectionType | null>(
    null,
  );

  const animations = useRef<Record<InterestsSectionType, Animated.Value>>({
    "restaurant and nightlife": new Animated.Value(0),
    entertainment: new Animated.Value(0),
    "extreme sports": new Animated.Value(0),
    wellness: new Animated.Value(0),
  }).current;

  const contentHeights = useRef<Record<InterestsSectionType, number>>({
    "restaurant and nightlife": 0,
    entertainment: 0,
    "extreme sports": 0,
    wellness: 0,
  }).current;

  const handleToggle = (section: InterestsSectionType) => {
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

  const renderContent = (section: InterestsSectionType) => {
    switch (section) {
      case "restaurant and nightlife":
        return (
          <View className="flex text-center flex-row flex-wrap justify-center items-center gap-5 mt-10 w-full">
            {activeLabels.map((label, index) => (
              <TabButton
                key={index}
                title={label}
                bgColor="bg-grayTab"
                textColor="text-primary"
                isActive={isLabelIncluded(label)}
                onPress={() => handleSubPress(label)}
                className="mt-2"
                style={{ minWidth: 100, maxWidth: 150, textAlign: "center" }}
              />
            ))}
          </View>
        );
      case "entertainment":
        return (
          <View>
            <Text>2</Text>
          </View>
        );
      case "extreme sports":
        return (
          <View>
            <Text>3</Text>
          </View>
        );
      case "wellness":
        return (
          <View>
            <Text>4</Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View className="flex flex-col  items-center">
      {/* acordion view */}
      {sections.map((section) => (
        <View key={section} className="mb-0 w-[320px]">
          <TouchableOpacity
            onPress={() => handleToggle(section)}
            className={`flex-row justify-between p-3 ${openSection === section ? "opacity-90 rounded-t-xl" : "opacity-100 rounded-xl"}`}
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
                className={`p-3 h-[200px] rounded-b-xl  ${openSection === section ? "opacity-90" : "opacity-100"}`}
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

export default Interests;
