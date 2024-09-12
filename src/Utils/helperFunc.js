import {create} from 'apisauce';
import {VerifyUserUrl, baseURL} from './Urls';
import {store} from '../Redux/Reducer';
import {loadingFalse, loadingTrue} from '../Redux/Action/isloadingAction';
import {Platform} from 'react-native';
import {logOutUser} from '../Redux/Action/AuthAction';
import {types} from '../Redux/types';
import {logOutFirebase, logoutService} from '../Services/AuthServices';
import Purchases from 'react-native-purchases';
import {allSubID} from './localDB';

const API = create({
  baseURL,
  timeout: 15000,
  //   timeoutErrorMessage: 'Please try Again...',
});

const hideLoaderAPIs = [VerifyUserUrl];
// const hideLoaderAPIs = ['/playcount', '/playlist', '/home-content'];

API.addRequestTransform(config => {
  if (!hideLoaderAPIs.includes(config.url)) store.dispatch(loadingTrue());
  const {Auth} = store.getState();
  config.headers = {
    Authorization: `Bearer ${Auth.token}`,
  };
  return config;
});

API.addResponseTransform(response => {
  setTimeout(() => store.dispatch(loadingFalse()), 500);
  const {Auth} = store.getState();
  console.log('token111', Auth.token, response?.originalError?.message);
  if (
    response?.originalError?.message == 'Request failed with status code 401' &&
    Auth.token != ''
  )
    store.dispatch(logOutUser());

  return response;
});

const {get} = API;

//^ altering the get()
API.get = async (url, params, axiosConfig) => {
  const response = await get(url, params, axiosConfig);
  // if (response.ok) {
  return response;
  // }
};

// const formDataFunc = (url, body) => {
//   const {Auth} = store.getState();

//   var myHeaders = new Headers();
//   myHeaders.append('Accept', 'application/json');
//   myHeaders.append('Authorization', `Bearer ${Auth.token}`);
//   myHeaders.append('Content-Type', 'multipart/form-data');

//   // const formData = new FormData();
//   // Object.entries(body).forEach(([key, val]) => {
//   //   if (key === 'photos' && Array.isArray(val)) {
//   //     val.forEach((res, index) => {
//   //       formData.append(`photos`, {
//   //         name: res?.fileName,
//   //         type: res?.type,
//   //         uri:
//   //           Platform.OS == 'ios' ? res?.uri.replace('file://', '') : res?.uri,
//   //       });
//   //     });
//   //   } else {
//   //     formData.append(key, val);
//   //   }
//   // });
//   var requestOptions = {
//     method: 'POST',
//     headers: myHeaders,
//     body: body,
//     redirect: 'follow',
//   };

//   return fetch(url, requestOptions)
//     .then(res => res.json())
//     .then(res => res)
//     .catch(err => err);
// };

// export {formDataFunc};

const fetchPostWithToken = (url, body, isFormData, imageKey, isArray) => {
  const {Auth} = store.getState('Auth');
  const fullUrl = baseURL + url;
  store.dispatch(loadingTrue());

  var requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type':
        isFormData == true ? 'multipart/form-data' : 'application/json',
      Authorization: `Bearer ${Auth.token}`,
    },
    body:
      isFormData == true
        ? createFormData(body, imageKey, isArray)
        : JSON.stringify(body),
    redirect: 'follow',
  };

  return fetch(fullUrl, requestOptions)
    .then(response => {
      if (!response.ok) {
        return {ok: false, res: response}; // Return the response data
      } else {
        return response.json();
      }
    })
    .then(response => {
      console.log('response1', response);
      return {ok: response?.ok ?? true, res: response}; // Return the response data
    })
    .catch(error => {
      console.error('error1', error);
      throw {ok: false, res: error}; // Re-throw the error to propagate it to the caller
    });
};

