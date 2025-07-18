import CustomTripButton from "@/components/CustomTripButton";
import config from "@/config";
import { AgentPlan } from "@/types/type";
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import axios from "axios";
import { router, usePathname } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export default function Page() {
  const { user } = useUser();
  const user_id = user?.id || "1";
  const api_url = config.api_url;
  const [userData, setUserData] = useState([]);

  const [plansLabels, setPlansLabels] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPlan, setCurrentPlan] = useState<AgentPlan | null>(null);

  const screenWidth = Dimensions.get("window").width;
  const slideAnim = useRef(new Animated.Value(screenWidth)).current;
  const pathname = usePathname();

  useEffect(() => {
    const fetchPlansData = async (user_id: string) => {
      try {
        const response = await axios.get(`${api_url}/home/fetchPlansData/`, {
          params: { user_id },
        });
        setUserData(response.data);
        if (userData) {
          const plansData = response.data.map(
            (plan: {
              name: string;
              formatted_date: string;
              is_past: boolean;
              _id: string;
            }) => ({
              name: plan.name,
              formatted_date: plan.formatted_date,
              is_past: plan.is_past,
              id: plan._id,
            }),
          );
          setPlansLabels(plansData);
        }
      } catch (error) {
        console.error("error fetching user: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlansData(user_id);
  }, [pathname]);

  const arrowOpacity = useRef(new Animated.Value(0)).current;

  // plan screen animation
  useEffect(() => {
    if (currentPlan) {
      // fade in
      setTimeout(() => {
        Animated.timing(arrowOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      }, 300);
    } else {
      // fade out
      Animated.timing(arrowOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [currentPlan]);

  if (loading) {
    return (
      <View>
        <ActivityIndicator size="large" />
        <Text>Loading user data...</Text>
      </View>
    );
  }

  //

  // check
  // const formatDateRange = (startDate: string, endDate: string) => {
  //   const [day1, month1, year1] = startDate.split("-").map(Number);
  //   const [day2, month2, year2] = endDate.split("-").map(Number);

  //   if (year1 === year2 && month1 === month2)
  //     return `${day1}-${day2}.${month1}.${String(year1).slice(2)}`;
  //   else if (year1 === year2)
  //     return `${day1}.${month1}-${day2}.${month2}.${String(year1).slice(2)}`;
  //   else return `${day1}.${month1}.${year1}-${day2}.${month2}.${year2}`;
  // };
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };
  return (
    <View className="flex-1 bg-white">
      <SignedIn>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <View className="flex w-full p-4 h-full">
              <View className="flex-row flex-wrap justify-center">
                {plansLabels.length > 0 ? (
                  plansLabels.map((plan: AgentPlan, index) => (
                    <CustomTripButton
                      title={plan.name}
                      onPress={() =>
                        router.push(
                          `/(plans)/${plan.id}?name=${plan.name}&pickedName=true`,
                        )
                      }
                      key={index}
                      pastTripButton={plan.is_past}
                      tripDate={plan.formatted_date}
                      className="rounded-lg m-2 w-[160px] h-[90px] "
                      textClassName="text-white text-lg font-JakartaMedium "
                    ></CustomTripButton>
                  ))
                ) : (
                  <View className="flex-1 items-center justify-center">
                    <Text className="text-lg font-JakartaMedium">
                      No planned trips yet
                    </Text>
                  </View>
                  // <View className="flex  mt-3 items-center justify-center">
                  //   {/* choose name screen */}
                  //   <Text className="text-xl font-JakartaSemiBold text-center">
                  //     Enter a name for your trip
                  //   </Text>
                  //   <Text className="mt-2 mx-1 text-xl font-JakartaLight text-center">
                  //     You can add it later or edit it in the trip settings
                  //   </Text>
                  //   <InputField
                  //     placeholder="Girl's in Paris"
                  //     onChangeText={(text: string) => setTripName(text)}
                  //     value={tripName}
                  //     className="w-[300px]"
                  //   />
                  //   <View className="flex flex-row flex-wrap gap-5 justify-between mb-5 mt-7 w-[260px] z-500">
                  //     <TabButton
                  //       key={1}
                  //       title={"choose for me"}
                  //       bgColor="bg-grayTab"
                  //       textColor="text-primary"
                  //       onPress={() => {}}
                  //       isActive={false}
                  //     />
                  //     <TabButton
                  //       key={2}
                  //       title={"save"}
                  //       bgColor="bg-grayTab"
                  //       textColor="text-primary"
                  //       onPress={() => {}}
                  //       isActive={false}
                  //     />
                  //   </View>
                  // </View>
                )}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SignedIn>
      <SignedOut>
        <View className="flex-1 items-center justify-center">
          <Text>sing out view</Text>
        </View>
      </SignedOut>
    </View>
  );
}

{
  /* header and back arrow */
}

{
  /* <View className="flex-row items-center justify-between">
        {selectedScreen && (
          <TouchableOpacity onPress={handleClosePanel} className="absolute left-4 pt-2">
            <Animated.Image
              source={icons.backArrow}
              className="w-[24px] h-[24px]"
              style={{ opacity: arrowOpacity }}
            />
          </TouchableOpacity>
        )}
        <View className="flex-1 items-center">
          <ScreenHeader text="Planned Trips" />
        </View>
      </View> */
}
// open plan screen
// const openPanel = (screen: AgentPlan) => {
//   setCurrentPlan(screen);
//   Animated.timing(slideAnim, {
//     toValue: 0, // Slide in
//     duration: 300,
//     useNativeDriver: true,
//   }).start();
// };

// const closePanel = () => {
//   Animated.timing(slideAnim, {
//     toValue: screenWidth, // Slide out
//     duration: 300,
//     useNativeDriver: true,
//   }).start(() => setCurrentPlan(null));
// };

// const handleClosePanel = () => {
//   // Fade out the arrow before sliding the panel out
//   Animated.timing(arrowOpacity, {
//     toValue: 0,
//     duration: 200,
//     useNativeDriver: true,
//   }).start(() => {
//     closePanel();
//   });
// };
// {/* selected trip modal */}
// {currentPlan && (
//   <Animated.View
//     className="absolute top-2 bottom-0 bg-white shadow-lg bg-tabs-400 self-center rounded-xl p-2"
//     style={{
//       width: screenWidth - 20,
//       transform: [{ translateX: slideAnim }],
//     }}
//   >
//     <View className="flex-1 mt-4">
//       <View className="flex-row justify-between items-end">
//         {/* header  */}
//         <View className="flex-row items-end ml-2">
//           {/* back arrow  */}
//           <TouchableOpacity onPress={handleClosePanel}>
//             <Animated.Image
//               source={
//                 typeof icons.backArrow === "string"
//                   ? { uri: icons.backArrow }
//                   : icons.backArrow
//               }
//               className="w-[24px] h-[24px] mr-2"
//               style={{ opacity: arrowOpacity }}
//             />
//           </TouchableOpacity>
//           <Text className="text-3xl font-JakartaMedium">
//             trip to {currentPlan.name}
//           </Text>
//         </View>

//         {/* dates above progress bar */}
//         {/* <View className="flex-row items-end mr-2">
//           <Text className="text-lg font-JakartaMedium">
//             {formatDateRange(
//               selectedScreen.startDate,
//               selectedScreen.endDate,
//             )}
//           </Text>
//         </View> */}
//       </View>

//       {/* trip swiper */}
//       {/* <View className="flex-1 m-2 ">
//         <TripSwiper
//           dayTrips={selectedScreen.dayTrips}
//           color={color}
//         />
//       </View> */}
//     </View>
//   </Animated.View>
// )}
{
  /* planned trips list */
}
{
  /* <FlatList data={fullTripListCopy} keyExtractor={(item) => item.id.toString()} numColumns={numColumns}
            renderItem={({ item }) => (
              <TouchableOpacity className={`bg-gaiaGreen-100 justify-center items-center m-2 rounded-lg`} style={{ width: squareSize, height: squareSize }} onPress={() => openPanel(item)} >
                <Text className="text-white text-lg font-JakartaMedium">{item.title}</Text>
              </TouchableOpacity>
            )}
          /> 
          
          
          user_2ywdmrKOOqJwSthQP28KhpKD3Wx
          685bd7576e2ee284d7b72211
          */
}
