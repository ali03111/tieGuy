import React from 'react';
import {View, Text, Platform, ScrollView} from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {Colors} from '../Theme/Variables';
import {hp, wp} from '../Config/responsive';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {MapAPIKey} from '../Utils/Urls';
export const AutoFillGoogleComp = ({
  handleButtonClick,
  inputContainerStyle,
  inputPlaceHolder,
  inputVal,
  onChangeText,
  key,
  defaultValue,
  textInputStyle,
  isEdit,
}) => {
  return (
    <ScrollView scrollEnabled={false} keyboardShouldPersistTaps="always">
      <GooglePlacesAutocomplete
        textInputProps={{
          placeholderTextColor: Colors.gray,
          value: inputVal,
          // onChangeText: text => {
          //   console.log('lskjdbvjklsdbvlkjsbdkljvbsd,', text);
          //   // onChangeText(text);
          //   // Update the state with the current input text
          // },
          onChange: text => {
            console.log('lkdbvklsdbvklbsdkvbsldkbksdbkvsd', text);
            onChangeText(text?.nativeEvent?.text ?? '');
          },
          defaultValue,
          editable: isEdit,
        }}
        placeholder={inputPlaceHolder}
        returnKeyType="default"
        fetchDetails={true}
        // key={key}
        // currentLocation={true}
        //   listViewDisplayed
        // currentLocationLabel=" "
        isRowScrollable={true}
        enablePoweredByContainer={false}
        predefinedPlacesAlwaysVisible
        listViewDisplayed={false}
        // keepResultsAfterBlur={true}
        keyboardShouldPersistTaps="always"
        styles={{
          container: {
            zIndex: 1,
            height: 'auto',
            // overflow: 'hidden',
            maxHeight: hp('18'),
            //   position: 'absolute',
          }, // Added to adjust container flex
          textInputContainer: {
            ...inputContainerStyle,
            height: Platform.OS == 'android' ? hp('5.3') : 'auto',
            // overflow: 'hidden',
          },
          // Modified placeholder style

          textInput: {
            color: 'black',
            fontSize: hp('1.8'),
            backgroundColor: 'white',
            borderRadius: 5,

            borderWidth: 0.7,
            overflow: 'hidden',
            ...textInputStyle,
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
            width: wp('77'),
            color: Colors.gray,
          },
          loader: {
            flexDirection: 'row',
            justifyContent: 'flex-end',
          },
        }}
        onPress={(data, details = null) => {
          const {lat, lng} = details.geometry.location;

          console.log(
            'kbklsbdklvbskldbvklsbdklvbslkdbvlksdbvklbdvklsdblkv',
            lat,
            lng,
          );
          handleButtonClick({
            ...data,
            coords: {
              lat,
              long: lng,
            },
          });
          // handleButtonClick(data,{ lat, lng });
        }}
        query={{
          key: MapAPIKey,
          language: 'en',
        }}
      />
    </ScrollView>
  );
};
