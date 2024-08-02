import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  LogBox,
  Platform,
} from 'react-native';
import MainNavigator from './src/navigation/MainNavigator';
import {logoScreen} from './src/Assets';
import Overlay from './src/Components/Overlay';
import useReduxStore from './src/Hooks/UseReduxStore';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {IOSNotifyPer, reqPerNotiAND} from './src/Services/GlobalFunctions';
import PushNotification, {Importance} from 'react-native-push-notification';
import {Settings} from 'react-native-fbsdk-next';
import Purchases, {LOG_LEVEL} from 'react-native-purchases';

const App = () => {
  const [isVisible, setIsVisible] = useState(true);
  const Hide_Splash_Screen = () => {
    setIsVisible(false);
  };
  const {getState} = useReduxStore();
  const {isloading} = getState('isloading');
  const {isLogin, userData} = getState('Auth');

  /**
   * The function `revenewCat` configures the Purchases library with the appropriate API key based on
   * the platform (iOS or Android).
   */
  const revenewCat = async () => {
    Purchases.setLogLevel(LOG_LEVEL.VERBOSE);
    const configured = await Purchases.isConfigured();
    console.log('ksdbvjksdbkjsbdjkvbsdjkbjsbkjsdbvklsdb', configured);
    if (Platform.OS == 'ios') {
      await Purchases.configure({apiKey: 'appl_KkReTYDfpRwQdDMvgLfIGkxFXbI'});
    } else if (Platform.OS == 'android') {
      await Purchases.configure({apiKey: 'goog_zVmRcmkWtsEyTSxouECGkmOATcz'});
    }
  };

  useEffect(() => {
    /**
     * Initialize the sdk
     */
    (function initializeSDK() {
      Settings.initializeSDK();
    })();

    /**
     * Set app id
     */

    Settings.setAppID('1190249341991041');
  }, []);

  const time = () => {
    return 3000;
  };

  useEffect(() => {
    /* It's a function that registers the device to receive push notifications. */
    if (isLogin) {
      setTimeout(() => {
        PushNotification.configure({
          onNotification: function (notification) {
            console.log('Local Notification', notification);
          },
          popInitialNotification: true,
          requestPermissions: true,
          permissions: {
            alert: true,
            badge: true,
            sound: true,
          },
        });

        // if (Platform.OS == 'ios') IOSNotifyPer();
        // else reqPerNotiAND();
      }, 5000);
    }
  }, [isLogin]);

  useEffect(() => {
    revenewCat();
  }, []);

  useEffect(async () => {
    GoogleSignin.configure({
      iosClientId:
        '664658424087-lcsk0ihine61evfk8n3umt9c5ot3j0ao.apps.googleusercontent.com',
      webClientId:
        Platform.OS == 'ios'
          ? '664658424087-lcsk0ihine61evfk8n3umt9c5ot3j0ao.apps.googleusercontent.com'
          : '664658424087-v2dlr35kebo9c9d8u305f2hgjeiqvosv.apps.googleusercontent.com',
    });
    (async () => {
      LogBox.ignoreLogs([
        'VirtualizedLists should never be nested',
        'ViewPropTypes will be removed from React Native',
        'Settings is not yet supported on Android',
        'ViewPropTypes will be removed',
        "exported from 'deprecated-react-native-prop-types'.",
        'Sending...',
        'Non-serializable values were found in the navigation state',
      ]);
      LogBox.ignoreAllLogs(true);
    })();
    // await logOutFirebase();
    setTimeout(function () {
      Hide_Splash_Screen();
    }, time());
  }, []);

  let Splash_Screen = (
    <ImageBackground
      source={logoScreen}
      style={styles.SplashScreen_RootView}></ImageBackground>
  );

  return (
    <>
      {isVisible === true ? Splash_Screen : <MainNavigator />}
      {isloading && <Overlay />}
      {/* <StackNavigatior />; */}
    </>
  );
};

const styles = StyleSheet.create({
  SplashScreen_RootView: {
    justifyContent: 'center',
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
  },
});

export default App;
