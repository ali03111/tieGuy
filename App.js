import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, ImageBackground, LogBox} from 'react-native';
import MainNavigator from './src/navigation/MainNavigator';
import {logoScreen} from './src/Assets';
import Overlay from './src/Components/Overlay';
import useReduxStore from './src/Hooks/UseReduxStore';

const App = () => {
  const [isVisible, setIsVisible] = useState(true);
  const Hide_Splash_Screen = () => {
    setIsVisible(false);
  };
  const {getState, dispatch} = useReduxStore();
  const {isloading} = getState('isloading');

  const time = () => {
    return 3000;
  };

  // useEffect(() => {
  //   /* It's a function that registers the device to receive push notifications. */
  //   if (isLogin) {
  //     setTimeout(() => {
  //       fcmService.register(
  //         onRegister,
  //         onOpenNotification,
  //         appState.current,
  //         onNotification,
  //       );
  //     }, 5000);
  //   }
  //   return () => {
  //     /* It's a function that unregisters the device from receiving push notifications. */
  //     if (isLogin) {
  //       fcmService.unRegister();
  //     }
  //   };
  // }, [isLogin]);

  useEffect(async () => {
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
