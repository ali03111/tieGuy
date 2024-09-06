import React, {useCallback, useRef, useState} from 'react';
import {View, Text, Touchable, Image, Platform} from 'react-native';
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
import {AlertDesign} from '../../Components/AlertDesign';

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
    startDescription,
    subAlert,
    userData,
    setSubAlert,
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
  }, [startLocation?.description, startLocation.coords.lat]);

  const RenderMap = useCallback(
    ({childern}) => {
      return (
        <MapView
          // provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={styles.staticMapImg}
          followsUserLocation={true}
          showsUserLocation={true}
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
          {/* <CurrentMarker /> */}
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
    <KeyBoardWrapper
      styles={styles.homeMain}
      scroll={true}
      bounces={false}
      keyboardShouldPersistTaps={'always'}>
      <InputView
        startValFun={val => valChange('startLocation', val)}
        endValFun={val => {
          valChange('endLocation', val);
          getKiloMeter({}, val);
        }}
        chageDes={(locationType, des) => updateDescription(locationType, des)}
        endLocation={endLocation?.description}
        startLocation={startDescription ?? startLocation?.description}
        startYourTracking={() => {
          valChange('startTracking', true);
          // startYourTracking();
        }}
        isShowBtn={isShowBtn}
        isTrackingStart={startTracking}
        stopTracking={stopTracking}
        railwayTracks={railwayTracks.current}
        kiloMeter={kiloMeterRef}
        currentCoords={startLocation.coords}
        userData={userData}
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
      <View
        style={{
          marginTop: !isShowBtn
            ? Platform.OS == 'ios'
              ? hp('8')
              : hp('6')
            : hp('7.8'),
        }}>
        <WeatherComp
          addListener={navigation.addListener}
          startLocationDes={startLocation.description}
          startLocation={startLocation}
        />
      </View>
      <EmergencyCardComp onPress={() => dynamicNav('EmergencyContactScreen')} />

      <AlertDesign
        isVisible={subAlert}
        message={
          'Your subscription has been expired, kindly re-subscribe to use the app features!'
        }
        title={'Warning'}
        confirmText={'Re-Subscribe'}
        onConfirm={() => {
          setSubAlert(false);
          setTimeout(() => {
            dynamicNav('AfterSubscriptionScreen');
          }, 500);
        }}
        onCancel={() => setSubAlert(false)}
        msgStyle={{textAlign: 'center'}}
      />
    </KeyBoardWrapper>
  );
};

export default HomeScreen;
