/* eslint-disable prettier/prettier */
import { Categories, InterestsDictionary, NewTripScreenProps, Labels, UserInterestesSelections } from "@/declarations";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import TabButton from "../TabButton";

const InterestScreen = ({ handleSelect, userInterests }: NewTripScreenProps) => {
    const [userInterestsList, setUserInterestsList] = useState({ ...userInterests });
    const [activeCategory, setActiveCategory] = useState<Categories>(() => {
        const firstCategory = Object.keys(userInterestsList).find(key => userInterestsList[key as keyof InterestsDictionary] && userInterestsList[key as keyof InterestsDictionary]!.length > 0) as Categories | undefined;
        return firstCategory || 'Food & Drinks';
    });

    const categoryData: InterestsDictionary = {
        'Rooms': ['Hotels', 'Airbnb', 'Hostels','Apartments', 'Resorts', 'Camping'],
        'Food & Drinks': ['Restaurants', 'Bars', 'Cafes', 'Wine Bars', 'Fast Food', 'Local Food'],
        'Music & Concerts': ['Concerts', 'Festivals', 'Orchestra', 'Musicals', 'Music Bars', 'Local Music'],
        'Activities': ['Skydiving', 'Snow Sports', 'Diving', 'Surf', 'Camping', 'Zoo & Safari', 'Guided Tours'],
        'Traveling Style': ['Short Hikings', 'Trekking', 'Road Tripping', 'Urban Exploration', 'Beaches'],
        'Art & Culture': ['Museums', 'Galleries', 'National Parks', 'Monuments', 'Sightseeing', 'Marketplace', 'Cultural Landmarks', 'Nightlife'],
        'Entertainment': ['Movies', 'Theatre', 'Dance', 'Opera', 'Sport Events','Parks', 'Comedy Shows'],
        'Shopping': ['Malls', 'Outlets', 'Supermarket', 'Artisan Workshops'],
        'Wellness': ['Spas', 'Gyms', 'Pool', 'Parks'],
    };
    const [activeLabels, setActiveLabelss] = useState<Labels[]>(categoryData[activeCategory] || [])

    useEffect(() => {
        setActiveLabelss(categoryData[activeCategory] || []);
    }, [activeCategory]);

    useEffect(() => {
        handleSelect(userInterestsList)
    }, [userInterestsList])

    const handleCategoryPress = (category: Categories) => {
        setActiveCategory(category);
    };

    const isLabelIncluded = (label: Labels) => {
        return Object.values(userInterestsList).some(labels => labels.includes(label));
    };

    const removeLabel = (label: Labels) => {
        const updatedInterests = { ...userInterestsList }
        if (updatedInterests[activeCategory]?.includes(label)) {
            updatedInterests[activeCategory] = updatedInterests[activeCategory]!.filter(item => item !== label);
            if (updatedInterests[activeCategory]?.length === 0) {
                delete updatedInterests[activeCategory];
            }
        }
        setUserInterestsList(updatedInterests);
    }

    const addLabel = (label: Labels) => {
        const updatedInterests = { ...userInterestsList }
        if (!updatedInterests[activeCategory]) {
            updatedInterests[activeCategory] = [];
        }
        if (!updatedInterests[activeCategory]?.includes(label)) {
            updatedInterests[activeCategory]?.push(label);
        }
        setUserInterestsList(updatedInterests);

    }

    const handleSubPress = (label: Labels) => {
        if (isLabelIncluded(label))
            removeLabel(label)
        else
            addLabel(label);
    }

    return (
        <SafeAreaView className="flex items-center w-[100%]">
            <Text className="text-2xl mt-5 font-JakartaExtraBold mb-2">Make It Yours</Text>
            <Text className="text-xl font-PlusJakartaSans text-center">choose what excites you</Text>

            <View className="flex flex-row flex-wrap justify-center items-center gap-2 mt-4">
                {Object.entries(categoryData).map(([category], index) => (
                    <TouchableOpacity key={index} className={`${category === activeCategory ? 'bg-tabs-100' : 'bg-tabs-200'} px-4 py-3 rounded-full`} onPress={() => handleCategoryPress(category as Categories)}>
                        <Text className="text-white text-md font-JakartaMedium">{category}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            <Text className="text-xl font-PlusJakartaSans text-center mt-10">pick your interests and wishes</Text>
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
                        style={{ minWidth: 100, maxWidth: 150, textAlign: 'center' }} 
                    />
                ))}
            </View>

        </SafeAreaView>
    );
}

export default InterestScreen;