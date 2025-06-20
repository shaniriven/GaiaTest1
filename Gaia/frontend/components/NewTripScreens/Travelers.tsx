import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import { Options } from "@/types/type";
import { NewTripScreenProps } from "@/types/declarations";
import React, { useEffect, useState } from "react";
import { TextInput } from "react-native-gesture-handler";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Checkbox1 from "../Checkbox1";

const Travelers = ({
  handleSelect,
  onChangeGroupType,
  currentGroupValue = { adults: 1, children: 0, total: 1, type: "solo" },
}: NewTripScreenProps) => {
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };
  const [adultInput, setAdultInput] = useState(
    currentGroupValue.adults.toString(),
  );
  const [childrenInput, setChildrenInput] = useState(
    currentGroupValue.children.toString(),
  );
  const MAX = 20;
  const [adultsPlusDisabled, setAdultsPlusDisabled] = useState(false);
  const [adultsMinusDisabled, setAdultsMinusDisabled] = useState(true);
  const [childrenPlusDisabled, setChildrenPlusDisabled] = useState(false);
  const [childrenMinusDisabled, setChildrenMinusDisabled] = useState(true);

  const [selectedOption, setSelectedOption] = useState<string | null>(
    currentGroupValue.type,
  );

  //   updating group consts numbers when changing checkbox (selected option)
  useEffect(() => {
    const adultNum = parseInt(adultInput);
    const childrenNum = parseInt(childrenInput);
    const total = adultNum + childrenNum;

    switch (selectedOption) {
      case "solo":
        setAdultInput("1");
        setChildrenInput("0");
        break;

      case "friends":
        if (total <= 1) {
          setAdultInput("2");
          setChildrenInput("0");
        }
        break;

      case "couple":
        if (total !== 2) {
          setAdultInput("2");
          setChildrenInput("0");
        }
        break;
      default:
        break;
    }
    setAdultsMinusDisabled(parseInt(adultInput) === 1);
    setChildrenMinusDisabled(parseInt(childrenInput) === 0);
    setAdultsPlusDisabled(parseInt(adultInput) === MAX);
    setChildrenPlusDisabled(parseInt(adultInput) === MAX);
  }, [selectedOption]);

  const handleCheckboxPress = (option: Options) => {
    setSelectedOption(option);
    onChangeGroupType(option);
  };

  //   updating checkbox when changing group consts number (selected option)
  useEffect(() => {
    const adultNum = parseInt(adultInput);
    const childrenNum = parseInt(childrenInput);

    if (adultNum === 1 && childrenNum === 0) handleCheckboxPress("solo");
    else if (adultNum === 3) {
      if (selectedOption === "couple") handleCheckboxPress("family");
    } else {
      if (selectedOption === "solo") handleCheckboxPress("friends");
    }
    if (childrenNum > 0) {
      if (selectedOption === "solo") handleCheckboxPress("friends");
      if (selectedOption === "couple") handleCheckboxPress("family");
    }

    handleSelect(adultNum, childrenNum);
  }, [adultInput, childrenInput]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View className="flex-1 items-center mt-2 ">
          <Text className="text-2xl font-JakartaBold">
            who travels with you?
          </Text>
          {/* input row */}
          <View className="flex flex-row items-center justify-center gap-20 mt-10">
            {/* adults input view */}
            <View className="flex flex-col items-center justify-center mt-4 ">
              <Text className="text-md font-JakartaSemiBold text-center m-2">
                adults +18
              </Text>
              {/* minus */}
              <View className="flex flex-row items-center justify-center gap-2">
                <TouchableOpacity
                  onPress={() =>
                    setAdultInput((parseInt(adultInput) - 1).toString())
                  }
                  disabled={adultsMinusDisabled}
                >
                  <FontAwesome6
                    name="minus"
                    size={18}
                    color={adultsMinusDisabled ? "#D3D3D3" : "gray"}
                  />
                </TouchableOpacity>
                {/* input box */}
                <TextInput
                  className="rounded-md bg-neutral-100 font-JakartaSemiBold text-xs text-center border w-[32px] h-[32px] border-neutral-300 p-1"
                  placeholder="1"
                  onChangeText={(newText) => setAdultInput(newText)}
                  defaultValue={adultInput}
                  keyboardType="numeric"
                  maxLength={2}
                />
                {/* plus */}
                <TouchableOpacity
                  onPress={() =>
                    setAdultInput((parseInt(adultInput) + 1).toString())
                  }
                  disabled={adultsPlusDisabled}
                >
                  <FontAwesome6
                    name="plus"
                    size={18}
                    color={adultsPlusDisabled ? "#D3D3D3" : "gray"}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* children input view */}
            <View className="flex flex-col items-center justify-center mt-4 ">
              <Text className="text-md font-JakartaSemiBold text-center m-2">
                children
              </Text>
              {/* minus */}
              <View className="flex flex-row items-center justify-center gap-2">
                <TouchableOpacity
                  onPress={() =>
                    setChildrenInput((parseInt(childrenInput) - 1).toString())
                  }
                  disabled={childrenMinusDisabled}
                >
                  <FontAwesome6
                    name="minus"
                    size={18}
                    color={childrenMinusDisabled ? "#D3D3D3" : "gray"}
                  />
                </TouchableOpacity>
                {/* input box */}
                <TextInput
                  className="rounded-md bg-neutral-100 font-JakartaSemiBold text-xs text-center border w-[32px] h-[32px] border-neutral-300 p-1"
                  placeholder="1"
                  onChangeText={(newText) => setChildrenInput(newText)}
                  defaultValue={childrenInput}
                  keyboardType="numeric"
                  maxLength={2}
                />
                {/* plus */}
                <TouchableOpacity
                  onPress={() =>
                    setChildrenInput((parseInt(childrenInput) + 1).toString())
                  }
                  disabled={childrenPlusDisabled}
                >
                  <FontAwesome6
                    name="plus"
                    size={18}
                    color={childrenPlusDisabled ? "#D3D3D3" : "gray"}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* checkbox row */}
          <View className="flex flex-row items-cente justify-start gap-10 pr-3 mt-20">
            <Checkbox1
              value="solo"
              icon="user"
              label="solo"
              selectedOption={selectedOption}
              onSelect={handleCheckboxPress}
            />
            <Checkbox1
              value="friends"
              icon="people-group"
              label="friends"
              selectedOption={selectedOption}
              onSelect={handleCheckboxPress}
            />
            <Checkbox1
              value="couple"
              icon="heart"
              label="couple"
              selectedOption={selectedOption}
              onSelect={handleCheckboxPress}
            />
            <Checkbox1
              value="family"
              icon="people-roof"
              label="family"
              selectedOption={selectedOption}
              onSelect={handleCheckboxPress}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Travelers;
