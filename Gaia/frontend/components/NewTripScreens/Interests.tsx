import { SectionProps } from "@/types/declarations";
import {
  View,
  Text,
  Animated,
  Easing,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRef, useState } from "react";
import { UserInterestsList, InterestsSectionType } from "@/types/type";
import { defaultInterestsLabels } from "@/constants/index";
import TabButton from "../TabButton";

const Interests = ({
  onOptionsChange,
  interestsOptions = defaultInterestsLabels,
}: SectionProps) => {
  const [interestsList, setInterestsList] =
    useState<UserInterestsList>(interestsOptions);

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

  const getInterestsByKey = (key: string) => {
    return interestsList.find((item) => item.key === key);
  };

  const isLabelActive = (key: string, label: string): boolean => {
    const category = getInterestsByKey(key);
    return category?.activeLabels.includes(label) ?? false;
  };

  const handleSubPress = (key: string, label: string) => {
    setInterestsList((prev) =>
      prev.map((category) => {
        if (category.key !== key) return category;
        const isActive = isLabelActive(key, label);
        return {
          ...category,
          activeLabels: isActive
            ? category.activeLabels.filter((l) => l !== label)
            : [...category.activeLabels, label],
        };
      }),
    );

    onOptionsChange();
  };
  const renderContent = (section: InterestsSectionType) => {
    switch (section) {
      case "restaurant and nightlife":
        return (
          <View className="flex flex-row flex-wrap justify-center items-start gap-1 w-full ">
            {getInterestsByKey("restaurant and nightlife")?.labels.map(
              (label, index) => (
                <TabButton
                  key={index}
                  title={label}
                  bgColor="bg-[#919191]"
                  textColor="text-primary"
                  activeStyle="bg-[#D2D2D2]"
                  isActive={isLabelActive("restaurant and nightlife", label)}
                  onPress={() =>
                    handleSubPress("restaurant and nightlife", label)
                  }
                  className="mt-2 mx-2"
                  style={{ minWidth: 100, maxWidth: 150, textAlign: "center" }}
                />
              ),
            )}
          </View>
        );
      case "entertainment":
        return (
          <View className="flex flex-row flex-wrap justify-center items-start gap-1 w-full ">
            {getInterestsByKey("entertainment")?.labels.map((label, index) => (
              <TabButton
                key={index}
                title={label}
                bgColor="bg-[#919191]"
                textColor="text-primary"
                activeStyle="bg-[#D2D2D2]"
                isActive={isLabelActive("entertainment", label)}
                onPress={() => handleSubPress("entertainment", label)}
                className="mt-2 mx-2"
                style={{ minWidth: 100, maxWidth: 150, textAlign: "center" }}
              />
            ))}
          </View>
        );
      case "extreme sports":
        return (
          <View className="flex flex-row flex-wrap justify-center items-start gap-1 w-full ">
            {getInterestsByKey("extreme sports")?.labels.map((label, index) => (
              <TabButton
                key={index}
                title={label}
                bgColor="bg-[#919191]"
                textColor="text-primary"
                activeStyle="bg-[#D2D2D2]"
                isActive={isLabelActive("extreme sports", label)}
                onPress={() => handleSubPress("extreme sports", label)}
                className="mt-2 mx-2"
                style={{ minWidth: 100, maxWidth: 150, textAlign: "center" }}
              />
            ))}
          </View>
        );
      case "wellness":
        return (
          <View className="flex flex-row flex-wrap justify-center items-start gap-1 w-full ">
            {getInterestsByKey("wellness")?.labels.map((label, index) => (
              <TabButton
                key={index}
                title={label}
                bgColor="bg-[#919191]"
                textColor="text-primary"
                activeStyle="bg-[#D2D2D2]"
                isActive={isLabelActive("wellness", label)}
                onPress={() => handleSubPress("wellness", label)}
                className="mt-2 mx-2"
                style={{ minWidth: 100, maxWidth: 150, textAlign: "center" }}
              />
            ))}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{
        alignItems: "center",
        flexDirection: "column",
      }}
      className="top-0"
    >
      {/* acordion view */}
      {sections.map((section) => (
        <View key={section} className="mb-0 w-[320px]">
          <TouchableOpacity
            onPress={() => handleToggle(section)}
            className={`flex-row justify-between p-3 ${openSection === section ? "opacity-70 rounded-t-xl" : "opacity-100 rounded-xl"}`}
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
                  outputRange: [0, 150],
                }),
              }}
            >
              <View
                className={`p-3 rounded-b-xl  ${openSection === section ? "opacity-90" : "opacity-100"}`}
              >
                {renderContent(section)}
              </View>
            </Animated.View>
          )}
        </View>
      ))}
    </ScrollView>
  );
};

export default Interests;
