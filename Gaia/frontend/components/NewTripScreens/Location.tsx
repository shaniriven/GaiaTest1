import { useReset } from "@/contexts/ResetContext";
import { NewTripScreenProps } from "@/types/declarations";
import { LocationOptions } from "@/types/type";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import BouncyCheckboxClassic from "../BouncyCheckboxClassic";
import GooglePlacesInput from "../GooglePlaceInput";

const Location = ({
  handleSelect,
  handleLocationOptionsSelect,
  locationList = {},
  locationOptions = {
    anywhere: false,
    suggestFlights: true,
  },
}: NewTripScreenProps) => {
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };
  const { resetTrigger } = useReset();

  const initialPlaces = Object.entries(locationList).map(([id, value]) => ({
    id,
    name: value.name,
    startDate: new Date(),
    endDate: new Date(),
  }));

  const [selectedPlaces, setSelectedPlaces] =
    useState<{ id: string; name: string }[]>(initialPlaces);

  const [options, setOptions] = useState<LocationOptions>({
    anywhere: locationOptions.anywhere,
    suggestFlights: locationOptions.suggestFlights,
  });

  const hasMounted = useRef(false);

  useEffect(() => {
    if (hasMounted.current) {
      setSelectedPlaces([]);
      setOptions({
        anywhere: false,
        suggestFlights: true,
      });
    } else {
      hasMounted.current = true;
    }
  }, [resetTrigger]);

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
    <KeyboardAvoidingView
      className="flex-1 w-[100%] items-center"
      behavior={Platform.OS === "ios" ? "position" : "height"}
      keyboardVerticalOffset={100} // <-- Adjust this value as needed for keyboard avoiding
    >
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View className="flex-1 items-center mt-2 mb-2 w-[90%]">
          <Text className="text-2xl font-JakartaBold mb-7">
            select your destination
          </Text>
          <View className="flex items-center">
            <BouncyCheckboxClassic
              label="anywhere"
              state={options.anywhere}
              setState={(value: boolean) => {
                setOptions((prev) => ({ ...prev, anywhere: value }));
                if (value) {
                  setSelectedPlaces([]); // Clear selected places when "anywhere" is selected
                }
              }}
              icon="anywhere"
            />
          </View>
          <View className="flex items-center mt-3">
            <BouncyCheckboxClassic
              label="suggest flights"
              state={options.suggestFlights}
              setState={(value: boolean) => {
                setOptions((prev) => ({ ...prev, suggestFlights: value }));
              }}
              icon="flights"
            />
          </View>
          {!locationOptions?.anywhere && (
            <View className="flex flex-row z-50 mt-24">
              <GooglePlacesInput
                handleSelect={handlePlaceSelect}
                locationOptions={options}
              />
            </View>
          )}
          <View className="flex flex-row flex-wrap justify-start items-center gap-2 mt-7 z-0">
            {selectedPlaces.map(
              (place) =>
                place.name !== "anywhere" && (
                  <View
                    key={place.id}
                    className="flex-row items-center bg-tabs-100 px-3 py-1 rounded-full mr-2 mb-2 border-[0.5px] border-gaiaGreen-100"
                  >
                    <Text className="text-md font-JakartaMedium text-white mr-3">
                      {place.name}
                    </Text>
                    <TouchableOpacity
                      onPress={() => handleRemovePlace(place.id)}
                    >
                      <Text className="text-white text-lg">×</Text>
                    </TouchableOpacity>
                  </View>
                ),
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Location;
