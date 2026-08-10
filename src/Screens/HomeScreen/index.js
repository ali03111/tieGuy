import React, {useCallback} from 'react';
import {View, Platform, Image} from 'react-native';
import useHomeScreenNew from './useHomeScreenNew';
import {styles} from './styles';
import MapView, {Marker, Circle} from 'react-native-maps';
import {hp, wp} from '../../Config/responsive';
import {desMarker, train} from '../../Assets/index';
import KeyBoardWrapper from '../../Components/KeyBoardWrapper';
import WeatherComp from '../../Components/WeatherComp';
import EmergencyCardComp from '../../Components/EmergencyCardComp';
import MapViewDirections from 'react-native-maps-directions';
import {MapAPIKey} from '../../Utils/Urls';
import {AlertDesign} from '../../Components/AlertDesign';

const HomeScreen = ({navigation}) => {
  const {
    laongituteDalta,
    latitudeDelta,
    startLocationState,
    railwayTracks,
    subAlert,
    setSubAlert,
    dynamicNav,
    startLocation, // keeping it for backward compatibility
  } = useHomeScreenNew(navigation);

  // Safe fallback for start location
  const currentStartLat =
    startLocation?.coords?.lat ?? startLocationState?.coords?.lat ?? 37.78825;
  const currentStartLong =
    startLocation?.coords?.long ??
    startLocationState?.coords?.long ??
    -122.4324;

  const RenderMap = useCallback(
    ({children}) => (
      <MapView
        style={styles.staticMapImg}
        showsUserLocation={true}
        followsUserLocation={true}
        region={{
          latitude: currentStartLat,
          longitude: currentStartLong,
          latitudeDelta,
          longitudeDelta: laongituteDalta,
        }}>
        {children}
      </MapView>
    ),
    [currentStartLat, currentStartLong, latitudeDelta, laongituteDalta],
  );

  return (
    <KeyBoardWrapper
      styles={styles.homeMain}
      scroll={true}
      bounces={false}
      keyboardShouldPersistTaps="always">
      <RenderMap
        children={
          <>
            {/* Destination Marker + Route */}
            {startLocation?.coords?.lat && startLocation?.coords?.long && (
              <MapViewDirections
                origin={{
                  latitude: currentStartLat,
                  longitude: currentStartLong,
                }}
                destination={{
                  latitude: startLocation?.coords?.lat, // You can change to endLocation later
                  longitude: startLocation?.coords?.long,
                }}
                optimizeWaypoints
                geodesic
                mode="DRIVING"
                strokeWidth={5}
                strokeColors={['#0518FD']}
                apikey={MapAPIKey}
              />
            )}

            {/* Railway Crossings Markers */}
            {railwayTracks.current?.length > 0 &&
              railwayTracks.current.map((res, index) => (
                <Marker
                  key={`rail-${index}`}
                  coordinate={{
                    latitude: Number(res.latitude || res.lat),
                    longitude: Number(res.longitude || res.long),
                  }}>
                  <Image
                    style={{height: hp('6'), width: wp('10')}}
                    resizeMode="contain"
                    source={train}
                  />
                </Marker>
              ))}
          </>
        }
      />

      <View>
        <WeatherComp
          addListener={navigation.addListener}
          startLocationDes={startLocationState?.description}
        />
      </View>

      <EmergencyCardComp onPress={() => dynamicNav('EmergencyContactScreen')} />

      {/* Subscription Alert */}
      <AlertDesign
        isVisible={subAlert}
        message="Your subscription has been expired, kindly re-subscribe to continue using tracking & notification features!"
        title="Subscription Required"
        confirmText="Re-Subscribe"
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
