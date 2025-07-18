import { NewTripScreenProps } from "@/types/declarations";
import { addDays, differenceInDays } from "date-fns";
import { View, Text, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import BouncyCheckboxClassic from "../BouncyCheckboxClassic";
import DateTimePicker from "@react-native-community/datetimepicker";
import Fontisto from "@expo/vector-icons/Fontisto";
import Ionicons from "@expo/vector-icons/Ionicons";

const Dates = ({
  startDate,
  endDate,
  onChangeStart,
  onChangeEnd,
  handleOptimizedDatesSelect,
  optimizDates = false,
  locationList,
  handleSelect,
}: NewTripScreenProps) => {
  const [tripDeparture, setTripDeparture] = useState(startDate || new Date());
  const [tripReturn, setTripReturn] = useState(
    endDate || addDays(tripDeparture, 1),
  );

  const [optimized, setOptimized] = useState(optimizDates);
  const initialPlaces = Object.entries(locationList || {}).map(
    ([id, value]) => ({
      id,
      name: value.name,
      startDate: value.startDate || tripDeparture,
      endDate: value.endDate || tripDeparture,
    }),
  );
  const [destinationNumber, setDestinationNumber] = useState(
    Object.keys(locationList || {}).length || 1,
  );

  const [selectedPlaces, setSelectedPlaces] =
    useState<{ id: string; name: string; startDate: Date; endDate: Date }[]>(
      initialPlaces,
    );

  useEffect(() => {
    handleSelect(selectedPlaces);
  }, [selectedPlaces]);

  // returns trip length based on tripReturn tripDeparture
  const calculateTripLength = () => {
    return Math.round(differenceInDays(tripReturn, tripDeparture) + 1);
  };

  const [tripLength, setTripLength] = useState(calculateTripLength());

  useEffect(() => {
    setTripLength(calculateTripLength());
    initDaysPerDestination();
  }, [tripDeparture, tripReturn]);

  useEffect(() => {
    handleOptimizedDatesSelect(optimized);
  }, [optimized]);

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

  const onChangeDestinationDeparture = (
    event: any,
    selectedDate: Date | undefined,
    index: number,
  ) => {};

  const getMinDepartureDate = (index: number) => {
    if (index === 0) return tripDeparture;
    return selectedPlaces[index - 1].endDate;
  };

  return (
    <View className="flex items-center mt-2 ">
      <Text className="text-2xl font-JakartaBold">when is your trip?</Text>

      <View className="flex flex-col justify-center gap-4 mt-6">
        {/* Departure */}
        <View className="flex flex-row justify-between items-center  px-4">
          <Text className="text-xl font-JakartaMedium text-center">
            departure day:
          </Text>
          <View className="flex flex-col justify-center">
            <DateTimePicker
              minimumDate={new Date()}
              themeVariant="light"
              value={tripDeparture}
              mode="date"
              onChange={onChangeDeparture}
              textColor="black"
            />
          </View>
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
          />
        </View>
      </View>
      <View className="flex flex-row justify-between items-center  px-4">
        <View className="flex ml-12 mt-6 items-center w-[100%] z-0">
          <BouncyCheckboxClassic
            label="optimize dates for each destination"
            state={optimized}
            setState={setOptimized}
            size={16}
          />
        </View>
      </View>
      {/* trip length header */}
      <View className="flex flex-row items-center w-[80%] mt-6 ">
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
        {selectedPlaces.map((place, index) => (
          <View key={index} className="bg-[#f5f5f5] p-4 rounded-xl shadow-md">
            <Text className="text-lg font-JakartaBold mb-2">{place.name}</Text>
            {/* destination departure  */}
            <View className="flex-row justify-between items-center mb-2">
              <Text className="font-JakartaMedium">departure:</Text>
              <DateTimePicker
                value={place.startDate}
                mode="date"
                minimumDate={getMinDepartureDate(index)}
                maximumDate={tripReturn}
                display="default"
                onChange={(event, date) =>
                  onChangeDestinationDeparture(event, date, index)
                }
              />
            </View>
            {/* destination return */}
            <View className="flex-row justify-between items-center">
              <Text className="font-JakartaMedium">return:</Text>
              <DateTimePicker
                value={place.endDate}
                mode="date"
                minimumDate={place.startDate}
                maximumDate={tripReturn}
                display="default"
                onChange={(event, date) => {
                  if (!date) return;
                  const newDestinations = [...selectedPlaces];
                  newDestinations[index].endDate = date;
                  setSelectedPlaces(newDestinations);
                }}
              />
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default Dates;
