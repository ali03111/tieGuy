import {useEffect, useRef, useState} from 'react';
import {AppState, Dimensions, Platform} from 'react-native';
import {
  applyForNotifiPer,
  fetchRailwayCrossingAPI,
  getCurrentLocation,
  getDistanceFromLatLonInKm,
  getDistancesBetweenLocationsArry,
  getLocationName,
  getProperLocation,
  hasOneMonthPassed,
  matchIDBetweenTwoArry,
  matchIDinTwoArry,
  matchTwoArrays,
  removeDuplicateIds,
  removeDuplicates,
} from '../../Services/GlobalFunctions';
import Geolocation from '@react-native-community/geolocation';
import {
  localNotifeeNotification,
  localNotification,
} from '../../Services/LocalNotificationService';
import {getDistance} from 'geolib';
import {errorMessage} from '../../Config/NotificationMessage';
import useReduxStore from '../../Hooks/UseReduxStore';
import {loadingFalse, loadingTrue} from '../../Redux/Action/isloadingAction';
import {store} from '../../Redux/Reducer';
import {useMutation, useQuery} from '@tanstack/react-query';
import API from '../../Utils/helperFunc';
import {GetCrossingUrl} from '../../Utils/Urls';
import {appleIdlogin} from '../../Utils/SocialLogin';
import BackgroundTimer from 'react-native-background-timer';

