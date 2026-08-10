import {useEffect, useRef, useState} from 'react';
import {Dimensions, Platform} from 'react-native';
import {
  fetchRailwayCrossingAPI,
  filterKeyFromArry,
  getDistanceFromLatLonInKm,
  getDistancesBetweenLocationsArry,
  getProperLocation,
  matchIDinTwoArry,
  matchTwoArrays,
} from '../../Services/GlobalFunctions';
import Geolocation from '@react-native-community/geolocation';
import {
  localNotifeeNotification,
  localNotification,
} from '../../Services/LocalNotificationService';
import {getDistance} from 'geolib';
import {errorMessage} from '../../Config/NotificationMessage';
import {useQuery} from '@tanstack/react-query';
import API from '../../Utils/helperFunc';
import {allContactsUrl} from '../../Utils/Urls';
import SendSMS from 'react-native-sms';
import call from 'react-native-phone-call';

const useSOSScreen = ({addListener, navigate}) => {
  const {width, height} = Dimensions.get('window');

  // Calculate half the screen dimensions
  const halfWidth = width;
  const halfHeight = height / 0.5;

  // Calculate the aspect ratio for half the screen
  const ACPT_RATIO_HALF = halfWidth / halfHeight;

  // Determine the latitude delta
  const latitudeDelta = 0.01;

  // Calculate the longitude delta for half the screen
  const laongituteDalta = latitudeDelta * ACPT_RATIO_HALF;

  const [locationData, setLocationData] = useState({
    startLocation: {
      description: '',
      coords: {
        lat: '',
        long: '',
      },
    },
  });

  const [contacts, setContacts] = useState([]);

  const setTheValForMap = async () => {
    const location = await getProperLocation();
    if (location?.ok == true) {
      valChange('startLocation', location?.location ?? location);
    }
    // if (ok) setRailwayTracks(data);
  };

  const sendMessage = phoneNumber => {
    SendSMS.send(
      {
        body: 'This is an emergency message!',
        recipients: phoneNumber,
        successTypes: ['sent', 'queued'],
        allowAndroidSendWithoutReadPermission: true,
      },
      (completed, cancelled, error) => {
        console.log(
          'SMS Callback: completed: ' +
            completed +
            ' cancelled: ' +
            cancelled +
            'error: ' +
            error,
        );
      },
    );
  };

  const makePhoneCall = phoneNumber => {
    const args = {
      number: phoneNumber, // String - phone number
      prompt: true, // Optional - shows confirmation dialog (recommended)
      // skipCanOpenCheck: false // Optional - for advanced use
    };

    call(args)
      .then(() => {
        console.log('Call initiated successfully');
      })
      .catch(error => {
        console.log('Call error:', error);
        // Handle permission errors, invalid number, etc.
      });
  };

  const {data, isSuccess} = useQuery({
    queryKey: ['allContacts'],
    queryFn: () => API.get(allContactsUrl),
  });

  useEffect(() => {
    if (isSuccess) {
      setContacts(filterKeyFromArry(data?.data?.contacts ?? [], 'phone'));
    }
  }, [isSuccess]);

  const useEffectFun = () => {
    setTheValForMap();
  };

  useEffect(useEffectFun, []);

  const {startLocation} = locationData;

  const updateState = data => setLocationData(prev => ({...prev, ...data}));

  const valChange = (key, val) => {
    updateState({[key]: val});
  };

  const dynamicNav = (route, item) => navigate(route, item);

  return {
    laongituteDalta,
    latitudeDelta,
    valChange,
    dynamicNav,
    startLocation,
    allContacts: data?.data?.contacts ?? [],
    sendMessage,
    setContacts,
    selectedContacts: contacts,
    makePhoneCall,
  };
};

export default useSOSScreen;
