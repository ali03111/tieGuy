import {background} from '@/Assets/Images';
import React, {useState} from 'react';
import {View} from 'react-native';
import {Blurhash} from 'react-native-blurhash';
import FastImage from 'react-native-fast-image';
import {wp} from '../Config/responsive';

const BlurImage = ({
  styles,
  uri,
  blurhash,
  radius,
  children,
  isURI,
  blurStyle,
}) => {
  const [load, setLoad] = useState(true);
  const imageSource = {uri, priority: FastImage.priority.high};
  // const imageSource = uri
  //   ? {uri, priority: FastImage.priority.normal}
  //   : background;
  return (
    <View
      style={[
        {
          position: 'relative',
          overflow: 'hidden',
          borderRadius: radius || 10,
          // backgroundColor: 'red',
          width: wp('30'),
          alignSelf: 'center',
          // top: -10,
        },
        blurStyle,
      ]}>
      <FastImage
        style={[styles, {zIndex: -1, position: 'relative'}]}
        source={isURI ? imageSource : uri}
        onLoad={() => setLoad(false)}
      />
      {load && (
        <Blurhash
          shouldRasterizeIOS
          blurhash={blurhash || 'LZQ@#QjZQ7oft7j[j[ayQ7j[V@ae'}
          style={[styles, {zIndex: 1, position: 'absolute'}]}
        />
      )}
      {children}
    </View>
  );
};

export default React.memo(BlurImage);
