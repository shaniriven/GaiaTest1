import { NewTripScreenProps } from "@/types/declarations";
import { FontAwesome6 } from "@expo/vector-icons";
import Fontisto from "@expo/vector-icons/Fontisto";
import Ionicons from "@expo/vector-icons/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { addDays, differenceInDays, subDays } from "date-fns";
import { useEffect, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import BouncyCheckboxClassic from "../BouncyCheckboxClassic";

const Dates = ({
  startDate = new Date(),
  endDate,
  onChangeStart,
  onChangeEnd,
  handleOptimizedDatesSelect,
  optimizDates = false,
  tripLength = 1,
  setTripLength,
  locationList,
  handleSelect,
}: NewTripScreenProps) => {
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };
  const [tripDeparture, setTripDeparture] = useState(startDate);
  const [tripReturn, setTripReturn] = useState(
    endDate || addDays(tripDeparture, 1),
  );

  const [optimized, setOptimized] = useState(optimizDates);
  const [length, setLength] = useState(tripLength);

  // initial places based on locationList or default to "anywhere"
  const initialPlaces =
    Object.entries(locationList || {}).length > 0
      ? Object.entries(locationList || {}).map(([id, value]) => ({
          id,
          name: value.name,
          startDate: value.startDate || tripDeparture,
          endDate: value.endDate || tripDeparture,
        }))
      : [
          {
            id: "1",
            name: "anywhere",
            startDate: tripDeparture,
            endDate: tripReturn,
          },
        ];

  const [selectedPlaces, setSelectedPlaces] =
    useState<{ id: string; name: string; startDate: Date; endDate: Date }[]>(
      initialPlaces,
    );

  const [destinationNumber, setDestinationNumber] = useState(
    locationList && Object.keys(locationList).length > 0
      ? Object.keys(locationList).length
      : 1,
  );

  // returns trip length based on tripReturn tripDeparture
  const calculateTripLength = () => {
    return Math.round(differenceInDays(tripReturn, tripDeparture) + 1);
  };

  useEffect(() => {
    if (!optimized) setLength(calculateTripLength());
  }, [tripDeparture, tripReturn]);

  useEffect(() => {
    handleOptimizedDatesSelect(optimized);
    if (!optimized) setLength(calculateTripLength());
  }, [optimized]);

  useEffect(() => {
    handleSelect(selectedPlaces);
  }, [selectedPlaces]);

  useEffect(() => {
    setTripLength(length);
  }, [length]);

  const initDaysPerDestination = () => {
    const copiedPlaces = selectedPlaces.map((place) => ({ ...place }));
    for (let i = 0; i < copiedPlaces.length; i++) {
      if (i === 0) {
        copiedPlaces[i].startDate = tripDeparture;
        copiedPlaces[i].endDate = addDays(
          tripDeparture,
          tripLength / destinationNumber,
        );
      } else {
        copiedPlaces[i].startDate = copiedPlaces[i - 1].endDate;
        copiedPlaces[i].endDate = addDays(
          copiedPlaces[i].startDate,
          tripLength / destinationNumber,
        );
      }
    }
    const len = copiedPlaces.length;
    if (copiedPlaces[len - 1].endDate < tripReturn) {
      copiedPlaces[copiedPlaces.length - 1].endDate = tripReturn;
    }
    setSelectedPlaces(copiedPlaces);
  };

  const onChangeDeparture = (event: any, selectedDate: Date | undefined) => {
    const pickedDate = selectedDate || tripDeparture;
    if (tripDeparture < pickedDate) {
      if (differenceInDays(tripReturn, pickedDate) < destinationNumber) {
        setTripReturn(addDays(pickedDate, destinationNumber));
        onChangeEnd(pickedDate);
      }
    }

    setTripDeparture(pickedDate);
    initDaysPerDestination();
    onChangeStart(pickedDate);
  };

  const onChangeReturn = (event: any, selectedDate: Date | undefined) => {
    const pickedDate = selectedDate || tripReturn;
    setTripReturn(pickedDate);
    initDaysPerDestination();
    onChangeEnd(pickedDate);
  };

  const updateDestinationsDates = (
    index: number,
    type: "departure" | "return",
    selectedDate: Date,
  ) => {
    const updated = [...selectedPlaces];
    switch (type) {
      case "departure":
        // Update current startDate
        updated[index].startDate = selectedDate;

        // Step 1: fix previous destinations
        for (let i = index - 1; i >= 0; i--) {
          updated[i].endDate = updated[i + 1].startDate;

          // Ensure previous start is before end
          if (updated[i].startDate >= updated[i].endDate) {
            updated[i].startDate = addDays(updated[i].endDate, -1);
          }
        }
        // Step 2: Fix current endDate if needed
        if (updated[index].endDate <= selectedDate) {
          updated[index].endDate = addDays(selectedDate, 1);
        }
        // Step 3: Fix next destinations
        for (let i = index + 1; i < updated.length; i++) {
          const prev = updated[i - 1];
          const curr = updated[i];

          curr.startDate = new Date(prev.endDate);

          if (curr.endDate <= curr.startDate) {
            curr.endDate = addDays(curr.startDate, 1);
          }

          // If last, cap to trip return
          if (i === updated.length - 1 && curr.endDate > tripReturn) {
            curr.endDate = tripReturn;
          }
        }
        break;
      case "return":
        // Update current endDate
        updated[index].endDate = selectedDate;

        // Step 1: fix previous destinations
        for (let i = index - 1; i >= 0; i--) {
          const next = updated[i + 1];
          updated[i].endDate = new Date(next.startDate);

          if (updated[i].startDate >= updated[i].endDate) {
            updated[i].startDate = addDays(updated[i].endDate, -1);
          }
        }

        // Step 2: Fix current startDate if needed
        if (updated[index].startDate >= selectedDate) {
          updated[index].startDate = subDays(selectedDate, 1);
          updateDestinationsDates(index, "departure", updated[index].startDate);
        }

        // Step 3: Fix next destinations
        for (let i = index + 1; i < updated.length; i++) {
          const prev = updated[i - 1];
          const curr = updated[i];

          curr.startDate = new Date(prev.endDate);

          if (curr.endDate <= curr.startDate) {
            curr.endDate = addDays(curr.startDate, 1);
          }

          // If last, cap to trip return
          if (i === updated.length - 1 && curr.endDate > tripReturn) {
            curr.endDate = tripReturn;
          }
        }
        break;
    }
    setSelectedPlaces(updated);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View className="flex-1 items-center justify-start mt-2 ">
          <Text className="text-2xl font-JakartaBold">
            when would you like to travel?
          </Text>
          <View className="mt-4 w-full items-center">
            <View className="w-[85%] items-center">
              <BouncyCheckboxClassic
                label="pick for me the best time"
                state={optimized}
                setState={setOptimized}
                size={16}
                icon="timeOptimize"
              />
            </View>
          </View>
          {optimized ? (
            <View className="flex items-center w-full">
              {/* input row */}
              <View className="flex flex-row items-center justify-center gap-20 mt-6">
                <View className="flex flex-col items-center justify-center">
                  <Text className="text-lg font-JakartaSemiBold text-center m-2">
                    enter number of days:
                  </Text>
                  {/* minus */}
                  <View className="flex flex-row items-center justify-center gap-2">
                    <TouchableOpacity
                      onPress={() => setLength(length - 1)}
                      disabled={length <= 1}
                    >
                      <FontAwesome6
                        name="minus"
                        size={18}
                        color={length <= 1 ? "#D3D3D3" : "gray"}
                      />
                    </TouchableOpacity>
                    {/* input box */}
                    <TextInput
                      className="rounded-md bg-neutral-100 font-JakartaSemiBold text-xs text-center border w-[100px] h-[32px] border-neutral-300 p-1 mx-4"
                      placeholder={length.toString() || "2"}
                      onChangeText={(newText) => {
                        const num = parseInt(newText, 10);
                        if (!isNaN(num)) setLength(num);
                      }}
                      defaultValue={length.toString()}
                      keyboardType="numeric"
                      maxLength={3}
                    />
                    {/* plus */}
                    <TouchableOpacity onPress={() => setLength(length + 1)}>
                      <FontAwesome6 name="plus" size={18} color={"grey"} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          ) : (
            <View className="flex flex-col items-center w-full mt-4">
              <View className="flex flex-col justify-center gap-3 mt-4">
                {/* Departure */}
                <View className="flex flex-row justify-between items-center px-4 w-[80%]">
                  <Text className="text-xl font-JakartaMedium text-center">
                    departure day:
                  </Text>
                  <DateTimePicker
                    minimumDate={new Date()}
                    themeVariant="light"
                    value={tripDeparture}
                    mode="date"
                    onChange={onChangeDeparture}
                    textColor="black"
                    disabled={optimized} // ios only
                  />
                </View>

                {/* Return */}
                <View className="flex flex-row justify-between items-center  px-4">
                  <Text className="text-xl font-JakartaMedium text-center">
                    return day:
                  </Text>
                  <DateTimePicker
                    minimumDate={tripDeparture}
                    themeVariant="light"
                    value={tripReturn}
                    mode="date"
                    onChange={onChangeReturn}
                    textColor="black"
                    disabled={optimized} // ios only
                  />
                </View>
              </View>
              {/* trip length header */}
              <View className="flex flex-row items-center  mt-6 ">
                <Fontisto name="day-sunny" size={20} color="gray" />
                <Text className="text-base ml-1 font-[Jakarta-Medium] no-underline  text-gray-400 mr-2">
                  {tripLength} days,
                </Text>
                <Ionicons name="moon-outline" size={18} color="gray" />
                <Text className="text-base ml-1 font-[Jakarta-Medium] no-underline  text-gray-400">
                  {tripLength - 1} nights
                </Text>
              </View>

              {/* destinations ScrollView  */}
              <ScrollView
                className="w-full max-h-[300px] mt-4 pt-3 px-5 "
                contentContainerStyle={{ gap: 10 }}
              >
                {selectedPlaces.map((place, index) => {
                  const isLast = index === selectedPlaces.length - 1;
                  const isFirst = index === 0;

                  return (
                    <View
                      key={index}
                      className="bg-[#f5f5f5] p-4 rounded-xl shadow-md w-full"
                    >
                      <Text className="text-lg font-JakartaBold mb-2">
                        {place.name}
                      </Text>
                      {/* destination departure  */}
                      <View className="flex-row justify-between items-center mb-2">
                        <Text className="font-JakartaMedium mr-4">from:</Text>
                        {isFirst ? (
                          <Text className="text-base text-black font-JakartaMedium">
                            {place.startDate.toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </Text>
                        ) : (
                          // </View>
                          <DateTimePicker
                            value={place.startDate}
                            mode="date"
                            minimumDate={tripDeparture}
                            maximumDate={tripReturn}
                            display="default"
                            onChange={(event, date) =>
                              updateDestinationsDates(
                                index,
                                "departure",
                                date || place.startDate,
                              )
                            }
                          />
                        )}
                        {/* <DateTimePicker
                  value={place.startDate}
                  mode="date"
                  minimumDate={getMinDepartureDate(index)}
                  maximumDate={tripReturn}
                  display="default"
                  onChange={(event, date) =>
                    onChangeDestinationDeparture(event, date, index)
                  }
                /> */}
                      </View>
                      {/* destination return */}
                      <View className="flex-row justify-between items-center">
                        <Text className="font-JakartaMedium">to:</Text>
                        {isLast ? (
                          <View className="px-4 py-2 rounded-xl bg-[#eeeeee]">
                            <Text className="text-base text-black">
                              {tripReturn.toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </Text>
                          </View>
                        ) : (
                          <DateTimePicker
                            value={place.endDate}
                            mode="date"
                            minimumDate={tripDeparture}
                            maximumDate={tripReturn} // Add logic if you want to vary this per index
                            display="default"
                            onChange={(event, date) => {
                              if (!date) return;
                              updateDestinationsDates(
                                index,
                                "return",
                                date || place.startDate,
                              );
                            }}
                          />
                        )}
                      </View>
                    </View>
                  );
                })}
                <View className="mt-16" />
              </ScrollView>
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Dates;
