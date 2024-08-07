import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import useReduxStore from '../Hooks/UseReduxStore';
import NavigationService from '../Services/NavigationService';
import * as Screens from '../Screens/index';
import MybottomTabs from './bottomNavigation';
import Orientation from 'react-native-orientation-locker';

const Stack = createNativeStackNavigator();

function MainNavigator() {
  const {getState} = useReduxStore();
  const {onboarding} = getState('onboarding');
  const {isLogin} = getState('Auth');

  return (
    <NavigationContainer
      ref={ref => {
        NavigationService.setRef(ref);
        // const p = NavigationService.getCurrentRoute(ref.getCurrentRoute());
      }}>
      <Stack.Navigator
        screenOptions={{
          headerTransparent: true,
          headerTitle: null,
          headerShown: false,
        }}>
        {!onboarding && (
          <Stack.Screen
            name="OnBoardScreen"
            component={Screens.OnBoardScreen}
          />
        )}
        {!isLogin && (
          <>
            <Stack.Screen name="LoginScreen" component={Screens.LoginScreen} />
            <Stack.Screen
              name="RegisterScreen"
              component={Screens.RegisterScreen}
            />
            <Stack.Screen
              name="ForgotPasswordScreen"
              component={Screens.ForgotPasswordScreen}
            />
          </>
        )}
        {isLogin && (
          <>
            <Stack.Screen name="MybottomTabs" component={MybottomTabs} />
            <Stack.Screen
              name="SubscriptionScreen"
              component={Screens.SubscriptionScreen}
            />
            <Stack.Screen
              name="EditProfileScreen"
              component={Screens.EditProfileScreen}
            />

            <Stack.Screen
              name="ChangePasswordScreen"
              component={Screens.ChangePasswordScreen}
            />
            <Stack.Screen
              name="EmergencyContactScreen"
              component={Screens.EmergencyContactScreen}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default MainNavigator;
