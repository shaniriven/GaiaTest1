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

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#fff',
  },
  label: {
    marginTop: 10,
    fontWeight: 'bold'
  },
  input: {
    height: 40,
    borderColor: '#aaa',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginTop: 5,
  },
  resultContainer: {
    marginTop: 20,
  },
});
