/* eslint-disable prettier/prettier */
import { Checkbox1Props } from "@/declarations";
import { View, Text, TouchableOpacity } from "react-native";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Checkbox } from "react-native-paper";

const Checkbox1 = ({ icon, label, value, selectedOption, onSelect }: Omit<Checkbox1Props, 'icon'> & { icon: React.ComponentProps<typeof FontAwesome6>['name'] }) => {
    return (
        <View className="flex-col justify-center items-center w-1/6">
          <FontAwesome6 name={icon} size={24} color={selectedOption === value ? "#13875b" : "black"} style={{ marginLeft: 25 }} />
          <TouchableOpacity className="flex-row items-center" onPress={() => onSelect(value)}>
            <View className="bg-grayTab border rounded-full shadow-md shadow-neutral-400/70 scale-50">
              <Checkbox status={selectedOption === value ? "checked" : "unchecked"} color="#13875b" />
            </View>
            <Text className={`text-xl font-PlusJakartaSans ${selectedOption === value ? "text-gaiaGreen-100 font-JakartaSemiBold" : "black"}`}>{label}</Text>
          </TouchableOpacity>
        </View>
      );
    };

    export default Checkbox1;