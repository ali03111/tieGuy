import {View, Text, ScrollView, Image} from 'react-native';
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
import {contactArry} from '../../Utils/localDB';
import {CircleImage} from '../../Components/CircleImage';
import {phone} from '../../Assets';
import {imageUrl} from '../../Utils/Urls';

const SOSScreen = ({navigation}) => {
  const {
    dynamicNav,
    laongituteDalta,
    latitudeDelta,
    startLocation,
    valChange,
    allContacts,
    sendMessage,
    selectedContacts,
    setContacts,
  } = useSOSScreen(navigation);

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
            latitude: startLocation?.coords?.lat
              ? startLocation?.coords?.lat
              : 37.78825,
            longitude: startLocation?.coords?.long
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
      contacts.map((res, index) => {
        return (
          <View style={styles.contactView} key={index}>
            <CircleImage image={imageUrl(res?.image)} uri={true} />
            <View style={styles.midleTextView}>
              <TextComponent text={res?.name} styles={styles.contactName} />
              <View style={styles.numberView}>
                <Image
                  source={phone}
                  resizeMode="contain"
                  style={{width: wp('5'), marginRight: wp('1')}}
                />
                <TextComponent text={res?.phone} />
              </View>
            </View>
            <CheckBox
              value={Boolean(selectedContacts.includes(res?.phone))}
              onValueChange={() => {
                if (selectedContacts.includes(res?.phone))
                  setContacts(prev => prev.filter(val => val != res.phone));
                else setContacts([...selectedContacts, res?.phone]);
              }}
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
        <ContactsMapView contacts={allContacts} />
        {selectedContacts.length > 0 && (
          <ThemeButton
            title={'Send Notification'}
            style={{width: wp('95'), alignSelf: 'center', marginTop: hp('2')}}
            onPress={sendMessage}
          />
        )}
      </ScrollView>
    </View>
  );
};

export default memo(SOSScreen);
