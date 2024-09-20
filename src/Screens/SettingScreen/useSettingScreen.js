import {useState} from 'react';
import useReduxStore from '../../Hooks/UseReduxStore';
import {logOutUser} from '../../Redux/Action/AuthAction';
import {logoutService} from '../../Services/AuthServices';
import {Linking} from 'react-native';
import {useMutation} from '@tanstack/react-query';
import API from '../../Utils/helperFunc';
import {DeleteAccUrl, restorePurchUrl} from '../../Utils/Urls';
import {errorMessage, successMessage} from '../../Config/NotificationMessage';
import Purchases from 'react-native-purchases';
import {types} from '../../Redux/types';
import {allSubID} from '../../Utils/localDB';
import {loadingFalse, loadingTrue} from '../../Redux/Action/isloadingAction';

/**
 * The function `useSettingScreen` handles navigation and logout functionality in a setting screen
 * component.
 * @returns The `useSettingScreen` function is returning an object with the following properties and
 * methods:
 */
const useSettingScreen = ({navigate, goBack}) => {
  const {dispatch, getState} = useReduxStore();
  const {userData} = getState('Auth');

  console.log('kjdsbvjksdbvjksdbjkvbsdjkvbsdjbksdbdjksd', userData);

  const [alertState, setAlertState] = useState({
    logoutAlert: false,
    deleteAlert: false,
  });

  const {mutate} = useMutation({
    mutationFn: () => API.delete(DeleteAccUrl),
    onSuccess: async ({ok, data}) => {
      if (ok) {
        successMessage(data?.message);
        dispatch(logOutUser());
      } else errorMessage(data?.message);
    },
    onError: e => errorMessage(e),
  });

  const {deleteAlert, logoutAlert} = alertState;

  const updateState = data => setAlertState(prev => ({...prev, ...data}));

  const toggleAlert = state => updateState({[state]: !alertState[state]});

  const restorePurchases = async () => {
    dispatch(loadingTrue());
    try {
      const restore = await Purchases.restorePurchases();

      const activeSubscriptions =
        restore.entitlements.active['AppStorePlans'] ?? undefined;

      /** The condition `if (restore.entitlements.active['AppStorePlans'] != undefined)` is checking if
    the 'AppStorePlans' entitlement is active in the restored purchases. **/
      if (activeSubscriptions != undefined) {
        const {ok, data} = await API.post(restorePurchUrl, {
          identifier: activeSubscriptions.productIdentifier,
          rev_id: restore.originalAppUserId,
        });
        console.log(
          'lskdbklbsdklvbsdklvbklsdbvklsdbvklsdbvksdbklvsbdlkvbsklvds',
          data,
        );

        if (ok) {
          dispatch({
            type: types.UpdateProfile,
            payload: {
              ...data,
              planName:
                allSubID[activeSubscriptions?.productIdentifier] ?? null,
              identifier: activeSubscriptions?.productIdentifier,
            },
          });
          dispatch(loadingFalse());
        } else errorMessage('Failed to fetch data from server');
      } else {
        dispatch({
          type: types.UpdateProfile,
          payload: {...data, planName: null, identifier: null},
        });
        dispatch(loadingFalse());
      }
    } catch (e) {
      errorMessage('Failed to fetch data from server');
      dispatch(loadingFalse());
      console.log('e', e);
    }
  };

  const onConfirm = val => {
    toggleAlert(val);
    if (val == 'logoutAlert') {
      setTimeout(async () => {
        // await logoutService();
        dispatch(logOutUser());
      }, 900);
    } else mutate();
  };
  const onCancel = () => {
    setAlert(!alert);
  };
  const tabScreen = item => {
    if (item?.screenUrl) {
      navigate(item?.screenUrl);
    } else if (item?.pageUrl) {
      Linking.openURL(item?.pageUrl);
    } else if (item?.onPress == 'restorePurchases') {
      restorePurchases();
      // console.log('asd asd');
    } else toggleAlert(item?.onPress);
  };
  return {
    onCancel,
    onConfirm,
    tabScreen,
    alert,
    deleteAlert,
    logoutAlert,
    toggleAlert,
    userData,
  };
};

export default useSettingScreen;
