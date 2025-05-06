/* eslint-disable prettier/prettier */
import { FlatList, Text } from "react-native";
import { Keyboard, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, View } from 'react-native';
import Flag from "react-native-flags";
import CountrySearchBar from "../CountrySearchBar";
import { NewTripScreenProps } from "@/declarations";
import React from "react";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import 'react-native-get-random-values';
import GooglePlacesInput from "../GooglePlaceInput";

const LocationScreen = ({ handleSelect, currentValue }: NewTripScreenProps) => {
    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };

    return (
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <View className="flex-1 items-center w-[100%]">
                <Text className="text-2xl mt-5 font-JakartaBold">Where would you like to go?</Text>

                {/* <GooglePlacesInput /> */}
            </View>
        </TouchableWithoutFeedback>
    );
};

export default LocationScreen;


        // {/* search bar and list
        // <CountrySearchBar onSelect={handleSelect} />
        // <FlatList
        //     data={Array.isArray(currentValue) ? currentValue : []}
        //     keyExtractor={(item) => item.code}
        //     numColumns={2}
        //     className="mt-4"
        //     renderItem={({ item }) => (
        //         <View className="flex-row items-center bg-gray-200 p-2 rounded-lg m-1">
        //             <Flag code={item.code} size={24} className="mr-2" />
        //             <Text className="text-lg font-bold">{item.name}</Text>
        //         </View>
        //     )}
        // /> */}