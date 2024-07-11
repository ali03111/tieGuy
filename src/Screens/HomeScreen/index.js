import React, {useCallback, useRef, useState} from 'react';
import {View, Text, Touchable, Image} from 'react-native';
import useReduxStore from '../../Hooks/UseReduxStore';

import useHomeScreen from './useHomeScreen';
import {styles} from './styles';
import MapView, {Circle, Marker} from 'react-native-maps';
import {hp, wp} from '../../Config/responsive';
import {
  Line,
  desMarker,
  eye,
  locationArrow,
  routeIcon,
  train,
} from '../../Assets/index';
import {AutoFillGoogleComp} from '../../Components/AutoFillGoogleComp';
import KeyBoardWrapper from '../../Components/KeyBoardWrapper';
import {Colors} from '../../Theme/Variables';
import InputView from './InputView';
import WeatherComp from '../../Components/WeatherComp';
import EmergencyCardComp from '../../Components/EmergencyCardComp';
import MapViewDirections from 'react-native-maps-directions';
import {MapAPIKey} from '../../Utils/Urls';
import {getDistanceFromLatLonInKm} from '../../Services/GlobalFunctions';
import {localNotifeeNotification} from '../../Services/LocalNotificationService';

const HomeScreen = ({navigation}) => {
  const {
    laongituteDalta,
    latitudeDelta,
    endLocation,
    startLocation,
    railwayTracks,
    previousRouteCoordinates,
    startTracking,
    kiloMeterRef,
    dynamicNav,
    updateState,
    valChange,
    updateDescription,
    startYourTracking,
    onDirectionReady,
    stopTracking,
    getKiloMeter,
  } = useHomeScreen(navigation);

  const isShowBtn = Boolean(
    endLocation?.coords.lat != null && endLocation?.coords.lat != '',
  );

  const CurrentMarker = useCallback(() => {
    return (
      <>
        <Marker
          coordinate={{
            latitude: startLocation.coords.lat
              ? startLocation.coords.lat
              : 37.78825,
            longitude: startLocation.coords.long
              ? startLocation.coords.long
              : -122.4324,
          }}
        />
        <Circle
          center={{
            latitude: startLocation.coords.lat
              ? startLocation.coords.lat
              : 37.78825,
            longitude: startLocation.coords.long
              ? startLocation.coords.long
              : -122.4324,
          }}
          radius={500} // radius in meters
          strokeWidth={2}
          strokeColor="rgba(0, 122, 255, 1)"
          fillColor="rgba(0, 122, 255, 0.3)"
        />
      </>
    );
  }, [startLocation?.description]);

  const RenderMap = useCallback(
    ({childern}) => {
      // console.log('skd nv.ksndl;vnsdlnvsndlvsd', endLocation);
      return (
        <MapView
          // provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={styles.staticMapImg}
          // followsUserLocation={true}
          // showsUserLocation={true}
          // zoomEnabled={true}
          // focusable={true}
          // moveOnMarkerPress
          // zoomTapEnabled
          // showsMyLocationButton
          // mapType="satelliteFlyover"
          region={{
            latitude: startLocation.coords.lat
              ? startLocation.coords.lat
              : 37.78825,
            longitude: startLocation.coords.long
              ? startLocation.coords.long
              : -122.4324,
            latitudeDelta: latitudeDelta,
            longitudeDelta: laongituteDalta,
          }}
          rotateEnabled={true}>
          <CurrentMarker />
          {childern}
        </MapView>
      );
    },
    [startLocation?.description],
  );

  const MarkerForTrack = useCallback(
    ({res, index}) => {
      const km = getDistanceFromLatLonInKm(
        startLocation.coords.lat,
        startLocation.coords.long,
        res.location.latitude,
        res.location.longitude,
      );

      const isNearMe = Boolean(parseFloat(km) <= 5);

      console.log('km on railya track ', index, km, isNearMe);
      // if (isNearMe && startTracking) localNotifeeNotification();
      return (
        <Marker
          coordinate={{
            latitude: res?.location?.latitude,
            longitude: res?.location?.longitude,
            latitudeDelta,
            longitudeDelta: laongituteDalta,
          }}>
          <Image
            style={{
              height: hp('5'),
              width: wp('10'),
              display: isNearMe ? 'flex' : 'none',
            }}
            resizeMode="contain"
            source={train}
          />
        </Marker>
      );
    },
    [railwayTracks, startLocation.coords],
  );

  return (
    <KeyBoardWrapper styles={styles.homeMain} scroll={true} bounces={false}>
      <InputView
        startValFun={val => valChange('startLocation', val)}
        endValFun={val => {
          valChange('endLocation', val);
          getKiloMeter({}, val);
        }}
        chageDes={(locationType, des) => updateDescription(locationType, des)}
        endLocation={endLocation?.description}
        startLocation={startLocation?.description}
        startYourTracking={() => {
          valChange('startTracking', true);
          startYourTracking();
        }}
        isShowBtn={isShowBtn}
        isTrackingStart={startTracking}
        stopTracking={stopTracking}
        railwayTracks={railwayTracks.current}
        kiloMeter={kiloMeterRef}
        currentCoords={startLocation.coords}
      />
      <RenderMap
        childern={
          <>
            {endLocation?.coords.lat != null &&
              endLocation?.coords.lat != '' && (
                <>
                  <MapViewDirections
                    origin={{
                      latitude: startLocation.coords.lat,
                      longitude: startLocation.coords.long,
                    }}
                    precision="high"
                    destination={{
                      latitude: endLocation.coords.lat,
                      longitude: endLocation.coords.long,
                    }}
                    optimizeWaypoints
                    geodesic
                    mode="DRIVING"
                    strokeWidth={5}
                    strokeColors={['#0518FD']}
                    // strokeColors={['#FF7300']}
                    apikey={MapAPIKey} // android
                    // strokeColor={Colors.white}
                    // strokeColor={Colors.primaryColor}
                  />
                  <Marker
                    coordinate={{
                      latitude: endLocation.coords.lat,
                      longitude: endLocation.coords.long,
                      latitudeDelta,
                      longitudeDelta: laongituteDalta,
                    }}>
                    <Image
                      style={{
                        height: hp('20'),
                        width: wp('15'),
                        // backgroundColor: 'red',
                      }}
                      resizeMode="contain"
                      source={desMarker}
                    />
                  </Marker>
                </>
              )}
            {railwayTracks.current.length > 0 &&
              railwayTracks.current.map((res, index) => (
                <MarkerForTrack res={res} index={index} />
              ))}
          </>
        }
      />
      <View style={{marginTop: !isShowBtn ? hp('6') : hp('7.8')}}>
        <WeatherComp
          addListener={navigation.addListener}
          startLocationDes={startLocation.description}
        />
      </View>
      <EmergencyCardComp />
    </KeyBoardWrapper>
  );
};

export default HomeScreen;
// 13 SIGNS You Might Be Undervaluing Yourself
