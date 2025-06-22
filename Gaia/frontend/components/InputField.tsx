/* eslint-disable prettier/prettier */
import { InputFieldProps } from "@/types/declarations";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useState } from "react";
import { View, Text, Image, TextInput } from "react-native";

const InputField = ({
  label,
  icon,
  labelStyle,
  secureTextEntry = false,
  containerStyle,
  inputStyle,
  iconStyle,
  className,
  fontAwesome,
  ...props
}: InputFieldProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className="my-2 w-full">
      <Text className={`text-xl font-JakartaSemiBold mb-3 ${labelStyle}`}>
        {label}
      </Text>

      <View
        className={`flex flex-row justify-start items-center relative bg-neutral-100 rounded-full border ${isFocused ? "border-primary-111" : "border-neutral-300"
          } ${containerStyle}`}
      >
        {icon && (
          <Image source={icon} className={`w-6 h-6 ml-4 ${iconStyle}`} />
        )}
        {fontAwesome && (
          <View className="ml-3">
            <FontAwesome name={fontAwesome} size={20} />
          </View>
        )}

        {/* Text Input */}
        <TextInput
          className={`rounded-full p-4 font-JakartaSemiBold text-[15px] flex-1 ${inputStyle}`}
          placeholderTextColor="gray"
          secureTextEntry={secureTextEntry}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
      </View>
    </View>
    //   </TouchableWithoutFeedback>
    // </KeyboardAvoidingView>
  );
};

export default InputField;
