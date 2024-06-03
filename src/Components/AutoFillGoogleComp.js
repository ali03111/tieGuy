import React from 'react';
import {View, Text} from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {Colors} from '../Theme/Variables';
import {hp, wp} from '../Config/responsive';
import Ionicons from 'react-native-vector-icons/Ionicons';
export const AutoFillGoogleComp = ({
  handleButtonClick,
  inputContainerStyle,
  inputPlaceHolder,
  inputVal,
  onChangeText,
  key,
  defaultValue,
  textInputStyle,
}) => {
  return (
    <GooglePlacesAutocomplete
      textInputProps={{
        placeholderTextColor: Colors.gray,
        value: inputVal,
        onChangeText: text => {
          onChangeText(text);
          // Update the state with the current input text
        },
        defaultValue: defaultValue,
      }}
      placeholder={inputPlaceHolder}
      returnKeyType="default"
      fetchDetails={true}
      key={key}
      // currentLocation={true}
      //   listViewDisplayed
      // currentLocationLabel=" "
      isRowScrollable={true}
      keepResultsAfterBlur={false}
      enablePoweredByContainer={false}
      predefinedPlacesAlwaysVisible
      listViewDisplayed="auto"
      styles={{
        container: {
          zIndex: 1,
          height: 'auto',
          overflow: 'hidden',
          maxHeight: hp('18'),
          //   position: 'absolute',
        }, // Added to adjust container flex
        textInputContainer: {
          ...inputContainerStyle,
          height: hp('5.3'),
          overflow: 'hidden',
          borderWidth: 0.2,
          borderRadius: 10,
        },
        // Modified placeholder style

        textInput: {
          color: 'black',
          fontSize: hp('1.8'),
          backgroundColor: 'white',
          ...textInputStyle,
          //   flex: 1,
        },
        predefinedPlacesDescription: {
          color: 'black',
        },
        listView: {
          marginTop: 0,
          padding: 0,
        },
        separator: {
          height: 0.5,
          backgroundColor: '#c8c7cc',
        },
        description: {
          width: wp('85'),
          color: Colors.gray,
        },
        loader: {
          flexDirection: 'row',
          justifyContent: 'flex-end',
        },
      }}
      onPress={(data, details = null) => {
        const {lat, lng} = details.geometry.location;
        handleButtonClick({
          ...data,
          coords: {
            lat,
            lng,
          },
        });
        // handleButtonClick(data,{ lat, lng });
      }}
      query={{
        key: 'AIzaSyAu-nEBbiOahfUyeMc8Lc1gTTKfete_wnQ',
        language: 'en',
      }}
    />
  );
};
