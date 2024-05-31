import {create} from 'apisauce';
import {baseURL, fcmToken, getAllUser, notifyUserUrl} from './Urls';
import {store} from '../Redux/Reducer';
import {loadingFalse, loadingTrue} from '../Redux/Action/isloadingAction';
import {Platform} from 'react-native';
import {logOutUser} from '../Redux/Action/AuthAction';
import {types} from '../Redux/types';
import moment from 'moment';

const API = create({
  baseURL,
  timeout: 15000,
  //   timeoutErrorMessage: 'Please try Again...',
});

const hideLoaderAPIs = [notifyUserUrl, getAllUser, fcmToken];
// const hideLoaderAPIs = ['/playcount', '/playlist', '/home-content'];

/* The `API.addRequestTransform` function is adding a request transformation to the API instance. In
this specific case, the provided function is intercepting outgoing requests and modifying them
before they are sent. */
API.addRequestTransform(config => {
  if (!hideLoaderAPIs.includes(config.url)) store.dispatch(loadingTrue());
  const {Auth} = store.getState();
  config.headers = {
    Authorization: `Bearer ${Auth.token}`,
  };
  return config;
});

/* The `API.addResponseTransform` function is adding a response transformation to the API instance. In
this specific case, the provided function is intercepting incoming responses and modifying them
before they are processed further. */
API.addResponseTransform(response => {
  setTimeout(() => store.dispatch(loadingFalse()), 500);
  const {Auth} = store.getState();
  console.log('token111', Auth.token);
  if (
    response?.originalError?.message == 'Request failed with status code 401' &&
    Auth.token != ''
  )
    store.dispatch({type: types.LogoutType});

  return response;
});

const {get} = API;

//^ altering the get()
/* The code snippet `API.get = async (url, params, axiosConfig) => { ... }` is overriding the default
behavior of the `get` method in the `API` object. */
API.get = async (url, params, axiosConfig) => {
  const response = await get(url, params, axiosConfig);
  // if (response.ok) {
  return response;
  // }
};

/**
 * The function `formDataFunc` sends a POST request with form data including an image to a specified
 * URL, handling authentication and error responses.
 * @param url - The `url` parameter in the `formDataFunc` function is the endpoint URL where the form
 * data will be sent. This is typically the API endpoint that will handle the form data submission.
 * @param body - The `formDataFunc` function you provided seems to be a function for handling form data
 * and making a POST request to a specified URL. It constructs a FormData object with the provided body
 * data and sends it along with the request.
 * @param imageKey - The `imageKey` parameter in the `formDataFunc` function represents the key under
 * which the image data will be appended to the FormData object. This key is used to identify the image
 * data when sending a multipart/form-data request.
 * @param isArray - The `isArray` parameter in the `formDataFunc` function is used to determine whether
 * the data being sent in the request is an array or not. If `isArray` is `true`, it indicates that the
 * data to be sent is an array. This information can be useful when constructing the request body
 * @returns The `formDataFunc` function returns a Promise that resolves to an object with a `data`
 * property containing the response data from the fetch request and an `ok` property indicating whether
 * the request was successful (`true`) or not (`false`).
 */
const formDataFunc = (url, body, imageKey, isArray) => {
  const {Auth} = store.getState();
  console.log(
    'bjdv dv hj hj dhjs dshj bdh∫√ dhjksbvsdhj',
    url,
    body,
    imageKey,
    isArray,
  );
  var myHeaders = new Headers();
  myHeaders.append('Accept', 'application/json');
  myHeaders.append('Authorization', `Bearer ${Auth.token}`);
  myHeaders.append('Content-Type', 'multipart/form-data');

  const formData = new FormData();
  Object.entries(body).forEach(([key, value]) => {
    if (body?.profileData?.type) {
      formData.append(imageKey, {
        uri: body?.profileData.uri,
        type: body?.profileData.type,
        name: body?.profileData.fileName,
      });
    }
    formData.append(key, value);
  });
  console.log('asdasd123', formData);

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: formData,
    redirect: 'follow',
  };
  let newUrl = baseURL + url;
  console.log(newUrl, 'aasdas');
  return fetch(newUrl, requestOptions)
    .then(res => res.json())
    .then(res => {
      console.log('test', res);
      return {data: res, ok: true};
    })
    .catch(err => {
      console.log('testerr', err);
      return {data: err, ok: false};
    });
};

