import {useEffect, useRef, useState} from 'react';
import {Dimensions, Platform} from 'react-native';
import {
  fetchRailwayCrossingAPI,
  getDistanceFromLatLonInKm,
  getDistancesBetweenLocationsArry,
  getProperLocation,
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

const useHomeScreen = ({addListener, navigate}) => {
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
        lat: '',
        long: '',
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

  const [dummy, setDummy] = useState(1);

  const railwayTracksRef = useRef([]);

  const [previousRouteCoordinates, setPreviousRouteCoordinates] = useState([]);

  const [trackThatNotify, setTrackThatNotify] = useState([]);

  const trackThatNotifyRef = useRef([]);

  const startYourTracking = async (latitude, longitude) => {
    Geolocation.watchPosition(
      async position => {
        const {latitude, longitude} = position.coords;
        valChange('startLocation', {
          description: locationData['startLocation']?.description,
          coords: {
            lat: latitude,
            long: longitude,
          },
        });
        if (startTracking) getKiloMeter(position.coords);
        const {ok, data} = await fetchRailwayCrossingAPI(latitude, longitude);

        if (ok) {
          const afterDubRemove = removeDuplicates(data);

          const afterFilterTrack = getDistancesBetweenLocationsArry(
            {lat: latitude, long: longitude},
            afterDubRemove,
          ).filter(res => parseFloat(res.km) <= 0.5);

          if (afterFilterTrack.length > 0) {
            const lengthOfTrack = trackThatNotifyRef.current.length ?? 0;

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
              if (res.match == false) {
                trackThatNotifyRef.current = [
                  ...trackThatNotifyRef.current,
                  res,
                ];
                setTrackThatNotify(prev => [...prev, res]);
                localNotifeeNotification(res?.id);
              }
            });
            // setTimeout(() => {
            //   if (
            //     newFilterArry.length == 0 ||
            //     newFilterArry.length > lengthOfTrack
            //   ) {
            //     localNotifeeNotification();
            //   }
            // }, 500);
            // trackThatNotify.map(res=> res)
            // localNotification()
          }
          railwayTracksRef.current = afterDubRemove;
          setDummy(prev => ++prev);
          // setRailwayTracks(data);
        }
      },
      error => {
        console.log('klsdnvklnsdlkvnlksdnvksndvsdklnvlksdnvsd', error);
      },
      {
        enableHighAccuracy: true,
        fastestInterval: 100,
        distanceFilter: 20,
        useSignificantChanges: true,
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
    if (location?.ok == true || location?.location?.ok == true) {
      console.log(
        'lkdsbvklsdbvlksdbvlksdklvbsdklbvkldsbvkldsbvlsdkvbsdvklsdbv',
        location,
      );

      valChange('startLocation', location?.location ?? location);
      valChange(
        'startDescription',
        location?.location?.description ?? location?.description,
      );
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
      setTimeout(async () => {
        await startYourTracking(
          location.location?.coords?.lat,
          location.location?.coords?.long,
        );
      }, 500);
    }
    // if (ok) setRailwayTracks(data);
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

  const {startLocation, endLocation, startTracking, startDescription} =
    locationData;

  const updateState = data => setLocationData(prev => ({...prev, ...data}));

  const valChange = (key, val) => {
    updateState({[key]: val});
  };

  const dynamicNav = (route, item) => navigate(route, item);

  const getKiloMeter = (user, end) => {
    distance = getDistanceFromLatLonInKm(
      user?.latitude ?? startLocation.coords.lat,
      user?.longitude ?? startLocation.coords.long,
      end.coords?.lat ?? endLocation.coords.lat,
      end.coords?.long ?? endLocation.coords.long,
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
  };
};

export default useHomeScreen;
