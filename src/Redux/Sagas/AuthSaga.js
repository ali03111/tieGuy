import {call, delay, put, takeLatest} from 'redux-saga/effects';
import {types} from '../types';
import {
  appleIdlogin,
  emailLogin,
  emailSignUp,
  faceBookLogin,
  forgotPasswordServices,
  googleLogin,
} from '../../Utils/SocialLogin';
import {updateAuth} from '../Action/AuthAction';
import {loadingFalse, loadingTrue} from '../Action/isloadingAction';
import {
  fcmRegService,
  getFbResult,
  logOutFirebase,
  loginService,
  registerService,
  updateProfileServices,
} from '../../Services/AuthServices';
import {errorMessage, successMessage} from '../../Config/NotificationMessage';
import NavigationService from '../../Services/NavigationService';
import {getUserDataFromRevenewCat} from '../../Utils/helperFunc';

const loginObject = {
  Google: () => googleLogin(),
  facebook: () => faceBookLogin(),
  email: datas => emailSignUp(datas),
  appleID: () => appleIdlogin(),
};

/* `const loginSaga` is a generator function that is used as a saga in a Redux-Saga middleware. It
takes an action object as an argument, destructures its `payload` property to get `datas` and `type`
properties, and then performs a series of asynchronous operations using the `yield` keyword. */
const loginSaga = function* ({payload: {datas, type}}) {
  yield put(loadingTrue());
  console.log('asd');
  try {
    const getLoginData = loginObject[type];
    const resultData = yield call(getLoginData, datas);
    const {socialData, ok} = {socialData: resultData, ok: true};
    if (ok) {
      const idTokenResult = yield call(getFbResult);
      const jwtToken = idTokenResult.token;
      if (jwtToken) {
        console.log('jwtToken', jwtToken);
        // if (socialData.isNewUser || type == 'email') {
        //   var {result} = yield call(createTelematicUser, {
        //     token: deviceToken,
        //     data: datas.name ? datas : socialData,
        //   });
        // }
        const {data, ok} = yield call(registerService, {
          token: jwtToken,
          name: datas?.name,
          last_name: datas?.last_name,
          email: datas?.email,
          password: datas?.password,
          phone: datas?.number,
          company_name: datas?.company_name,
        });
        console.log('data=========>>>>>>>', data);
        yield put(loadingTrue());
        if (ok) {
          yield put(loadingTrue());
          yield put(updateAuth(data));
        }
      }
    }
  } catch (error) {
    errorMessage(error?.message.split(' ').slice(1).join(' ') ?? error);
  } finally {
    yield put(loadingFalse());
  }
};

/* `registerSaga` is a generator function that is used as a saga in a Redux-Saga middleware. It takes
an action object as an argument, destructures its `payload` property to get `datas`, and then
performs a series of asynchronous operations using the `yield` keyword. */
function* registerSaga({payload: {datas}}) {
  yield put(loadingTrue());
  try {
    const result = yield call(emailLogin, datas);
    const {data, ok} = {data: result, ok: true};
    if (ok) {
      const idTokenResult = yield call(getFbResult);
      const jwtToken = idTokenResult.token;
      if (jwtToken) {
        const {data, ok} = yield call(loginService, {
          token: jwtToken,
        });
        if (ok) {
          const dataFromRevCat = yield call(getUserDataFromRevenewCat);
          const activeSubscriptions =
            dataFromRevCat.entitlements.active['AppStorePlans'] ?? undefined;

          console.log('activeSubscriptions', activeSubscriptions);

          if (activeSubscriptions != undefined) {
            const userUpdate = {
              ...data,
              userData: {
                ...data.user,
                planName:
                  allSubID[activeSubscriptions?.productIdentifier] ?? null,
                identifier: activeSubscriptions?.productIdentifier,
              },
            };
            yield put(updateAuth(userUpdate));
          } else {
            const userUpdate = {
              ...data,
              userData: {...data.user, planName: null, identifier: null},
            };

            yield put(updateAuth(userUpdate));
          }
          console.log('sdjbfjksdbfjbsdjfbsdf', data);
        }
      }
    }
  } catch (error) {
    errorMessage(error?.message.split(' ').slice(1).join(' ') ?? error);
  } finally {
    // delay(4000);
    yield put(loadingFalse());
  }
}

/* `logOutSaga` is a generator function that is used as a saga in a Redux-Saga middleware. It takes an
action object as an argument, but it is not used in the function. The function performs a series of
asynchronous operations using the `yield` keyword. */
function* logOutSaga(action) {
  try {
    // yield call(logoutService);
    yield put({type: types.LogoutType});
    yield call(logOutFirebase);
    console.log('okokok');
  } catch (error) {
    errorMessage(error.message.split(' ').slice(1).join(' '));
  } finally {
    yield put(loadingFalse());
  }
}
/* The `updateProfileSaga` function is a generator function that is used as a saga in a Redux-Saga
middleware. It takes an action object as an argument, destructures its `payload` property to get
`profileData`, and then performs a series of asynchronous operations using the `yield` keyword. */

function* updateProfileSaga({payload: profileData}) {
  yield put(loadingTrue());
  try {
    // console.log('dbnjdf', profileData);
    const {ok, data, originalError} = yield call(
      updateProfileServices,
      profileData,
    );
    console.log('user', originalError, data);
    if (ok) {
      yield put({type: types.UpdateProfile, payload: data.data});
      // successMessage('Your profile has been updated');
    }
  } catch (error) {
    console.log('error ', error);
    errorMessage(error.message.split(' ').slice(1).join(' '));
  } finally {
    delay(2000);
    yield put(loadingFalse());
  }
}

/* This function is used to add the fcm token to the database. */
function* fcmTokenSaga(action) {
  yield call(fcmRegService, action.payload);
}

/* This function is used to reset the user password. */
function* forgotUserSaga(action) {
  try {
    yield put(loadingTrue());
    yield call(forgotPasswordServices, action.payload);
    successMessage('Password Reset Request has been sent to your mail');
    NavigationService.navigate('LoginScreen');
  } catch (error) {
    errorMessage(error.message.split(' ').slice(1).join(' '));
  } finally {
    delay(1000);
    yield put(loadingFalse());
  }
}

function* authSaga() {
  yield takeLatest(types.LoginType, loginSaga);
  yield takeLatest(types.LogoutFirebaseType, logOutSaga);
  yield takeLatest(types.RegisterUser, registerSaga);
  yield takeLatest(types.forgotPasswordType, forgotUserSaga);
  // yield takeLatest(types.UpdateUser, updateProfileSaga);
  // yield takeLatest(types.fcmRegType, fcmTokenSaga);
}

export default authSaga;
