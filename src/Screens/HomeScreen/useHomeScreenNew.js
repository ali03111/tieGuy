import {useEffect, useRef, useState} from 'react';
import {AppState, Dimensions, Platform} from 'react-native';
import {
  applyForNotifiPer,
  getCurrentLocation,
  getDistanceFromLatLonInKm,
  getDistancesBetweenLocationsArry,
  getProperLocation,
  hasOneMonthPassed,
  matchIDBetweenTwoArry,
  matchTwoArrays,
} from '../../Services/GlobalFunctions';
import Geolocation from '@react-native-community/geolocation';
import {localNotifeeNotification} from '../../Services/LocalNotificationService';
import useReduxStore from '../../Hooks/UseReduxStore';
import {loadingFalse, loadingTrue} from '../../Redux/Action/isloadingAction';
import {store} from '../../Redux/Reducer';
import {useMutation} from '@tanstack/react-query';
import API from '../../Utils/helperFunc';
import {GetCrossingUrl} from '../../Utils/Urls';

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

  const {width, height} = Dimensions.get('window');
  const watchId = useRef(null);
  const kiloMeterRef = useRef(0);
  const railwayTracksRef = useRef([]);
  const trackThatNotifyRef = useRef([]); // notified crossings, but prune when far
  const lastMutatePositionRef = useRef(null);
  const appState = useRef(AppState.currentState);
  const intervalId = useRef(null);

  // Map region calculations
  const halfWidth = width;
  const halfHeight = height / 1.7;
  const ACPT_RATIO_HALF = halfWidth / halfHeight;
  const latitudeDelta = Platform.OS === 'ios' ? 0.022 : 0.022;
  const longitudeDelta = latitudeDelta * ACPT_RATIO_HALF;
  const laongituteDalta = longitudeDelta; // typo kept as in original

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
  const [KmBetweenTwoPoint, setKmBetweenTwoPoints] = useState(0);

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

  const checkForRailwayNotifications = (latitude, longitude) => {
    const currentPosition = {lat: latitude, long: longitude};
    const distances = getDistancesBetweenLocationsArry(
      currentPosition,
      railwayTracksRef.current,
    );

    console.log('Current position:', {latitude, longitude});
    console.log('Distances to crossings:', distances);

    // Prune notified tracks that are now far away (allow re-notify if re-approach)
    trackThatNotifyRef.current = trackThatNotifyRef.current.filter(track => {
      const distInfo = distances.find(d => d.id === track.id);
      const dist = distInfo
        ? distInfo.km
        : getDistanceFromLatLonInKm(latitude, longitude, track.lat, track.long);
      return parseFloat(dist) <= resetThreshold;
    });

    // Find crossings within threshold
    const nearbyNow = distances.filter(res => parseFloat(res.km) <= threshold);

    if (nearbyNow.length > 0) {
      // Exclude already notified
      const notYetNotified = nearbyNow.filter(
        n => !trackThatNotifyRef.current.some(t => t.id === n.id),
      );

      if (notYetNotified.length > 0) {
        console.log('Nearby new crossings to notify:', notYetNotified);
        notYetNotified.forEach(res => {
          trackThatNotifyRef.current.push(res);
          localNotifeeNotification();
          console.log('NOTIFY → crossing:', res.id, 'at', res.km, 'km');
          console.log('Total notified crossings:', trackThatNotifyRef.current);
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
        checkForRailwayNotifications(latitude, longitude);

        if (locationData.startTracking) {
          getKiloMeter(position.coords);
        }

        setDummy(prev => prev + 1);
      },
      error => console.log('Geolocation error:', error),
      {
        enableHighAccuracy: true,
        distanceFilter: 10, // Lower for more sensitivity
        interval: 5000, // Android: desired interval
        fastestInterval: 2000, // Android: fastest possible
        timeout: 15000,
        maximumAge: 0,
      },
    );
  };

  const updateDescription = (locationType, newDescription) => {
    valChange(locationType, {
      ...locationData[locationType],
      description: newDescription,
    });
  };

  const setTheValForMap = async () => {
    const location = await getProperLocation();
    if (location?.ok === true || location?.location?.ok === true) {
      dispatch(loadingTrue());
      const loc = location?.location ?? location;
      if (loc.coords?.lat != null) {
        setStartLocationState(loc);
        await valChange('startLocation', loc);
        const lat = loc.coords.lat;
        const long = loc.coords.long;
        lastMutatePositionRef.current = {lat, long};
        mutate({latitude: lat, longitude: long});
      }
      await valChange('startDescription', loc.description);
      startYourTracking();
    }
    if (Platform.OS === 'android') {
      applyForNotifiPer();
    }
    dispatch(loadingFalse());
  };

  const onDirectionReady = result => {
    const newRouteCoordinates = result.coordinates;
    if (routeChanged(newRouteCoordinates)) {
      setPreviousRouteCoordinates(newRouteCoordinates);
    }
  };

  const routeChanged = newRouteCoordinates => {
    if (newRouteCoordinates.length !== previousRouteCoordinates.length)
      return true;
    for (let i = 0; i < newRouteCoordinates.length; i++) {
      const n = newRouteCoordinates[i];
      const p = previousRouteCoordinates[i];
      if (
        Math.abs(n.latitude - p.latitude) > 0.0001 ||
        Math.abs(n.longitude - p.longitude) > 0.0001
      ) {
        return true;
      }
    }
    return false;
  };

  const stopTracking = () => {
    valChange('startTracking', false);
  };

  useEffect(() => {
    setTheValForMap();

    return () => {
      if (watchId.current !== null) {
        Geolocation.clearWatch(watchId.current);
        watchId.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextState => {
      if (nextState.match(/inactive|background/) && isLogin) {
        // Fallback polling in background (JS timers may be throttled on Android)
        intervalId.current = setInterval(async () => {
          try {
            const location = await getCurrentLocation();
            if (location?.ok || location?.location?.ok) {
              const loc = location.location ?? location;
              const {lat, long} = loc.coords;
              refetchIfNeeded(lat, long);
              checkForRailwayNotifications(lat, long);
            }
          } catch (err) {
            console.log('Background location fetch error:', err);
          }
        }, 10000); // every 10s - adjust as needed
      } else if (nextState === 'active' && isLogin) {
        if (intervalId.current) {
          clearInterval(intervalId.current);
          intervalId.current = null;
        }
      }
      appState.current = nextState;
    });

    return () => subscription.remove();
  }, [isLogin]);

  useEffect(() => {
    const focusEvent = addListener('focus', async () => {
      const {Auth} = store.getState();
      if (
        hasOneMonthPassed(Auth.userData?.start_trial_at) &&
        Auth.userData?.identifier == null
      ) {
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

  const {startLocation, endLocation, startTracking, startDescription} =
    locationData;
  const updateState = data => setLocationData(prev => ({...prev, ...data}));
  const valChange = async (key, val) => {
    updateState({[key]: val});
  };
  const dynamicNav = (route, item) => navigate(route, item);

  const getKiloMeter = (user, end) => {
    const distance = getDistanceFromLatLonInKm(
      user?.latitude ??
        startLocation?.coords?.lat ??
        startLocationState.coords.lat,
      user?.longitude ??
        startLocation?.coords?.long ??
        startLocationState.coords.long,
      end?.coords?.lat ?? endLocation.coords.lat,
      end?.coords?.long ?? endLocation.coords.long,
    );
    kiloMeterRef.current = distance;
    setDummy(prev => prev + 1);
  };

  return {
    longitudeDelta,
    latitudeDelta,
    valChange,
    dynamicNav,
    updateState,
    startLocation,
    endLocation,
    updateDescription,
    startYourTracking,
    railwayTracks: railwayTracksRef,
    onDirectionReady,
    previousRouteCoordinates,
    startTracking,
    stopTracking,
    kiloMeterRef,
    getKiloMeter,
    startDescription,
    subAlert,
    setSubAlert,
    userData,
    KmBetweenTwoPoint,
    startLocationState,
    laongituteDalta,
    trackThatNotifyRef,
  };
};

export default useHomeScreenNew;
