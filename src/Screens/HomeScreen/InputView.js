import {useCallback} from 'react';
import {Image, View} from 'react-native';
import {AutoFillGoogleComp} from '../../Components/AutoFillGoogleComp';
import {Line, locationArrow, routeIcon} from '../../Assets';
import {styles} from './styles';
import {Colors} from '../../Theme/Variables';
import {hp, wp} from '../../Config/responsive';
import ThemeButton from '../../Components/ThemeButton';

const InputView = ({
  startValFun,
  endValFun,
  chageDes,
  endLocation,
  startLocation,
}) => {
  return (
    <View style={styles.inputViewContainer}>
      <View style={styles.inputArea}>
        <Image source={locationArrow} style={styles.inputLeftImg} />
        <AutoFillGoogleComp
          handleButtonClick={e => startValFun(e)}
          key={0}
          inputPlaceHolder="Enter your location"
          inputVal={startLocation}
          defaultValue={startLocation}
          inputContainerStyle={{
            width: wp('78'),
            marginLeft: wp('1'),
          }}
          textInputStyle={{color: Colors.primaryColor}}
          onChangeText={text => chageDes('startLocation', text)}
        />
      </View>
      <Image source={Line} style={styles.dotbar} />
      <View style={{...styles.inputArea}}>
        <Image source={routeIcon} style={styles.inputLeftImg} />
        <AutoFillGoogleComp
          handleButtonClick={e => {
            endValFun(e);
          }}
          key={1}
          inputContainerStyle={{width: wp('78'), marginLeft: wp('1')}}
          inputPlaceHolder="Enter your destination"
          inputVal={endLocation}
          defaultValue={endLocation}
          onChangeText={text => chageDes('startLocation', text)}
        />
      </View>
      <ThemeButton title={'Start your journey'} style={styles.startBtn} />
    </View>
  );
};

export default InputView;
