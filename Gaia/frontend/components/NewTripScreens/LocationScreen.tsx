/* eslint-disable prettier/prettier */
import { FlatList, ScrollView, Text, TouchableOpacity } from "react-native";
import { Keyboard, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, View } from 'react-native';
import Flag from "react-native-flags";
import CountrySearchBar from "../CountrySearchBar";
import { NewTripScreenProps } from "@/declarations";
import React, { useState } from "react";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import 'react-native-get-random-values';
import GooglePlacesInput from "../GooglePlaceInput";
import CustomButton from "../CustomButton";

const LocationScreen = ({ handleSelect, locationList = {}}: NewTripScreenProps) => {
    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };
    
    const initialPlaces = Object.entries(locationList).map(([id, value]) => ({
        id,
        name: value.name,
    }));
    const [selectedPlaces, setSelectedPlaces] = useState<{ id: string; name: string }[]>(initialPlaces);

    const handlePlaceSelect = (place: { id: string; name: string }) => {
        if (!selectedPlaces.find(p => p.id === place.id)) {
            setSelectedPlaces(prev => [...prev, place]);
        }
        handleSelect({ ...locationList, [place.id]: { name: place.name } });
    };


    const handleRemovePlace = (id: string) => {
        setSelectedPlaces(prev => prev.filter(p => p.id !== id));
    };

    return (
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <View className="flex-1 items-center w-[100%]">
                <Text className="text-2xl mt-5 font-JakartaBold">Where would you like to go?</Text>

                <View className="flex flex-row flex-wrap justify-center items-center gap-2 mt-4">

                    <GooglePlacesInput handleSelect={handlePlaceSelect} />
                </View>
                <ScrollView
                    className="flex-1"
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{ alignItems: 'center', paddingBottom: 50 }}
                >
                    <View className="flex text-center flex-row flex-wrap justify-center items-center gap-2 mt-7 w-full">
                        {selectedPlaces.map(place => (
                            <View key={place.id} className="flex-row items-center bg-tabs-100 px-3 py-1 rounded-full mr-2 mb-2 border-[0.5px] border-gaiaGreen-100"
                            >
                                <Text className="text-md font-JakartaMedium text-white mr-3">{place.name}</Text>
                                <TouchableOpacity onPress={() => handleRemovePlace(place.id)}>
                                    <Text className="text-white text-lg">×</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                </ScrollView>
                <View className="absolute bottom-10 left-0 right-0 items-center">
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};

export default LocationScreen;
