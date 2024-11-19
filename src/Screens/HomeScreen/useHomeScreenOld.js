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

const useHomeScreen = ({addListener, navigate}) => {
  const notificationKM = 1;

  const {getState, dispatch} = useReduxStore();
  const {userData, isLogin} = getState('Auth');

  const {width, height} = Dimensions.get('window');
  // const ACPT_RATIO = width / height;
  // const latitudeDelta = Platform.OS == 'ios' ? 0.09 : 0.001;
  // const laongituteDalta = latitudeDelta * ACPT_RATIO;

  const watchId = useRef(null); // Use useRef to persist the watchId across re-renders

  const kiloMeterRef = useRef(0); // Use useRef to persist the watchId across re-renders

  // Calculate half the screen dimensions
  const halfWidth = width;
  const halfHeight = height / 1.7;

  // Calculate the aspect ratio for half the screen
  const ACPT_RATIO_HALF = halfWidth / halfHeight;

  // Determine the latitude delta
  const latitudeDelta = Platform.OS == 'ios' ? 0.2 : 0.2;

  // Calculate the longitude delta for half the screen
  const laongituteDalta = latitudeDelta * ACPT_RATIO_HALF;

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

  const railwayTracksRef = useRef([]);

  const [previousRouteCoordinates, setPreviousRouteCoordinates] = useState([]);

  const [trackThatNotify, setTrackThatNotify] = useState([]);

  const [KmBetweenTwoPoint, setKmBetweenTwoPoints] = useState(0);

  const trackThatNotifyRef = useRef([]);

  const startYourTracking = async (lat, long, isFocue, text) => {
    // console.log(
    //   'ksdvbjksdbkjbsdjkvbsdklbklsdbkls',
    //   startLocation,
    //   lat,
    //   long,
    //   startDescription,
    //   text,
    //   startLocationState,
    // );
    // console.log('jkssksk');
    Geolocation.watchPosition(
      async position => {
        const {latitude, longitude} = position.coords;

        var afterDubRemove = [];

        setKmBetweenTwoPoints(
          parseFloat(
            getDistanceFromLatLonInKm(
              startLocation?.coords?.lat ??
                startLocationState.coords.lat ??
                lat,
              startLocation?.coords?.long ??
                startLocationState.coords.long ??
                long,
              position.coords.latitude,
              position.coords.longitude,
            ),
          ),
        );
        const {ok, data} = afterFilterPreAndNewCoords
          ? {ok: true, data: railwayTracksRef.current}
          : await fetchRailwayCrossingAPI(latitude, longitude);

        if (ok) {
          if (!afterFilterPreAndNewCoords) {
            afterDubRemove = removeDuplicates(data);
            railwayTracksRef.current = afterDubRemove;
            setDummy(prev => ++prev);
          }
          // console.log(
          //   'oioiiohoihiohoihiohiohoihoih',
          //   !hasOneMonthPassed(userData?.start_trial_at),
          //   userData?.identifier != null,
          //   latitude,
          //   longitude,
          // );
          // if (
          //   !hasOneMonthPassed(userData?.start_trial_at) ||
          //   userData?.identifier != null
          // )
          // {
          const afterFilterTrack = getDistancesBetweenLocationsArry(
            {lat: latitude, long: longitude},
            afterFilterPreAndNewCoords
              ? railwayTracksRef.current
              : afterDubRemove,
          ).filter(res => parseFloat(res.km) <= notificationKM);

          console.log(
            'afterFilterTrackafterFilterTrackafterFilterTrackafterFilterTrackafterFilterTrackafterFilterTrack',
            afterFilterTrack,
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
            // setTrackThatNotify(newFilterArry);

            needToNotify.map(res => {
              if (res.match == false && parseFloat(res.km) <= notificationKM) {
                trackThatNotifyRef.current = [
                  ...trackThatNotifyRef.current,
                  res,
                ];
                setTrackThatNotify(prev => [...prev, res]);
                localNotifeeNotification(res?.id);
              }
            });
          }
        }
        if (startTracking) getKiloMeter(position.coords);

        const afterFilterPreAndNewCoords = Boolean(
          parseFloat(
            getDistanceFromLatLonInKm(
              startLocation?.coords?.lat ??
                startLocationState.coords.lat ??
                lat,
              startLocation?.coords?.long ??
                startLocationState.coords.long ??
                long,
              position.coords.latitude,
              position.coords.longitude,
            ),
          ) < 100,
        );
        // console.log(
        //   'afterFilterPreAndNewCoordsafterFilterPreAndNewCoordsafterFilterPreAndNewCoordsafterFilterPreAndNewCoords',
        //   afterFilterPreAndNewCoords,
        //   startLocation?.coords?.lat,
        //   startLocationState.coords.lat,
        //   lat,
        //   startLocation?.coords?.long,
        //   startLocationState.coords.long,
        //   long,
        //   getDistanceFromLatLonInKm(
        //     startLocation?.coords?.lat ?? startLocationState.coords.lat ?? lat,
        //     startLocation?.coords?.long ??
        //       startLocationState.coords.long ??
        //       long,
        //     position.coords.latitude,
        //     position.coords.longitude,
        //   ),
        //   Platform.OS,
        // );

        // const afterFilterPreAndNewCoords = Boolean(
        //   isFocue && startLocationState.coords.lat != null
        //     ? parseFloat(
        //         getDistanceFromLatLonInKm(
        //           startLocation?.coords?.lat ??
        //             startLocationState.coords.lat ??
        //             lat,
        //           startLocation?.coords?.long ??
        //             startLocationState.coords.long ??
        //             long,
        //           position.coords.latitude,
        //           position.coords.longitude,
        //         ),
        //       ) < 100
        //     : true,
        // );

        // if (
        //   afterFilterPreAndNewCoords ||
        //   startLocation.coords?.lat == null ||
        //   startLocationState.coords.lat == null
        // ) {
        //   // console.log('on start set', latitude, longitude);
        //   if (latitude != null) {
        //     setStartLocationState({
        //       description: await getLocationName(latitude, longitude),
        //       coords: {
        //         lat: latitude,
        //         long: longitude,
        //       },
        //     });
        //     await valChange('startLocation', {
        //       description: await getLocationName(latitude, longitude),
        //       coords: {
        //         lat: latitude,
        //         long: longitude,
        //       },
        //     });
        //   }
        // }
        setDummy(prev => ++prev);
        // }
      },
      error => {
        console.log('klsdnvklnsdlkvnlksdnvksndvsdklnvlksdnvsd', error);
      },
      {
        enableHighAccuracy: true,
        // fastestInterval: 200, // for android in milisecond
        // distanceFilter: 200, // for android in meter
        useSignificantChanges: true,
        timeout: 200,
        maximumAge: 0,
      },
    );
  };
  const startYourTrackingInBackground = async (
    latitude,
    longitude,
    isFocue,
    text,
  ) => {
    // console.log(
    //   'ksdvbjksdbkjbsdjkvbsdklbklsdbkls',
    //   startLocation,
    //   lat,
    //   long,
    //   startDescription,
    //   text,
    //   startLocationState,
    // );
    // console.log('jkssksk');

    // const {latitude, longitude} = position.coords;

    var afterDubRemove = [];

    // const {ok, data} = afterFilterPreAndNewCoords
    //   ? {ok: true, data: railwayTracksRef.current}
    //   : await fetchRailwayCrossingAPI(latitude, longitude);

    // if (!afterFilterPreAndNewCoords) {
    //   afterDubRemove = removeDuplicates(data);
    //   railwayTracksRef.current = afterDubRemove;
    //   setDummy(prev => ++prev);
    // }
    // console.log(
    //   'oioiiohoihiohoihiohiohoihoih',
    //   !hasOneMonthPassed(userData?.start_trial_at),
    //   userData?.identifier != null,
    //   latitude,
    //   longitude,
    // );
    // if (
    //   !hasOneMonthPassed(userData?.start_trial_at) ||
    //   userData?.identifier != null
    // )
    // {
    const afterFilterTrack = getDistancesBetweenLocationsArry(
      {lat: latitude, long: longitude},
      railwayTracksRef.current,
    ).filter(res => parseFloat(res.km) <= notificationKM);

    console.log(
      'afterFilterTrackafterFilterTrackafterFilterTrackafterFilterTrackafterFilterTrackafterFilterTrack',
      afterFilterTrack,
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
      // setTrackThatNotify(newFilterArry);

      needToNotify.map(res => {
        if (res.match == false && parseFloat(res.km) <= notificationKM) {
          trackThatNotifyRef.current = [...trackThatNotifyRef.current, res];
          setTrackThatNotify(prev => [...prev, res]);
          localNotifeeNotification(res?.id);
        }
      });
    }

    // console.log(
    //   'afterFilterPreAndNewCoordsafterFilterPreAndNewCoordsafterFilterPreAndNewCoordsafterFilterPreAndNewCoords',
    //   afterFilterPreAndNewCoords,
    //   startLocation?.coords?.lat,
    //   startLocationState.coords.lat,
    //   lat,
    //   startLocation?.coords?.long,
    //   startLocationState.coords.long,
    //   long,
    //   getDistanceFromLatLonInKm(
    //     startLocation?.coords?.lat ?? startLocationState.coords.lat ?? lat,
    //     startLocation?.coords?.long ??
    //       startLocationState.coords.long ??
    //       long,
    //     position.coords.latitude,
    //     position.coords.longitude,
    //   ),
    //   Platform.OS,
    // );

    // const afterFilterPreAndNewCoords = Boolean(
    //   isFocue && startLocationState.coords.lat != null
    //     ? parseFloat(
    //         getDistanceFromLatLonInKm(
    //           startLocation?.coords?.lat ??
    //             startLocationState.coords.lat ??
    //             lat,
    //           startLocation?.coords?.long ??
    //             startLocationState.coords.long ??
    //             long,
    //           position.coords.latitude,
    //           position.coords.longitude,
    //         ),
    //       ) < 100
    //     : true,
    // );

    // if (
    //   afterFilterPreAndNewCoords ||
    //   startLocation.coords?.lat == null ||
    //   startLocationState.coords.lat == null
    // ) {
    //   // console.log('on start set', latitude, longitude);
    //   if (latitude != null) {
    //     setStartLocationState({
    //       description: await getLocationName(latitude, longitude),
    //       coords: {
    //         lat: latitude,
    //         long: longitude,
    //       },
    //     });
    //     await valChange('startLocation', {
    //       description: await getLocationName(latitude, longitude),
    //       coords: {
    //         lat: latitude,
    //         long: longitude,
    //       },
    //     });
    //   }
    // }
    // }
  };

  // Function to update the description using valChange
  const updateDescription = (locationType, newDescription) => {
    valChange(locationType, {
      ...locationData[locationType],
      description: newDescription,
    });
  };

  const setTheValForMap = async () => {
    // localNotifeeNotification('Alert', 'Notification allow successfully');
    const location = await getProperLocation();
    if (location?.ok == true || location?.location?.ok == true) {
      dispatch(loadingTrue());
      if (
        location.location?.coords?.lat != null ||
        location?.coords?.lat != null
      ) {
        console.log('setTheValForMap', location);
        setStartLocationState(location?.location ?? location);

        await valChange(
          'startLocation',
          {...location?.location} ?? {...location},
        );
      }
      await valChange(
        'startDescription',
        location?.location?.description ?? location?.description,
      );
      // valChange('startLocation', location?.location ?? location);
      await fetchRailwayCrossingAPI(
        location.location?.coords?.lat ?? location?.coords?.lat,
        location.location?.coords?.long ?? location?.coords?.long,
      );
      const {ok, data} = await fetchRailwayCrossingAPI(
        location.location?.coords?.lat ?? location?.coords?.lat,
        location.location?.coords?.long ?? location?.coords?.long,
      );
      if (ok) {
        const removeDuplicateIds = removeDuplicates(data);
        railwayTracksRef.current = removeDuplicateIds;
        setDummy(prev => ++prev);
      }
      // setTimeout(async () => {
      await startYourTracking(
        location.location?.coords?.lat,
        location.location?.coords?.long,
        false,
        'settitme out',
      );
      // }, 500);
      dispatch(loadingFalse());
      // setTimeout(async () => {
      //   await startYourTracking(
      //     location.location?.coords?.lat,
      //     location.location?.coords?.long,
      //   );
      // }, 2000);
    }

    if (Platform.OS == 'android') {
      applyForNotifiPer();
    }
    const event = addListener('focus', () => {
      setTimeout(async () => {
        await startYourTracking(null, null, true, 'focus out');
      }, 500);
    });
    return event;
  };

  const onDirectionReady = result => {
    const newRouteCoordinates = result.coordinates;

    // Calculate if the new route is significantly different from the previous one
    const routeChangeded = routeChanged(newRouteCoordinates);

    if (routeChangeded) {
      setPreviousRouteCoordinates(newRouteCoordinates);
    }
  };

  const routeChanged = newRouteCoordinates => {
    // Compare the length of both routes
    if (newRouteCoordinates.length !== previousRouteCoordinates.length) {
      return true;
    }

    // Compare each coordinate to check for significant changes
    for (let i = 0; i < newRouteCoordinates.length; i++) {
      const newCoord = newRouteCoordinates[i];
      const prevCoord = previousRouteCoordinates[i];

      // Check if latitude or longitude differs by a significant margin
      if (
        Math.abs(newCoord.latitude - prevCoord.latitude) > 0.0001 ||
        Math.abs(newCoord.longitude - prevCoord.longitude) > 0.0001
      ) {
        return true;
      }
    }

    return false; // Routes are similar
  };

  const stopTracking = () => {
    // Geolocation.clearWatch(watchId.current);
    valChange('startTracking', false);
    // localNotifeeNotification();
  };

  const useEffectFun = () => {
    setTheValForMap();
  };

  useEffect(useEffectFun, []);

  const appState = useRef(AppState.currentState);
  const intervalId = useRef(null);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      async nextState => {
        if (nextState.match(/background/) && isLogin) {
          console.log('lsbdvklsdbklvbsdklvbsldbvlsdbv', nextState);
          intervalId.current = setInterval(async () => {
            console.log('lsbdvklsdbklvbsdklvbsldbvlsdwddwcwdcbv', nextState);
            const location = await getCurrentLocation();
            if (location?.ok == true || location?.location?.ok == true) {
              const lantVal =
                location.location?.coords?.lat ?? location?.coords?.lat;
              console.log(
                'jksdvbjksbdkjbsdklbsdklvbklsdbvlkdsbvlkdsks',
                startLocation,
                lantVal,
              );
              // if (startLocation.coords.lat.toFixed(6) != lantVal.toFixed(6))
              await startYourTrackingInBackground();
            }
          }, 2000);
        } else if (nextState.match(/active/) && isLogin) {
          if (intervalId.current) {
            clearInterval(intervalId.current); // Clear the stored interval ID
            intervalId.current = null; // Reset the intervalId
          }
        }

        appState.current = nextState;
      },
    );
    return () => {
      subscription.remove();
    };
  }, [appState.current]);

  useEffect(() => {
    const event = addListener('focus', () => {
      setTimeout(() => {
        const {Auth} = store.getState();
        if (
          hasOneMonthPassed(Auth.userData?.start_trial_at) &&
          Auth.userData?.identifier == null
        )
          setSubAlert(true);
      }, 1500);
    });
    return event;
  }, []);

  const {startLocation, endLocation, startTracking, startDescription} =
    locationData;

  const updateState = data => setLocationData(prev => ({...prev, ...data}));

  const valChange = async (key, val) => {
    updateState({[key]: val});
  };

  const dynamicNav = (route, item) => navigate(route, item);

  const getKiloMeter = (user, end) => {
    distance = getDistanceFromLatLonInKm(
      user?.latitude ??
        startLocation?.coords?.lat ??
        startLocationState.coords.lat,
      user?.longitude ??
        startLocation?.coords?.long ??
        startLocationState.coords.long,
      end.coords?.lat ?? endLocation.coords.lat,
      end.coords?.long ?? endLocation.coords.long,
    );

    console.log(
      'distancedistancedistancedistancedistancedistancedistancedistancedistancedistance',
      distance,
      endLocation,
    );

    // distance = getDistance(
    //   {
    //     latitude: user?.latitude ?? startLocation.coords.lat,
    //     longitude: user?.longitude ?? startLocation.coords.long,
    //   },
    //   {latitude: endLocation.coords.lat, longitude: endLocation.coords.long},
    // );
    const kiloMeter = distance / 1000;

    kiloMeterRef.current = distance;
    setDummy(prev => ++prev);
  };

  return {
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

export default useHomeScreen;
