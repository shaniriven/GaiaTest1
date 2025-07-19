import config from "@/config";
import { DailyPlanProps } from "@/types/declarations";
import { Activity } from "@/types/type";
import Feather from "@expo/vector-icons/Feather";
import axios from "axios";
import { useEffect, useState } from "react";
import { Image, Modal, Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useLikedPlaces } from "@/context/LikedPLacesContext";

const DailyPlan = ({ daily_plan }: DailyPlanProps) => {
  const api_url = config.api_url;
  const { likedPlaces, toggleLike } = useLikedPlaces();
  const [loading, setLoading] = useState(false);
  const [currentActivities, setCurrentActivities] = useState<Activity[]>([]);
  const [plan, setPlan] = useState(daily_plan);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(
    null,
  );

  useEffect(() => {
    const fetchActivitiesImages = async (daily_plan_activities: Activity[]) => {
      try {
        setLoading(true);
        setCurrentActivities([]);

        const response = await axios.post(
          `${api_url}/plan/fetchActivitiesImages/`,
          { daily_plan_activities },
        );
        const { updatedActivities } = response.data;
        setCurrentActivities(updatedActivities as Activity[]);
      } catch (error) {
        console.error("error fetching user: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchActivitiesImages(daily_plan.activities);
  }, [plan]);

  return (
    <View className="flex">
      <ScrollView
        contentContainerStyle={{
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          margin: 16,
        }}
        style={{ height: "80%" }}
      >
        <Text className="text-black text-lg font-JakartaSemiBold m-1">
          {/* day theme  */}
          {daily_plan.theme}
        </Text>
        {currentActivities.map((activity, index) => (
          <View
            key={index}
            className="w-full bg-white shadow-sm my-2 py-4 px-2 flex-row rounded-lg"
          >
            {/* activity card  */}
            <Image
              source={{ uri: `data:image/png;base64,${activity.image}` }}
              style={{ width: 80, height: 80, borderRadius: 8 }}
            />

            <View className="flex-1 ml-4 justify-between">
              {/* title  */}
              <Text className="text-black text-base font-JakartaExtraBold text-lg mx-4">
                {activity.title}
              </Text>

              <View className="flex-row justify-between items-center mx-4 mt-2">
                {/* Time with Sun Icon */}
                <View className="flex-row items-center">
                  <Feather
                    name="sun"
                    size={16}
                    color="#A0A0A0"
                    className="mr-1"
                  />
                  <Text className="text-md text-gray-400 font-JakartaLight px-1">
                    {activity.time}
                  </Text>
                </View>

                <View className="flex-row items-center space-x-2 gap-4">
                  {/* like and info buttons */}
                  <TouchableOpacity onPress={() => toggleLike(activity)}>
                    <Feather
                      name="heart"
                      size={22}
                      color={
                        likedPlaces.some((a) => a.title === activity.title) ? "red" : "black"
                      }
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      setSelectedActivity(activity);
                      setModalVisible(true);
                    }}
                  >
                    {/* info */}
                    <Feather name="info" size={22} color="black" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* info modal  */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/40">
          {/* background of Modal  */}
          <View className="w-4/5 bg-white p-4 rounded-xl items-center">
            {/* Modal container  */}
            <Text className="text-black text-lg font-JakartaExtraBold m-1">
              {/* title  */}
              {selectedActivity?.title}
            </Text>
            <View className="flex-row items-center mb-4">
              {/* time label  */}
              <Feather name="sun" size={16} color="#A0A0A0" className="mr-1" />
              <Text className="text-md text-gray-400 font-JakartaLight px-1">
                {selectedActivity?.time}
              </Text>
            </View>
            <Image
              source={{
                uri: `data:image/png;base64,${selectedActivity?.image}`,
              }}
              className="w-36 h-36 rounded-lg mb-4"
            />
            <Text className="text-black text-lg font-JakartaLight self-start text-left mt-2">
              {/* description  */}
              {selectedActivity?.description}
            </Text>
            <Text className="text-black text-lg font-JakartaLight mt-4 self-start text-left">
              <Text className="font-JakartaSemiBold">Cost:</Text>{" "}
              {selectedActivity?.cost}
            </Text>
            <Text className="text-black text-lg font-JakartaLight mt-4 mb-2 self-start text-left">
              <Text className="font-JakartaSemiBold">Notes:</Text>{" "}
              {selectedActivity?.notes}
            </Text>
            <TouchableOpacity
              className="my-4 bg-gaiaGreen-100 px-5 py-2 rounded-full"
              onPress={() => setModalVisible(false)}
            >
              {/* close button  */}
              <Text className="text-white font-JakartaMedium text-md ">
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default DailyPlan;