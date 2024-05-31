import React, {useCallback, useRef, useState} from 'react';
import {View, Text} from 'react-native';
import useReduxStore from '../../Hooks/UseReduxStore';

import useHomeScreen from './useHomeScreen';
import { styles } from './styles';

const HomeScreen = ({navigation}) => {
  const {dispatch} = useReduxStore();
  const {homeScreenBtns, onPress} = useHomeScreen(navigation);

  return (
    <View style={styles.homeMain}>
      <Text>logout</Text>
    </View>
  );
};

export default HomeScreen;
