// use
import React, { useRef } from "react";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import config from "../config";
import { Text, TouchableOpacity } from "react-native";
import { NewTripScreenProps } from "@/types/declarations";

const GooglePlacesInput = ({ handleSelect }: NewTripScreenProps) => {
  const googlePlacesApiKey = config.googlePlacesApiKey;
  const ref = useRef<any>(null);

  return (
    <GooglePlacesAutocomplete
      ref={ref}
      query={{
        key: googlePlacesApiKey,
        language: "en",
        types: "geocode",
      }}
      autoFillOnNotFound={false}
      currentLocation={false}
      currentLocationLabel="Current location"
      debounce={0}
      disableScroll={false}
      enableHighAccuracyLocation={true}
      enablePoweredByContainer={true}
      filterReverseGeocodingByTypes={[]}
      GooglePlacesDetailsQuery={{}}
      GooglePlacesSearchQuery={{
        rankby: "distance",
        type: "restaurant",
      }}
      GoogleReverseGeocodingQuery={{}}
      isRowScrollable={true}
      keyboardShouldPersistTaps="always"
      listUnderlayColor="#c8c7cc"
      listViewDisplayed="auto"
      keepResultsAfterBlur={false}
      minLength={1}
      nearbyPlacesAPI="GooglePlacesSearch"
      numberOfLines={1}
      onNotFound={() => {}}
      onPress={(data, details = null) => {
        if (data && details) {
          const placeId = data.place_id;
          const name = details.name;
          const formatted = { id: placeId, name };
          handleSelect(formatted);
        } else {
          console.warn("GooglePlacesInput.tsx: Missing data or details");
        }
      }}
      onTimeout={() => console.warn("GooglePlacesInput.tsx: request timeout")}
      predefinedPlacesAlwaysVisible={false}
      suppressDefaultStyles={false}
      textInputHide={false}
      timeout={20000}
      fetchDetails={true}
      predefinedPlaces={[]}
      textInputProps={{ placeholderTextColor: "grey" }}
      renderRightButton={() => (
        <TouchableOpacity
          onPress={() => ref.current?.clear()}
          style={{
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 10,
          }}
        >
          <Text style={{ fontSize: 18, color: "gray" }}>×</Text>
        </TouchableOpacity>
      )}
      placeholder="search location"
      styles={{
        container: {
          width: "90%",
          marginTop: 20,
          // height: 300,
        },
        textInputContainer: {
          backgroundColor: "white",
          borderColor: "grey",
          borderWidth: 1,
          borderRadius: 8,
          padding: 1,
        },
        textInput: {
          backgroundColor: "#FFFFFF",
          height: 40,
          borderRadius: 5,
          paddingVertical: 5,
          paddingHorizontal: 10,
          fontSize: 15,
          flex: 1,
          color: "black",
        },
        poweredContainer: {
          display: "none",
        },
        listView: {
          backgroundColor: "#D9D9D9",
          borderColor: "#ccc",
          borderWidth: 1,
          borderTopWidth: 0,
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
          maxHeight: 200,
          showsVerticalScrollIndicator: true,
          paddingRight: 10,
        },
        row: {
          padding: 13,
          height: 44,
          flexDirection: "row",
          width: "350",
          backgroundColor: "#f0f0f0", // light grey
          borderColor: "grey",
          borderWidth: 1,
          borderRadius: 8,
          overflow: "hidden",
        },
        separator: {
          height: 0.5,
          backgroundColor: "#c8c7cc",
        },
        description: {},
        loader: {
          flexDirection: "row",
          justifyContent: "flex-end",
          height: 200,
        },
      }}
      onFail={(error) => {
        console.error("Google Places API Error:", error);
      }}
    />
  );
};

export default GooglePlacesInput;