const useHomeScreenNew = ({addListener, navigate}) => {
  const notificationDistance = 6; // Change this value for the distance threshold
  const distanceUnit = 'km'; // Change to 'miles' if you want to use miles instead of km
  const refreshThresholdKM = 2; // Distance in km to trigger refetch of railway crossings
  const hysteresisDistance = 1.5; // Extra distance buffer to reset notification (e.g., must go 1.5x threshold away to reset)

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
  const trackThatNotifyRef = useRef([]);
  const lastMutatePositionRef = useRef(null);
  const appState = useRef(AppState.currentState);
  const intervalId = useRef(null);
  const isFirstRef = useRef(true); // New ref to track initial location check

  // Calculate half the screen dimensions
  const halfWidth = width;
  const halfHeight = height / 1.7;

  // Calculate the aspect ratio for half the screen
  const ACPT_RATIO_HALF = halfWidth / halfHeight;

  // Determine the latitude delta
  const latitudeDelta = Platform.OS == 'ios' ? 0.2 : 0.2;

  // Calculate the longitude delta for half the screen
  const laongituteDalta = latitudeDelta * ACPT_RATIO_HALF;

  // Calculate the longitude delta for half the screen
  const longitudeDelta = latitudeDelta * ACPT_RATIO_HALF;

  const [locationData, setLocationData] = useState({
    startLocation: {
      description: '',
      coords: {
        lat: null,
        long: null,
      },
    },
    endLocation: {
      description: '',
      coords: {
        lat: '',
        long: '',
      },
    },
    startTracking: false,
    startDescription: null,
  });

  const [startLocationState, setStartLocationState] = useState({
    description: '',
    coords: {
      lat: null,
      long: null,
    },
  });

  const [dummy, setDummy] = useState(1);
  const [subAlert, setSubAlert] = useState(false);

  const [previousRouteCoordinates, setPreviousRouteCoordinates] = useState([]);

  const [KmBetweenTwoPoint, setKmBetweenTwoPoints] = useState(0);

  const {mutate} = useMutation({
    mutationFn: body => {
      return API.post(GetCrossingUrl, body);
    },
    onSuccess: ({ok, data}) => {
      if (ok) {
        railwayTracksRef.current = data?.crossings;
        setDummy(prev => prev + 1);
      }
    },
    onError: error => {
      console.log('Mutation error:', error);
    },
  });

  const checkForRailwayNotifications = (latitude, longitude) => {
    const currentPosition = {lat: latitude, long: longitude};
    const distances = getDistancesBetweenLocationsArry(
      currentPosition,
      railwayTracksRef.current,
    );
    console.log(
      'distancesdistancesdistancesdistancesdistancesdistancesdistances',
      distances,
      railwayTracksRef.current,
    );
    if (isFirstRef.current) {
      // On first check (app start or restart), set current nearby tracks as already notified without triggering notification
      isFirstRef.current = false;
      const nearTracks = distances.filter(
        res => parseFloat(res.km) <= threshold,
      );
      trackThatNotifyRef.current = nearTracks; // Initialize without notification
      return; // Skip the rest of the notification logic
    }

    // Prune far-away crossings from notified list (reset if > resetThreshold)
    trackThatNotifyRef.current = trackThatNotifyRef.current.filter(track => {
      const dist =
        distances.find(d => d.id === track.id)?.km ||
        getDistanceFromLatLonInKm(latitude, longitude, track.lat, track.long);
      return parseFloat(dist) <= resetThreshold;
    });

    // Filter nearby crossings
    const afterFilterTrack = distances.filter(
      res => parseFloat(res.km) <= threshold,
    );

    if (afterFilterTrack.length > 0) {
      let afterMatch = matchIDBetweenTwoArry(
        afterFilterTrack,
        trackThatNotifyRef.current,
      );

      const newFilterArry =
        afterMatch.length > 0 ? afterMatch : afterFilterTrack;
      const needToNotify = matchTwoArrays(
        newFilterArry,
        trackThatNotifyRef.current,
      );
      needToNotify.forEach(res => {
        console.log('kjdsbfjksdbfjksdbjkfbjksdbfkjsdbjkfbksdf', res);
        if (!res.match && parseFloat(res.km) <= threshold) {
          trackThatNotifyRef.current = [...trackThatNotifyRef.current, res];
          localNotifeeNotification();
        }
      });
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
      error => {
        console.log('Geolocation error:', error);
      },
      {
        enableHighAccuracy: true,
        fastestInterval: 100,
        distanceFilter: 50, // Reduced to 50m for more frequent updates
        useSignificantChanges: true,
        timeout: Infinity, // Changed to Infinity to avoid timeouts on slow location fetches
        maximumAge: 0,
      },
    );
  };

  // Function to update the description using valChange
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
        // Removed initial checkForRailwayNotifications here; let watchPosition handle the first check
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
    const routeChangeded = routeChanged(newRouteCoordinates);
    if (routeChangeded) {
      setPreviousRouteCoordinates(newRouteCoordinates);
    }
  };

  const routeChanged = newRouteCoordinates => {
    if (newRouteCoordinates.length !== previousRouteCoordinates.length) {
      return true;
    }
    for (let i = 0; i < newRouteCoordinates.length; i++) {
      const newCoord = newRouteCoordinates[i];
      const prevCoord = previousRouteCoordinates[i];
      if (
        Math.abs(newCoord.latitude - prevCoord.latitude) > 0.0001 ||
        Math.abs(newCoord.longitude - prevCoord.longitude) > 0.0001
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
      if (watchId.current) {
        Geolocation.clearWatch(watchId.current);
      }
    };
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      async nextState => {
        if (nextState.match(/background/) && isLogin) {
          intervalId.current = BackgroundTimer.setInterval(async () => {
            const location = await getCurrentLocation();
            if (location?.ok === true || location?.location?.ok === true) {
              const loc = location?.location ?? location;
              const lat = loc.coords.lat;
              const long = loc.coords.long;
              refetchIfNeeded(lat, long);
              checkForRailwayNotifications(lat, long);
            }
          }, 2000); // Increased interval to 2 seconds to reduce battery drain while maintaining reasonable updates
        } else if (nextState.match(/active/) && isLogin) {
          if (intervalId.current) {
            BackgroundTimer.clearInterval(intervalId.current);
            BackgroundTimer.stopBackgroundTimer();
            intervalId.current = null;
          }
          // Reset isFirstRef to true on app becoming active after long background (potential restart scenario)
          isFirstRef.current = true;
        }
        appState.current = nextState;
      },
    );
    return () => {
      subscription.remove();
    };
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
      // Perform a manual check on focus
      const location = await getCurrentLocation();
      if (location?.ok === true || location?.location?.ok === true) {
        const loc = location?.location ?? location;
        const lat = loc.coords.lat;
        const long = loc.coords.long;
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
    laongituteDalta,
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
  };
};

export default useHomeScreenNew;
