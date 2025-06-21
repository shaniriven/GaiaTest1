import { NewTripScreenProps } from "@/types/declarations";
import {
  Keyboard,
  View,
  Text,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useEffect, useState } from "react";
import BouncyCheckboxClassic from "../BouncyCheckboxClassic";
import GooglePlacesInput from "../GooglePlaceInput";
import { LocationOptions } from "@/types/type";

const Location = ({
  handleSelect,
  handleLocationOptionsSelect,
  locationList = {},
  locationOptions = {
    multiple: false,
    suggestFlights: false,
    isOptimized: false,
  },
}: NewTripScreenProps) => {
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const initialPlaces = Object.entries(locationList).map(([id, value]) => ({
    id,
    name: value.name,
  }));

  const [selectedPlaces, setSelectedPlaces] =
    useState<{ id: string; name: string }[]>(initialPlaces);

  const [options, setOptions] = useState<LocationOptions>({
    multiple: locationOptions.multiple,
    suggestFlights: locationOptions.suggestFlights,
    isOptimized: locationOptions.isOptimized,
  });

  useEffect(() => {
    handleLocationOptionsSelect(options);
  }, [options]);

  useEffect(() => {
    handleSelect(selectedPlaces);
  }, [selectedPlaces]);

  const handlePlaceSelect = (place: { id: string; name: string }) => {
    if (selectedPlaces.length >= 8) {
      Alert.alert("Limit reached", "You can select up to 8 destinations.");
      return;
    }
    if (!selectedPlaces.find((p) => p.id === place.id)) {
      setSelectedPlaces((prev) => [...prev, place]);
    }
  };

  const handleRemovePlace = (id: string) => {
    setSelectedPlaces((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View className="flex items-center mt-2 ">
        <Text className="text-2xl font-JakartaBold">
          select your destination
        </Text>
        <KeyboardAvoidingView
          className="flex items-center w-[100%] z-0 mt-5"
          behavior={Platform.OS === "ios" ? "position" : "height"}
          keyboardVerticalOffset={250}
        >
          <View className="flex items-center mt-2">
            <BouncyCheckboxClassic
              label="multiple destinations"
              state={options.multiple}
              setState={(value: boolean) => {
                setOptions((prev) => ({ ...prev, multiple: value }));
              }}
            />
          </View>
          <View className="flex items-center mt-3">
            <BouncyCheckboxClassic
              label="suggest flights"
              state={options.suggestFlights}
              setState={(value: boolean) => {
                setOptions((prev) => ({ ...prev, suggestFlights: value }));
              }}
            />
          </View>
          <View className="flex items-center mt-3 mb-16">
            <BouncyCheckboxClassic
              label="optimize route"
              state={options.isOptimized}
              setState={(value: boolean) => {
                setOptions((prev) => ({ ...prev, isOptimized: value }));
              }}
            />
          </View>
          <View className="flex w-[90%] flex-row flex-start z-50">
            <GooglePlacesInput handleSelect={handlePlaceSelect} />
          </View>
        </KeyboardAvoidingView>
        <View className=" flex items-center">
          <View className="flex flex-row flex-wrap justify-start items-center gap-2 mt-7 w-full z-0">
            {selectedPlaces.map((place) => (
              <View
                key={place.id}
                className="flex-row items-center bg-tabs-100 px-3 py-1 rounded-full mr-2 mb-2 border-[0.5px] border-gaiaGreen-100"
              >
                <Text className="text-md font-JakartaMedium text-white mr-3">
                  {place.name}
                </Text>
                <TouchableOpacity onPress={() => handleRemovePlace(place.id)}>
                  <Text className="text-white text-lg">×</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Location;
