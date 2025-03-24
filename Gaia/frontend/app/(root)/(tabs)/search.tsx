/* eslint-disable prettier/prettier */
import ScreenHeader from "@/components/ScreenHeader";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Search = () => {
  return (
    <SafeAreaView>
      <ScreenHeader text="Search" />
    </SafeAreaView>
  );
};

export default Search;
