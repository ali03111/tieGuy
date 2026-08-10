import {useEffect, useRef, useState} from 'react';
import {AppState, Dimensions, Platform} from 'react-native';
import {
  applyForNotifiPer,
  getCurrentLocation,
  getDistanceFromLatLonInKm,
  getDistancesBetweenLocationsArry,
  getProperLocation,
  hasOneMonthPassed,
} from '../../Services/GlobalFunctions';
import Geolocation from '@react-native-community/geolocation';
import {localNotifeeNotification} from '../../Services/LocalNotificationService';
import useReduxStore from '../../Hooks/UseReduxStore';
import {loadingFalse, loadingTrue} from '../../Redux/Action/isloadingAction';
import {store} from '../../Redux/Reducer';
import {useMutation} from '@tanstack/react-query';
import API from '../../Utils/helperFunc';
import {GetCrossingUrl} from '../../Utils/Urls';

// Helper Function
const hasActiveAccess = userData => {
  if (!userData) return false;

  if (userData.identifier && userData.identifier !== null) return true;
  if (userData.start_trial_at && !hasOneMonthPassed(userData.start_trial_at))
    return true;

  return false;
};

const useHomeScreenNew = ({addListener, navigate}) => {
  const notificationDistance = 2;
  const distanceUnit = 'km';
  const refreshThresholdKM = 2;
  const hysteresisDistance = 1.5;
  const threshold =
    distanceUnit === 'miles'
      ? notificationDistance * 1.60934
      : notificationDistance;
  const resetThreshold = threshold * hysteresisDistance;

  const {getState, dispatch} = useReduxStore();
  const {userData, isLogin} = getState('Auth');

  const hasAccess = hasActiveAccess(userData); // true = can receive notifications

  const {width, height} = Dimensions.get('window');
  const watchId = useRef(null);
  const kiloMeterRef = useRef(0);
  const railwayTracksRef = useRef([]);
  const trackThatNotifyRef = useRef([]);
  const lastMutatePositionRef = useRef(null);
  const appState = useRef(AppState.currentState);
  const intervalId = useRef(null);

  // Map Settings
  const halfWidth = width;
  const halfHeight = height / 1.7;
  const ACPT_RATIO_HALF = halfWidth / halfHeight;
  const latitudeDelta = Platform.OS === 'ios' ? 0.022 : 0.022;
  const longitudeDelta = latitudeDelta * ACPT_RATIO_HALF;
  const laongituteDalta = longitudeDelta;

  const [locationData, setLocationData] = useState({
    startLocation: {description: '', coords: {lat: null, long: null}},
    endLocation: {description: '', coords: {lat: '', long: ''}},
    startTracking: false,
    startDescription: null,
  });

  const [startLocationState, setStartLocationState] = useState({
    description: '',
    coords: {lat: null, long: null},
  });

  const [dummy, setDummy] = useState(1);
  const [subAlert, setSubAlert] = useState(false);
  const [previousRouteCoordinates, setPreviousRouteCoordinates] = useState([]);

  const {mutate} = useMutation({
    mutationFn: body => API.post(GetCrossingUrl, body),
    onSuccess: ({ok, data}) => {
      if (ok) {
        railwayTracksRef.current = data?.crossings || [];
        setDummy(prev => prev + 1);
      }
    },
    onError: error => console.log('Mutation error:', error),
  });

  // ================== NOTIFICATION CONTROL ==================
  const checkForRailwayNotifications = (latitude, longitude) => {
    if (!hasAccess) return; // ← Only stop notifications

    const currentPosition = {lat: latitude, long: longitude};
    const distances = getDistancesBetweenLocationsArry(
      currentPosition,
      railwayTracksRef.current,
    );

    // Prune old notified tracks
    trackThatNotifyRef.current = trackThatNotifyRef.current.filter(track => {
      const distInfo = distances.find(d => d.id === track.id);
      const dist = distInfo
        ? distInfo.km
        : getDistanceFromLatLonInKm(latitude, longitude, track.lat, track.long);
      return parseFloat(dist) <= resetThreshold;
    });

    const nearbyNow = distances.filter(res => parseFloat(res.km) <= threshold);

    if (nearbyNow.length > 0) {
      const notYetNotified = nearbyNow.filter(
        n => !trackThatNotifyRef.current.some(t => t.id === n.id),
      );

      if (notYetNotified.length > 0) {
        notYetNotified.forEach(res => {
          trackThatNotifyRef.current.push(res);
          localNotifeeNotification(); // ← Push Notification
          console.log('NOTIFY → crossing:', res.id, 'at', res.km, 'km');
        });
      }
    }
  };

  const refetchIfNeeded = (latitude, longitude) => {
    if (!lastMutatePositionRef.current) {
      lastMutatePositionRef.current = {lat: latitude, long: longitude};
      mutate({latitude, longitude});
      return;
    }

    const distance = getDistanceFromLatLonInKm(
      lastMutatePositionRef.current.lat,
      lastMutatePositionRef.current.long,
      latitude,
      longitude,
    );

    if (distance >= refreshThresholdKM) {
      lastMutatePositionRef.current = {lat: latitude, long: longitude};
      mutate({latitude, longitude});
    }
  };

  const startYourTracking = () => {
    if (watchId.current !== null) {
      Geolocation.clearWatch(watchId.current);
    }

    watchId.current = Geolocation.watchPosition(
      position => {
        const {latitude, longitude} = position.coords;

        refetchIfNeeded(latitude, longitude);
        checkForRailwayNotifications(latitude, longitude); // notifications controlled inside

        setDummy(prev => prev + 1);
      },
      error => console.log('Geolocation error:', error),
      {
        enableHighAccuracy: true,
        distanceFilter: 10,
        interval: 5000,
        fastestInterval: 2000,
        timeout: 15000,
        maximumAge: 0,
      },
    );
  };

  const setTheValForMap = async () => {
    const location = await getProperLocation();
    if (location?.ok === true || location?.location?.ok === true) {
      dispatch(loadingTrue());
      const loc = location?.location ?? location;
      if (loc.coords?.lat != null) {
        setStartLocationState(loc);
        const lat = loc.coords.lat;
        const long = loc.coords.long;
        lastMutatePositionRef.current = {lat, long};
        mutate({latitude: lat, longitude: long});
      }
      dispatch(loadingFalse());
    }
    if (Platform.OS === 'android') {
      applyForNotifiPer();
    }
  };

  // Background App State
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextState => {
      if (nextState.match(/inactive|background/) && isLogin) {
        intervalId.current = setInterval(async () => {
          try {
            const location = await getCurrentLocation();
            if (location?.ok || location?.location?.ok) {
              const loc = location.location ?? location;
              const {lat, long} = loc.coords;
              refetchIfNeeded(lat, long);
              checkForRailwayNotifications(lat, long); // notifications blocked if no access
            }
          } catch (err) {
            console.log('Background location fetch error:', err);
          }
        }, 10000);
      } else if (nextState === 'active') {
        if (intervalId.current) {
          clearInterval(intervalId.current);
          intervalId.current = null;
        }
      }
    });

    return () => subscription.remove();
  }, [isLogin, hasAccess]);

  // Screen Focus
  useEffect(() => {
    const focusEvent = addListener('focus', async () => {
      const currentUser = store.getState().Auth?.userData;

      if (isLogin && !hasActiveAccess(currentUser)) {
        setSubAlert(true);
      } else {
        setSubAlert(false);
      }

      const location = await getCurrentLocation();
      if (location?.ok || location?.location?.ok) {
        const loc = location.location ?? location;
        const {lat, long} = loc.coords;
        refetchIfNeeded(lat, long);
        checkForRailwayNotifications(lat, long);
      }
    });

    return focusEvent;
  }, [addListener]);

  // Initial Mount
  useEffect(() => {
    setTheValForMap();

    return () => {
      if (watchId.current !== null) Geolocation.clearWatch(watchId.current);
      if (intervalId.current) clearInterval(intervalId.current);
    };
  }, []);

  const updateState = data => setLocationData(prev => ({...prev, ...data}));
  const valChange = async (key, val) => updateState({[key]: val});
  const dynamicNav = (route, item) => navigate(route, item);

  return {
    longitudeDelta,
    latitudeDelta,
    valChange,
    dynamicNav,
    startYourTracking,
    railwayTracks: railwayTracksRef,
    startTracking: locationData.startTracking,
    subAlert,
    setSubAlert,
    userData,
    startLocationState,
    laongituteDalta,
    hasAccess,
    trackThatNotifyRef,
  };
};

export default useHomeScreenNew;
