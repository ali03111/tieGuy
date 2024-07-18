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

  const sendMessage = () => {
    SendSMS.send(
      {
        body: 'The default body of the SMS!',
        recipients: filterKeyFromArry(data?.data?.contacts, 'phone'),
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

  const {data} = useQuery({
    queryKey: ['allContacts'],
    queryFn: () => API.get(allContactsUrl),
  });

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
  };
};

export default useSOSScreen;
