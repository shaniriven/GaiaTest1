import { Trip } from "@/declarations";
import { View, Text } from "react-native";
import {
  RenderItemParams,
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import { TouchableOpacity } from "react-native-gesture-handler";



const TripCard = ({ item, drag, isActive }: RenderItemParams<Trip>) => {
  return (
    <ScaleDecorator>
      <TouchableOpacity
        onLongPress={drag}
        disabled={isActive}
        style={[{ backgroundColor: isActive ? "red" : "white" }]}
      >
        <Text>{item.name}</Text>
      </TouchableOpacity>
    </ScaleDecorator>
  );
};

export default TripCard;




// home prev 
// const enhancedGreekTrips = greek_trips.map(trip => ({
//   ...trip,
//   key: trip.trip_id, // Add key property
// }))
// const [data, setData] = useState(enhancedGreekTrips);
// const renderItem = ({ item, drag, isActive }: RenderItemParams<Trip>) => {
//   return (
//     <ScaleDecorator>
//       <TouchableOpacity
//         onLongPress={drag}
//         disabled={isActive}
//         style={[
//           styles.rowItem,
//           { backgroundColor: isActive ? "red" : "blue" },
//         ]}
//       >
//         <Text>{item.name}</Text>
//       </TouchableOpacity>
//     </ScaleDecorator>
//   );
// };

// return (
//   <DraggableFlatList
//     data={data}
//     onDragEnd={({ data }) => setData(data)}
//     keyExtractor={(item) => item.key}
//     renderItem={renderItem}
//   />
// );
// }

// const styles = StyleSheet.create({
// rowItem: {
//   height: 100,
//   width: 100,
//   alignItems: "center",
//   justifyContent: "center",
// },
// text: {
//   color: "white",
//   fontSize: 24,
//   fontWeight: "bold",
//   textAlign: "center",
// },
// });