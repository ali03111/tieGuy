import {useState} from 'react';
import useReduxStore from '../../Hooks/UseReduxStore';
import {logOutUser} from '../../Redux/Action/AuthAction';
import {logoutService} from '../../Services/AuthServices';
import {Linking} from 'react-native';
import {useMutation} from '@tanstack/react-query';
import API from '../../Utils/helperFunc';
import {DeleteAccUrl} from '../../Utils/Urls';
import {errorMessage, successMessage} from '../../Config/NotificationMessage';

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
    } else {
      toggleAlert(item?.onPress);
      // console.log('asd asd');
    }
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
