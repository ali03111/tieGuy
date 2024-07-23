import {View, Text} from 'react-native';
import React, {memo} from 'react';
import useSubscriptionScreen from './useSubscriptionScreen';
import {HeaderComponent} from '../../Components/HeaderComponent';

const SubscriptionScreen = ({navigation}) => {
  const {} = useSubscriptionScreen(navigation);
  return (
    <View style={{flex: 1}}>
      <HeaderComponent headerTitle={'Subscription Plan'} />
      <Text>index</Text>
    </View>
  );
};

export default memo(SubscriptionScreen);
