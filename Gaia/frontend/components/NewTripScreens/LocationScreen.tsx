/* eslint-disable prettier/prettier */
import { View, FlatList, Text } from "react-native";
import Flag from "react-native-flags";
import CountrySearchBar from "../CountrySearchBar";
import { NewTripScreenProps } from "@/declarations";

const LocationScreen = ({ handleSelect, currentValue }: NewTripScreenProps) => (
    <View className="flex items-center w-[100%]">
        <Text className="text-2xl mt-5 font-JakartaExtraBold">Where would you like to go?</Text>

        {/* add map of pinned locations */}

        {/* search bar and list */}
        <CountrySearchBar onSelect={handleSelect} />
        <FlatList
            data={Array.isArray(currentValue) ? currentValue : []}
            keyExtractor={(item) => item.code}
            numColumns={2}
            className="mt-4"
            renderItem={({ item }) => (
                <View className="flex-row items-center bg-gray-200 p-2 rounded-lg m-1">
                    <Flag code={item.code} size={24} className="mr-2" />
                    <Text className="text-lg font-bold">{item.name}</Text>
                </View>
            )}
        />
    </View>
);

export default LocationScreen;