/**
 * The function `timeLayout` takes a time input and formats it to display in 12-hour clock format with
 * AM/PM indication.
 * @returns The function `timeLayout` takes a time parameter and returns the time formatted in 'hh:mm
 * A' (hours:minutes AM/PM) using the moment.js library.
 */
const timeLayout = time => {
  return moment(time).format('hh:mm A');
};

/**
 * The function AMPMLayout determines if the given time is in the AM or PM period.
 * @returns The function `AMPMLayout` is returning a boolean value based on whether the input time is
 * in the AM or PM period. It uses the `moment` library to format the input time and check if it is
 * 'AM'.
 */
const AMPMLayout = time => {
  return Boolean(moment(time).format('A') == 'AM');
};

/**
 * The `contentTime` function in JavaScript formats a given time value into hours, minutes, and seconds
 * with an optional format parameter.
 * @param time - The `contentTime` function takes a time value in seconds and an optional boolean
 * format parameter. If the format parameter is set to true, the function will return the time in a
 * formatted string with hours, minutes, and seconds. If the format parameter is false or not provided,
 * the function will return
 * @param [format=false] - The `format` parameter in the `contentTime` function is a boolean parameter
 * that determines whether the time should be formatted in a detailed way or in a simplified way. When
 * `format` is set to `false`, the function returns the time in the format `mm:ss`. When `format`
 * @returns The `contentTime` function returns either the formatted time in hours, minutes, and seconds
 * if the `format` parameter is set to `true`, or it returns the time in the format `mm:ss` if `format`
 * is `false`.
 */
const contentTime = (time, format = false) => {
  if (!format) {
    const hour = moment.utc(time * 1000).format('HH');
    const minute = moment.utc(time * 1000).format('mm');
    const second = moment.utc(time * 1000).format('ss');
    return hour == '00' ? `${minute}:${second}` : `${minute}:${second}`;
  }
  const hour = moment.utc(time * 1000).format('HH');
  const minute = moment.utc(time * 1000).format('mm');
  const second = moment.utc(time * 1000).format('ss');
  const hoursFormatted = hour !== '00' ? `${hour} hour ` : '';
  const minutesFormatted = minute !== '00' ? `${minute} minutes` : '';
  const secondFormatted = second !== '00' ? `${second} seconds` : '';
  return [hoursFormatted, minutesFormatted, secondFormatted].join('');
};

/**
 * The function `secondsToTime` converts a given time in seconds to an object containing hours,
 * minutes, and seconds.
 * @returns The function `secondsToTime` returns an object with properties `seconds`, `minutes`, and
 * `hours`, where each property contains a string value representing the corresponding time unit
 * (seconds, minutes, hours) calculated from the input `timeInSeconds`.
 */
export const secondsToTime = timeInSeconds => {
  const hours = Math.floor(timeInSeconds / 3600)
    .toString()
    .padStart(2, '0');
  const minutes = Math.floor((timeInSeconds % 3600) / 60)
    .toString()
    .padStart(2, '0');
  const seconds = Math.floor(timeInSeconds % 60)
    .toString()
    .padStart(2, '0');
  return {seconds, minutes, hours};
};

const randomNanoIdGenerator = () => nanoid();
const keyExtractor = item => item?.id;

/**
 * The function `durationAsString` calculates the duration between the current time and a given date in
 * days, hours, and minutes.
 * @returns The function `durationAsString` takes a date as input, calculates the duration between that
 * date and the current date, and returns a formatted string representing the duration in terms of
 * days, hours, and minutes. The formatted string includes the number of days (if any), hours (if any),
 * and minutes (if any) in the format "X days X hours X minutes".
 */
const durationAsString = date => {
  const start = new Date();
  const currentTime = new Date(date);
  currentTime.setDate(start.getDate());
  if (start.getTime() > currentTime.getTime())
    currentTime.setDate(start.getDate() + 1);

  const duration = moment.duration(moment(currentTime).diff(moment(start)));

  //Get Days
  const days = Math.floor(duration.asDays()); // .asDays returns float but we are interested in full days only
  const daysFormatted = days ? `${days}day ` : ''; // if no full days then do not display it at all

  //Get Hours
  const hours = duration.hours();
  const hoursFormatted = hours ? `${hours}hr ` : '';

  //Get Minutes
  const minutes = duration.minutes();
  const minutesFormatted = minutes ? `${minutes}min` : '';

  return [daysFormatted, hoursFormatted, minutesFormatted].join('');
};

export {formDataFunc, contentTime};

export default API;
