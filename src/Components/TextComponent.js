import React from 'react';
import {Text} from 'react-native';
import {hp} from '../Config/responsive';
import {Colors} from '../Theme/Variables';

export const TextComponent = ({
  text,
  styles,
  onPress,
  numberOfLines,
  isWhite,
}) => {
  return (
    <Text
      onPress={onPress}
      numberOfLines={numberOfLines}
      style={{
        color: isWhite ? Colors.white : Colors.black,
        fontSize: hp('2'),
        ...styles,
      }}>
      {text}
    </Text>
  );
};
