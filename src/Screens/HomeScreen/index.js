import React, {useCallback, useRef, useState} from 'react';
import {View, Text, Touchable, Image} from 'react-native';
import useReduxStore from '../../Hooks/UseReduxStore';

import useHomeScreen from './useHomeScreen';
import {styles} from './styles';
import MapView from 'react-native-maps';
import {hp, wp} from '../../Config/responsive';
import {Line, locationArrow, routeIcon} from '../../Assets';
import {AutoFillGoogleComp} from '../../Components/AutoFillGoogleComp';
import KeyBoardWrapper from '../../Components/KeyBoardWrapper';
import {Colors} from '../../Theme/Variables';
import InputView from './InputView';
import WeatherComp from '../../Components/WeatherComp';
import EmergencyCardComp from '../../Components/EmergencyCardComp';

const HomeScreen = ({navigation}) => {
  const {
    laongituteDalta,
    latitudeDelta,
    endLocation,
    startLocation,
    dynamicNav,
    updateState,
    valChange,
    updateDescription,
  } = useHomeScreen(navigation);

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
    <KeyBoardWrapper styles={styles.homeMain} scroll={true}>
      <RenderMap />
      <InputView
        startValFun={val => valChange('startLocation', val)}
        endValFun={val => valChange('endLocation', val)}
        chageDes={(locationType, des) => updateDescription(locationType, des)}
        endLocation={endLocation?.description}
        startLocation={startLocation?.description}
      />
      <View style={{marginTop: hp('18')}}>
        <WeatherComp />
      </View>
      <EmergencyCardComp />
    </KeyBoardWrapper>
  );
};

export default HomeScreen;
