/* eslint-disable prettier/prettier */
import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { getCodeList } from "country-list";
import Flag from "react-native-flags";
import { CountrySearchBarProps } from "@/declarations";
import InputField from "@/components/InputField";

const CountrySearchBar = ({ onSelect }: CountrySearchBarProps) => {
    const countryCodes = getCodeList(); 
    const countryData = Object.fromEntries(
        Object.entries(countryCodes).map(([code, name]) => [name, code.toUpperCase()])
    );
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredCountries, setFilteredCountries] = useState(countryData);

    // Handle search input change
    const handleSearch = (text: string) => {
        setSearchQuery(text);
        const filtered = Object.keys(countryData)
            .filter((name) => name.toLowerCase().includes(text.toLowerCase()))
            .map((name) => ({ name, code: countryData[name] }));
        setFilteredCountries(filtered);
    };

    // Handle country selection
    const handleSelectCountry = (country: {name: string, code: string}) => {
        onSelect(country);
        setSearchQuery(country.name);
        setFilteredCountries([]); // Hide dropdown after selection
    };

    return (
        <View className="w-full items-center">
            <View className="w-[70%]">
            {/* Search Input */}
            <InputField
                className="border border-gray-300 rounded-lg text-lg "
                placeholder="Search for a country..."
                value={searchQuery}
                onChangeText={handleSearch}
                fontAwesome="globe"
            />
            </View>

            {/* Dropdown List */}
            {searchQuery.length > 0 && filteredCountries.length > 0 && (
                <FlatList
                    data={filteredCountries}
                    keyExtractor={(item) => item.name}
                    className="border border-gray-300 rounded-lg  max-h-[250px] w-[90%]"
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            className="flex-row items-center p-3 border border-gray-200 "
                            onPress={() => handleSelectCountry(item)}
                        >
                            <Flag code={item.code} size={24} className="m-3" />
                            <Text className="text-lg ml-4">{item.name}</Text>
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );
};

export default CountrySearchBar;