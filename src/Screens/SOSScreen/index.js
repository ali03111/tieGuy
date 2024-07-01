import {View, Text, ScrollView} from 'react-native';
import React, {memo, useCallback} from 'react';
import {HeaderComponent} from '../../Components/HeaderComponent';
import MapView from 'react-native-maps';
import useSOSScreen from './useSOSScreen';
import {styles} from './styles';
import {TextComponent} from '../../Components/TextComponent';
import CheckBox from '@react-native-community/checkbox';
import {Colors} from '../../Theme/Variables';
import ThemeButton from '../../Components/ThemeButton';
import {hp, wp} from '../../Config/responsive';

const SOSScreen = ({navigation}) => {
  const {dynamicNav, laongituteDalta, latitudeDelta, startLocation, valChange} =
    useSOSScreen(navigation);

  const RenderMap = useCallback(
    ({childern}) => {
      // console.log('skd nv.ksndl;vnsdlnvsndlvsd', endLocation);
      return (
        <MapView
          // provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={styles.staticMapImg}
          followsUserLocation={true}
          showsUserLocation={true}
          zoomEnabled={true}
          focusable={true}
          moveOnMarkerPress
          showsMyLocationButton
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
          rotateEnabled={true}></MapView>
      );
    },
    [startLocation?.description],
  );

  const ContactsMapView = ({contacts}) => {
    return (
      contacts.length > 0 &&
      contacts.map(res => {
        return (
          <View style={styles.contactView}>
            <TextComponent text={'energency conibsdsdsg'} />
            <CheckBox
              disabled={false}
              value={true}
              onCheckColor={Colors.primaryColor}
              onTintColor={Colors.primaryColor}
            />
          </View>
        );
      })
    );
  };

  return (
    <View style={{flexGrow: 1}}>
      <HeaderComponent headerTitle={'SOS Screen'} />
      <ScrollView
        bounces={false}
        contentContainerStyle={{flexGrow: 1, paddingBottom: hp('25')}}
        showsVerticalScrollIndicator={false}>
        <RenderMap />
        <TextComponent text={'Emergency Contacts'} styles={styles.heading} />
        <ContactsMapView contacts={[1, 2, 3, 5, 6, 8, 9, 7]} />
        <ThemeButton
          title={'Send Notification'}
          style={{width: wp('95'), alignSelf: 'center', marginTop: hp('2')}}
        />
      </ScrollView>
    </View>
  );
};

export default memo(SOSScreen);
