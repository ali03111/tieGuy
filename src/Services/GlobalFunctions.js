import {Alert, Linking, PermissionsAndroid, Platform} from 'react-native';
import Geolocationios from '@react-native-community/geolocation';
import Geolocation from 'react-native-geolocation-service';
// import Geolocation from '@react-native-community/geolocation';
import {openSettings} from 'react-native-permissions';
import {store} from '../Redux/Reducer';
import {loadingFalse, loadingTrue} from '../Redux/Action/isloadingAction';
import {errorMessage} from '../Config/NotificationMessage';
import {MapAPIKey} from '../Utils/Urls';

const getSingleCharacter = text => {
  let letter = text?.charAt(0).toUpperCase();
  return letter;
};

const getProperLocation = () => {
  store.dispatch(loadingTrue());

  Geolocation.setRNConfiguration({
    config: {
      skipPermissionRequests: true,
      authorizationLevel: 'always' | 'whenInUse' | 'auto',
      enableBackgroundLocationUpdates: true,
      locationProvider: 'playServices' | 'android' | 'auto',
    },
  });

  return new Promise(async (resolve, reject) => {
    console.log('first');

    try {
      // Request permission to access geolocation if needed
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          store.dispatch(loadingFalse());

          return Alert.alert(
            'Warning',
            `Location permission have been denied. Please enabled location permission from settings.`,
            [
              {
                text: 'Cancel',
                onPress: () => null,
                style: 'cancel',
              },
              {
                text: 'Open Setting',
                onPress: () => {
                  openSettings().catch(() =>
                    console.warn('Cannot open settings'),
                  );
                },
              },
            ],
            {
              userInterfaceStyle: 'light',
            },
          );
        } else {
          store.dispatch(loadingFalse());
          console.log(
            'skjdbvojsndvjksndojnvs jkdnv jksdb vjksdb kjvsdb vjksdb kjvsd bkjvsdb kj sbdjksdb',
          );
          Geolocation.getCurrentPosition(
            async info => {
              console.log(
                'kjsdbvjklsbdklvbsdklbvlksdbvlksdbvkljsblkvbsdlkvblskdbvlsdbvbsdkvds',
                info,
              );
              const locationName = await getLocationName(
                info.coords.latitude,
                info.coords.longitude,
              );
              console.log(
                'lksdbvlkbsdlkvbklsdbvlkbklsbvbklsdbvlksdbklvbsdl',
                locationName,
              );
              resolve({
                coords: {
                  lat: info.coords.latitude,
                  long: info.coords.longitude,
                },
                description: locationName,
              });
            },
            error => {
              errorMessage('Please enable your mobile location');
              reject(error);
            },
            {enableHighAccuracy: true, accuracy: true},
          );
        }
        store.dispatch(loadingFalse());
      } else {
        Geolocationios.getCurrentPosition(
          async info => {
            const locationName = await getLocationName(
              info.coords.latitude,
              info.coords.longitude,
            );
            console.log(
              'lksdbvlkbsdlkvbklsdbvlkbklsbvbklsdbvlksdbklvbsdl',
              locationName,
            );
            resolve({
              coords: {
                lat: info.coords.latitude,
                long: info.coords.longitude,
              },
              description: locationName,
            });
          },
          error => {
            reject(error);
          },
          {enableHighAccuracy: true, accuracy: true},
        );
        store.dispatch(loadingFalse());
      }
      store.dispatch(loadingFalse());
    } catch (error) {
      console.log(
        'osdbviosboivbsdiobvoisdbvoisdbovibsdoivbsodbvosdivbdsoibds',
        error,
      );
      store.dispatch(loadingFalse());
      reject(error);
    }
  });
};

const getLocationName = async (latitude, longitude) => {
  console.log('third');

  const geocodingAPI = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${MapAPIKey}`;

  // Replace "YOUR_API_KEY" with your actual Google Maps Geocoding API key

  const res = await fetch(geocodingAPI);
  const response = await res.json();
  if (response.results.length > 0) {
    const locationName = response.results[0].formatted_address;
    return locationName;
  }
};

function extractTimeFromString(str) {
  const timeRegex = /(\d{1,2}:\d{2}\s*[AP]M)/i; // Regular expression to match time in format "hh:mm AM/PM"
  const match = str.match(timeRegex);

  if (match) {
    return match[1]; // Extracting the matched time
  } else {
    return '';
  }
}

function removeTimeFromDate(datetimeStr) {
  // input value ""2024-03-12T08:00:15.000000Z""
  // output value "2024-03-12"

  const dateInString = datetimeStr.toISOString();

  // Split the string at 'T' and take the first part (the date)
  const datePart = dateInString.split('T')[0];
  return datePart;
}

function getDateMonthYear(dateString) {
  const dateParts = dateString.split('-'); // Splitting the date string by '-'
  const year = dateParts[0];
  const monthNumber = parseInt(dateParts[1], 10); // Parsing month number to integer
  const day = dateParts[2];

  // Array of English month names
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  // Getting English month name using the month number
  const monthName = monthNames[monthNumber - 1];

  return {
    day,
    monthName,
    year,
  };
}

const openGoogleMaps = (latitude, longitude) => {
  const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
  Linking.openURL(url);
};

const fetchRailwayCrossingAPI = async (lat, long) => {
  const apiKey = MapAPIKey;
  const locations = `${lat},${long}`;
  const radius = '10'; // Radius in meters (adjust as needed)
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=railway%50crossing&location=${locations}&radius=${radius}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const results = data.results;
    const places = results.map(place => ({
      id: place.place_id,
      name: place.name,
      location: {
        latitude: place.geometry.location.lat,
        longitude: place.geometry.location.lng,
      },
    }));
    return {ok: true, data: places};
    // setCrossings(places);
  } catch (error) {
    console.error('Error fetching railway crossings:', error);
    return {ok: false, data: error};
  }
};

function getValBeforePoint(value) {
  //    input = 353.68558
  //    output = 353

  // Convert the string to a number
  const number = parseFloat(value);

  // Return the integer part before the decimal point
  return Math.floor(number);
}

/**
 * Calculates the distance between two geographic coordinates using the Haversine formula.
 * @param {number} lat1 - Latitude of the first point.
 * @param {number} lon1 - Longitude of the first point.
 * @param {number} lat2 - Latitude of the second point.
 * @param {number} lon2 - Longitude of the second point.
 * @returns {number} Distance between the two points in kilometers.
 */
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers
  return distance;
}

/**
 * Converts degrees to radians.
 * @param {number} deg - Value in degrees.
 * @returns {number} Value in radians.
 */
function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

export {
  getSingleCharacter,
  getProperLocation,
  getDateMonthYear,
  extractTimeFromString,
  openGoogleMaps,
  removeTimeFromDate,
  getValBeforePoint,
  fetchRailwayCrossingAPI,
  getDistanceFromLatLonInKm,
};
