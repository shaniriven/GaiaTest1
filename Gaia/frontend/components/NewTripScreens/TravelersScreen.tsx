/* eslint-disable prettier/prettier */
import { View, Text, SafeAreaView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from "react-native";
import { NewTripScreenProps, Options } from "@/declarations";
import React, { useEffect, useState } from 'react';
import { TextInput } from "react-native-gesture-handler";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Checkbox1 from "../Checkbox1";

const TravelersScreen = ({ handleSelect, onChangeGroupType, currentGroupValue = {adults: 1, children: 0, total: 1, type: 'solo'} }: NewTripScreenProps) => {
    const [selectedOption, setSelectedOption] = useState<string | null>(currentGroupValue.type);
    const [isFocused, setIsFocused] = useState(false);
    const [inputMessage, setInputMessage] = useState({ status: false, msg: '' });

    const [adultsPlusDisabled, setAdultsPlusDisabled] = useState(false);
    const [adultsMinusDisabled, setAdultsMinusDisabled] = useState(true);
    const [childrenPlusDisabled, setChildrenPlusDisabled] = useState(false);
    const [childrenMinusDisabled, setChildrenMinusDisabled] = useState(true);

    const [group, setGroup] = useState({ adults: currentGroupValue.adults,
        children: currentGroupValue.children,
        total: currentGroupValue.total,
     });
    const maxPeople = 20;

    const handleCheckboxPress = (option: Options) => {
        setSelectedOption(option);
        onChangeGroupType(option);

    };

    useEffect(() => {
        // group type -> number
        // handeling changes in type of group and adjusting number of people
        setGroup((prevGroup) => {
            let newGroup = { ...prevGroup };
            switch (selectedOption) {
                case 'solo':
                    newGroup = { adults: 1, children: 0, total: 1 };
                    break;

                case 'friends':
                    if (prevGroup.total <= 1) 
                        newGroup = { adults: 2, children: 0, total: 2 };
                    break;

                case 'couple':
                    if (prevGroup.total !== 2) 
                        newGroup = { adults: 2, children: 0, total: 2 };
                    break;
                default:
                    break;
            }
            setAdultsMinusDisabled(newGroup.adults === 1);
            setChildrenMinusDisabled(newGroup.children === 0);
            setAdultsPlusDisabled(newGroup.total === maxPeople);
            setChildrenPlusDisabled(newGroup.total === maxPeople);
            return newGroup;
        })
    }, [selectedOption]);

    useEffect(() => {
        // number of people -> group type
        // handeling changes in number of people and adjusting type by number
        if (group.adults === 1 && group.children === 0) 
            handleCheckboxPress('solo');

        else if (group.adults === 3) {
            if (selectedOption === 'couple')
                handleCheckboxPress('family');
        }
        else {
            if (selectedOption === 'solo')
                handleCheckboxPress('friends')
        }

        if (group.children > 0) {
            if (selectedOption === 'solo')
                handleCheckboxPress('friends')
            if (selectedOption === 'couple')
                handleCheckboxPress('family')
        }

        handleSelect(group.adults, group.children);
    }, [group.adults, group.children])

    type HandleNumberOps = 'addAdult' | 'subAdult' | 'addChild' | 'subChild' | 'textInput';

    const handleNumberChange = (operation: HandleNumberOps) => {
        switch (operation) {
            case 'addAdult':
                setGroup((prevGroup) => ({
                    ...prevGroup,
                    total: prevGroup.total + 1,
                    adults: prevGroup.adults + 1,
                }));
                break;
            case 'subAdult':
                setGroup((prevGroup) => ({
                    ...prevGroup,
                    total: prevGroup.total - 1,
                    adults: prevGroup.adults - 1,
                }));
                break;
            case 'addChild':
                setGroup((prevGroup) => ({
                    ...prevGroup,
                    total: prevGroup.total + 1,
                    children: prevGroup.children + 1,
                }));
                break;
            case 'subChild':
                setGroup((prevGroup) => ({
                    ...prevGroup,
                    total: prevGroup.total - 1,
                    children: prevGroup.children - 1,
                }));
                break;

        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <SafeAreaView className="flex gap-5 w-full justify-center items-center">
                    {/* header */}
                    <Text className="text-2xl mt-5 font-JakartaExtraBold text-center">How many travelers?</Text>

                    {/* adults input */}
                    <View className="flex">
                        {/* error message view */}
                        <Text className="text-md font-JakartaExtraBold text-center" style={{ opacity: inputMessage.status === true ? 1 : 0 }}>{inputMessage.msg}</Text>

                        <Text className="text-md font-JakartaExtraBold text-center mt-5">adults +18</Text>
                        <View className="flex-row items-center justify-center gap-5 mt-2">
                            <TouchableOpacity onPress={() => handleNumberChange('subAdult')}
                                disabled={adultsMinusDisabled}>
                                <FontAwesome6 name="minus" size={20} color={adultsMinusDisabled ? "#D3D3D3" : "gray"} />
                            </TouchableOpacity>

                            <TextInput
                                className="rounded-md bg-neutral-100 font-JakartaSemiBold text-xs text-center border w-[35px] h-[35px] border-neutral-300 p-1"
                                placeholderTextColor="gray"
                                placeholder="1"
                                keyboardType="numeric"
                                value={String(group.adults)}
                                secureTextEntry={false}
                                editable={false}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                // onChangeText={(value: string) => handleSelect(value, 'adults')}
                                onChangeText={(value: string) => handleNumberChange('textInput')}
                            />

                            <TouchableOpacity onPress={() => handleNumberChange('addAdult')}
                                disabled={adultsPlusDisabled}>
                                <FontAwesome6 name="plus" size={20} color={adultsPlusDisabled ? "#D3D3D3" : "gray"} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* children input */}
                    <View className="flex mt-2">
                        <Text className="text-md font-JakartaExtraBold text-center">children</Text>
                        <View className="flex-row items-center justify-center gap-5  mt-2" >
                            <TouchableOpacity onPress={() => handleNumberChange('subChild')}
                                disabled={childrenMinusDisabled}>
                                <FontAwesome6 name="minus" size={20} color={childrenMinusDisabled ? "#D3D3D3" : "gray"} />
                            </TouchableOpacity>
                            <TextInput
                                className="rounded-md bg-neutral-100 font-JakartaSemiBold text-xs text-center border w-[35px] h-[35px] border-neutral-300 p-1"
                                placeholderTextColor="gray"
                                placeholder="0"
                                value={String(group.children)}
                                keyboardType="numeric"
                                editable={false}
                                secureTextEntry={false}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                onChangeText={(value: string) => handleNumberChange('textInput')}
                            />
                            <TouchableOpacity onPress={() => handleNumberChange('addChild')}
                                disabled={childrenPlusDisabled}>
                                <FontAwesome6 name="plus" size={20} color={childrenPlusDisabled ? "#D3D3D3" : "gray"} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View className="flex-row items-cente justify-start gap-10 pr-3 my-5">
                        <Checkbox1 value="solo"
                            icon="user"
                            label="solo"
                            selectedOption={selectedOption}
                            onSelect={handleCheckboxPress}
                        />
                        <Checkbox1 value="friends"
                            icon="people-group"
                            label="friends"
                            selectedOption={selectedOption}
                            onSelect={handleCheckboxPress}
                        />
                        <Checkbox1 value="couple"
                            icon="heart"
                            label="couple"
                            selectedOption={selectedOption}
                            onSelect={handleCheckboxPress}
                        />
                        <Checkbox1 value="family"
                            icon="people-roof"
                            label="family"
                            selectedOption={selectedOption}
                            onSelect={handleCheckboxPress}
                        />
                    </View>

                    <Text className="text-xl font-PlusJakartaSans text-center">Shape your plan by considering the group size and who you'll be traveling with</Text>
                </SafeAreaView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};
export default TravelersScreen;