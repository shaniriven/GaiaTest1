import { useLikedPlaces } from "@/context/LikedPLacesContext";
import { View, Text, ScrollView } from "react-native";

const LikedPlacesScreen = () => {
  const { likedPlaces } = useLikedPlaces();

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text className="text-black font-bold text-xl mb-4">Liked Places</Text>
      {likedPlaces.length === 0 ? (
        <Text>No liked places yet.</Text>
      ) : (
        likedPlaces.map((activity, index) => (
          <View key={index} className="bg-white p-4 rounded-lg mb-2 shadow">
            <Text className="font-bold text-black">{activity.title}</Text>
            <Text className="text-gray-500">{activity.time}</Text>
            <Text className="text-black">{activity.description}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
};

export default LikedPlacesScreen;
