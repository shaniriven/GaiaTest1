/* eslint-disable prettier/prettier */
import React from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import config from '../config';

const GooglePlacesInput = () => {
    
    const googlePlacesApiKey = config.googlePlacesApiKey;
    
    return (
        <GooglePlacesAutocomplete
            textInputProps={{ placeholderTextColor: 'grey' }}
            placeholder='search location'

            onPress={(data, details = null) => {
                // 'details' is provided when fetchDetails = true
                console.log(data, details);
            }}
            query={{
                key: googlePlacesApiKey,
                language: 'en',
            }}
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
        />
    );
};

export default GooglePlacesInput;