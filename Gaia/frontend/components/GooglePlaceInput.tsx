/* eslint-disable prettier/prettier */
import React from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import config from '../config';
import { View } from 'react-native';

const GooglePlacesInput = () => {
    const googlePlacesApiKey = config.googlePlacesApiKey;
    console.log("Google Places API Key:", googlePlacesApiKey);
    return (
        <GooglePlacesAutocomplete
                // Required props
                query={{
                  key: googlePlacesApiKey, // REPLACE WITH YOUR ACTUAL API KEY
                  language: 'en',
                  types: 'geocode',
                }}
                // All other default props explicitly defined
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
                  rankby: 'distance',
                  type: 'restaurant',
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
                  // Handle selection
                  console.log(data, details);
                }}
                onTimeout={() =>
                  console.warn('google places autocomplete: request timeout')
                }
                predefinedPlacesAlwaysVisible={false}
                suppressDefaultStyles={false}
                textInputHide={false}
                timeout={20000}

            fetchDetails={true}
            predefinedPlaces={[]}
            textInputProps={{ placeholderTextColor: 'grey' }}
            placeholder='search location'
            // onPress={(data, details = null) => {
            //     if (!data || !details) {
            //         console.error('Data or details are undefined:', { data, details });
            //         return;
            //     }
            //     console.log('Selected location:', data, details);
            // }}
            // onPress={(data, details = null) => {
            //     // 'details' is provided when fetchDetails = true
            //     console.log(data, details);
            // }}
            styles={{
                container: {
                    width: '90%',
                    marginTop: 20,
                },
                textInputContainer: {
                    backgroundColor: 'white',
                    borderColor: 'grey',
                    borderWidth: 1,
                    borderRadius: 8,
                    padding: 1,

                },
                textInput: {
                    backgroundColor: '#FFFFFF',
                    height: 40,
                    borderRadius: 5,
                    paddingVertical: 5,
                    paddingHorizontal: 10,
                    fontSize: 15,
                    flex: 1,
                    color: 'black'
                },
                poweredContainer: {
                    display: 'none',
                },
                listView: {
                    backgroundColor: '#D9D9D9',
                    borderColor: '#ccc',
                    borderWidth: 1,
                    borderTopWidth: 0,
                    borderBottomLeftRadius: 8,
                    borderBottomRightRadius: 8,
                    maxHeight: 150,
                    showsVerticalScrollIndicator: true,
                    paddingRight: 10,

                },
                row: {
                    padding: 13,
                    height: 44,
                    flexDirection: 'row',
                    width: '350',
                    backgroundColor: '#f0f0f0', // light grey
                    borderColor: 'grey',
                    borderWidth: 1,
                    borderRadius: 8,
                    overflow: 'hidden',
                },
                separator: {
                    height: 0.5,
                    backgroundColor: '#c8c7cc',
                },
                description: {},
                loader: {
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    height: 200,
                },
            }}
            onFail={(error) => {
                console.error('Google Places API Error:', error);
            }}
        />
    );
};

export default GooglePlacesInput;