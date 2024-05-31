import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {errorMessage} from '../Config/NotificationMessage';

export default function flash() {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text onPress={() => errorMessage('asdasd')}>flash</Text>
    </View>
  );
}

const styles = StyleSheet.create({});
