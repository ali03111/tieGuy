import {Alert, Linking, PermissionsAndroid, Platform} from 'react-native';
import Geolocationios from '@react-native-community/geolocation';
import Geolocation from 'react-native-geolocation-service';
// import Geolocation from '@react-native-community/geolocation';
import {openSettings} from 'react-native-permissions';
import {store} from '../Redux/Reducer';
import {loadingFalse, loadingTrue} from '../Redux/Action/isloadingAction';
import {errorMessage} from '../Config/NotificationMessage';

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
                  latitude: info.coords.latitude,
                  longitude: info.coords.longitude,
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
                latitude: info.coords.latitude,
                longitude: info.coords.longitude,
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

  const geocodingAPI = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyDQ_pjAQYvVcGWNLy-ND_ZtyufjXtiUAxs`;

  // Replace "YOUR_API_KEY" with your actual Google Maps Geocoding API key

  const res = await fetch(geocodingAPI);
  const response = await res.json();
  console.log('kjsdbvjklsbklvbsdklvbskdlbvsdbvbsdbksjdvsd', response);
  if (response.results.length > 0) {
    const locationName = response.results[0].formatted_address;
    console.log(
      'locationNamelocationNamelocationNamelocationNamelocationNamelocationNamelocationNamelocationNamelocationNamelocationNamelocationName',
      locationName,
    );
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

function getValBeforePoint(value) {
  //    input = 353.68558
  //    output = 353

  // Convert the string to a number
  const number = parseFloat(value);

  // Return the integer part before the decimal point
  return Math.floor(number);
}

export {
  getSingleCharacter,
  getProperLocation,
  getDateMonthYear,
  extractTimeFromString,
  openGoogleMaps,
  removeTimeFromDate,
  getValBeforePoint,
};
