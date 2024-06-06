import {useEffect, useState} from 'react';
import {Image, ImageBackground, StyleSheet, View} from 'react-native';
import {
  dailyForecast,
  showWeather,
  getLocation,
  fiveDaysForecast,
  getWeather,
} from 'react-native-weather-api';
import {
  getProperLocation,
  getValBeforePoint,
} from '../Services/GlobalFunctions';
import {hp, wp} from '../Config/responsive';
import {blackImg, parCloud} from '../Assets';
import {TextComponent} from './TextComponent';
import {FontSize} from '../Theme/Variables';
import Ionicons from 'react-native-vector-icons/Ionicons';

const WeatherComp = () => {
  const [weatherState, setWeatherState] = useState();

  const getWeatherLo = () => {
    let temp;
    let wind;
    getLocation().then(location => {
      getWeather({
        key: 'd3b17fd9554eb61a5ddc829fe4624335',
        lat: location.coords.latitude,
        lon: location.coords.longitude,
        unit: 'metric',
      })
        .then(() => {
          let data = new showWeather();
          setWeatherState(data);
          temp = data.temp;
          wind = data.wind;
        })
        .catch(err =>
          console.log('lskdbvlkbsdlkvblksdbvlksdbklvbsdklbksd', err),
        );
    });
  };

  useEffect(getWeatherLo, []);

  return (
    <ImageBackground
      style={styles.bgImage}
      source={blackImg}
      resizeMode="contain">
      <View style={styles.upView}>
        <Image source={parCloud} resizeMode="contain" style={styles.cloudImg} />
        <View style={styles.upInnerView}>
          <TextComponent
            text={getValBeforePoint(weatherState?.temp)}
            styles={styles.temp}
          />
          <TextComponent text={'°C'} styles={styles.textDeg} />
        </View>
      </View>
      <View style={styles.downView}>
        <TextComponent
          text={`It's ${weatherState?.description}`}
          styles={{color: 'white', width: wp('45')}}
        />
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Ionicons name={'arrow-up'} color={'white'} size={hp('2.5')} />
          <TextComponent
            text={`${weatherState?.temp_max} °C`}
            isWhite={true}
            styles={{marginRight: wp('2')}}
          />
          <Ionicons name={'arrow-down'} color={'white'} size={hp('2.5')} />
          <TextComponent text={`${weatherState?.temp_min} °C`} isWhite={true} />
        </View>
      </View>
    </ImageBackground>
  );
};

export default WeatherComp;

const styles = StyleSheet.create({
  bgImage: {width: wp('96'), alignSelf: 'center', height: hp('20')},
  upView: {
    marginTop: hp('3'),
    flexDirection: 'row',
    width: wp('90'),
    alignSelf: 'center',
  },
  cloudImg: {
    width: wp('40'),
    height: hp('15'),
    position: 'absolute',
    top: hp('-7'),
  },
  upInnerView: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  temp: {
    fontSize: hp('7'),
    color: 'white',
    textAlign: 'right',
    marginLeft: wp('60'),
    fontWeight: 'bold',
  },
  textDeg: {
    fontSize: hp('3'),
    color: 'white',
    fontWeight: 'bold',
    marginTop: hp('1'),
  },
  downView: {
    marginLeft: wp('2'),
    flexDirection: 'row',
    marginTop: hp('1.5'),
  },
});
