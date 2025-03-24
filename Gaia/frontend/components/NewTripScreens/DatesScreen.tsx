/* eslint-disable prettier/prettier */
import { View, Text } from "react-native";
import { NewTripScreenProps } from "@/declarations";
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView } from "react-native-safe-area-context";

const DatesScreen = ({ startDate, endDate, onChangeStart, onChangeEnd }: NewTripScreenProps) => {
    // for spinner stylingm in ios ----> add prop to DateTimePicker: display={Platform.OS === 'ios' ? 'spinner' : 'default'}
    const verifyStart = startDate || new Date();
    const verifyEnd = endDate || new Date();
    const rowClassName = "flex flex-row flex-wrap justify-between w-[80%] mt-10";

    return (
        <SafeAreaView className="flex items-center w-[100%]">
            <Text className="text-2xl mt-5 font-JakartaExtraBold mb-10">When is your trip?</Text>
            <View className={rowClassName}>
                <Text className="text-2xl font-JakartaExtraBold">Starting Day: </Text>
                <DateTimePicker
                    minimumDate={new Date()}
                    themeVariant="light"
                    value={verifyStart}
                    mode="date"
                    onChange={onChangeStart}
                    textColor="black"
                />
            </View>

            <View className={rowClassName}>
                <Text className="text-2xl font-JakartaExtraBold">Return Day: </Text>
                <DateTimePicker
                    minimumDate={new Date()}
                    themeVariant="light"
                    value={verifyEnd}
                    mode="date"
                    onChange={onChangeEnd}
                    textColor="black"
                />

            </View>
        </SafeAreaView>
    );
}

export default DatesScreen;