const createFormData = (photos, imageKey, isArray) => {
  console.log(photos, isArray, 'oekleiaaake');
  const data = new FormData();

  Object.entries(photos).forEach(([key, val]) => {
    console.log(
      'oisdhviosbdoivbosidbvoisdbiovbsiodbvoisdfdfdfddbivosbdovbsdiovboisd',
    );
    isArray
      ? data.append(imageKey, {
          name: val?.fileName,
          type: val?.type,
          uri:
            Platform.OS == 'ios' ? val?.uri.replace('file://', '') : val?.uri,
        })
      : data.append(imageKey, {
          name: photos[imageKey]?.fileName,
          type: photos[imageKey]?.type,
          uri:
            Platform.OS == 'ios'
              ? photos[imageKey]?.uri.replace('file://', '')
              : photos[imageKey]?.uri,
        });
    // } else {
    //   data.append(key, val);
    // }
  });

  // Object.keys(body).forEach(key => {
  //   console.log({body}, 'dldldlq');
  //   data.append(key, body[key]);
  // });

  return data;
};

const getUserDataFromRevenewCat = async () => {
  return await Purchases.getCustomerInfo();
};

const fetchGetWithToken = async url => {
  const {Auth} = store.getState('Auth');
  const fullUrl = baseURL + url;
  // console.log(Auth.token, Auth.userData, 'Auth Token', fullUrl);

  try {
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Auth.token}`, // Assuming a Bearer token authentication
        // Add other headers if needed
      },
    });
    const getData = await getUserDataFromRevenewCat();
    const activeSubscriptions =
      getData.entitlements.active['AppStorePlans'] ?? undefined;

    if (!response.ok) {
      store.dispatch({type: types.LogoutType});
      throw new Error('Network response was not ok.');
    } else if (response.ok) {
      const data = await response.json();

      if (activeSubscriptions != undefined) {
        store.dispatch({
          type: types.UpdateProfile,
          payload: {
            ...data,
            planName: allSubID[activeSubscriptions?.productIdentifier] ?? null,
            identifier: activeSubscriptions?.productIdentifier,
          },
        });
      } else {
        store.dispatch({
          type: types.UpdateProfile,
          payload: {...data, planName: null, identifier: null},
        });
      }

      // console.log(data, 'alskdjfklajsdfkljadlsfjaklsdjfl2kds444ajf2lkdjs');

      return data; // Return the fetched data
    }
  } catch (error) {
    store.dispatch({type: types.LogoutType});
    console.error('Error fetching data:', error);
    throw error; // Rethrow the error to handle it at the caller's level if needed
  }
  //
  // store.dispatch({type: types.LogoutType});
};

const formDataFunc = (url, body, imageKey, isArray) => {
  const {Auth} = store.getState();
  store.dispatch(loadingTrue());

  var myHeaders = new Headers();
  myHeaders.append('Accept', 'application/json');
  myHeaders.append('Authorization', `Bearer ${Auth.token}`);
  myHeaders.append('Content-Type', 'multipart/form-data');

  const formData = new FormData();
  Object.entries(body).forEach(([key, value]) => {
    if (body[imageKey]?.type) {
      formData.append(imageKey, {
        uri: body[imageKey].uri,
        type: body[imageKey]?.type || 'image/jpeg',
        name: body[imageKey].name,
      });
    }
    formData.append(key, value);
  });
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: formData,
    redirect: 'follow',
  };
  let newUrl = baseURL + url;
  return fetch(newUrl, requestOptions)
    .then(res => res.json())
    .then(async res => {
      console.log('test', res);
      if (res?.message == 'Unauthenticated.') {
        await logoutService();
        store.dispatch(logOutUser());
        store.dispatch(loadingFalse());
      }
      return {data: res, ok: true};
    })
    .catch(err => {
      console.log('testerr', err);
      return {data: err, ok: false};
    });
};

export {
  formDataFunc,
  fetchPostWithToken,
  fetchGetWithToken,
  getUserDataFromRevenewCat,
};

export default API;
