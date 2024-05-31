import React, {useCallback, useRef, useState} from 'react';
import {View, Text, Touchable, Image} from 'react-native';
import useReduxStore from '../../Hooks/UseReduxStore';

import useHomeScreen from './useHomeScreen';
import {styles} from './styles';
import MapView from 'react-native-maps';
import {hp, wp} from '../../Config/responsive';
import {locationArrow} from '../../Assets';
import {AutoFillGoogleComp} from '../../Components/AutoFillGoogleComp';

const HomeScreen = ({navigation}) => {
  const {laongituteDalta, latitudeDelta} = useHomeScreen(navigation);

  const RenderMap = useCallback(({item, index}) => {
    return (
      <MapView
        // provider={PROVIDER_GOOGLE} // remove if not using Google Maps
        style={styles.staticMapImg}
        followsUserLocation={true}
        showsUserLocation={true}
        zoomEnabled={true}
        focusable={true}
        moveOnMarkerPress
        zoomTapEnabled
        showsMyLocationButton
        mapType="satelliteFlyover"
        region={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: latitudeDelta,
          longitudeDelta: laongituteDalta,
        }}
        rotateEnabled={true}
      />
    );
  }, []);

  return (
    <View style={styles.homeMain}>
      <RenderMap />
      <View
        style={{
          width: wp('95'),
          borderRadius: 10,
          paddingVertical: hp('3'),
          backgroundColor: 'white',
          alignSelf: 'center',
        }}>
        <View style={styles.inputArea}>
          <Image source={locationArrow} style={styles.inputLeftImg} />
          <AutoFillGoogleComp
            handleButtonClick={
              e => {}
              // updateInputState({locationInput: e})
            }
            key={0}
            inputPlaceHolder="Choose Start Location"
            // inputVal={locationInput.description}
            // defaultValue={locationInput.description}
            inputContainerStyle={{width: wp('80'), marginLeft: wp('1')}}
            onChangeText={
              text => {}
              // updateInputState({locationInput: {description: text}})
            }
          />
        </View>
      </View>
    </View>
  );
};

export default HomeScreen;
