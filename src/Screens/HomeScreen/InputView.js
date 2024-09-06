import React, {useCallback} from 'react';
import {Image, View} from 'react-native';
import {AutoFillGoogleComp} from '../../Components/AutoFillGoogleComp';
import {Line, locationArrow, routeIcon} from '../../Assets';
import {styles} from './styles';
import {Colors} from '../../Theme/Variables';
import {hp, wp} from '../../Config/responsive';
import ThemeButton from '../../Components/ThemeButton';
import {TextComponent} from '../../Components/TextComponent';
import {
  getDistancesBetweenLocationsArry,
  hasOneMonthPassed,
} from '../../Services/GlobalFunctions';
import useReduxStore from '../../Hooks/UseReduxStore';

const InputView = ({
  startValFun,
  endValFun,
  chageDes,
  endLocation,
  startLocation,
  startYourTracking,
  isShowBtn,
  isTrackingStart,
  stopTracking,
  railwayTracks,
  kiloMeter,
  currentCoords,
}) => {
  const KlMeterView = useCallback(() => {
    return (
      <TextComponent
        text={`${
          getDistancesBetweenLocationsArry(currentCoords, railwayTracks).filter(
            res => parseFloat(res.km) <= 5,
          ).length ?? 0
        } Rail Tracks`}
        styles={styles.tracksText}
        isWhite={true}
      />
    );
  }, [railwayTracks, currentCoords.lat]);
  const {getState} = useReduxStore();
  const {userData} = getState('Auth');

  console.log(
    'isdbhvjksbdoivbsdivbsodbvsdbdslkvbdkobvdksbosdbnisdilk',
    hasOneMonthPassed(userData?.start_trial_at) && userData?.identifier == null,
    !Boolean(
      hasOneMonthPassed(userData?.start_trial_at) &&
        userData?.identifier == null,
    ),
  );

  return (
    <View
      style={{
        alignSelf: 'center',
        position: 'absolute',
        top: isShowBtn ? hp('40') : hp('45'),
        zIndex: 1,
      }}>
      <View style={styles.desView}>
        {isShowBtn ? (
          <TextComponent
            text={`Destination ${kiloMeter.current}/km`}
            styles={styles.destination}
          />
        ) : (
          <View />
        )}
        <KlMeterView />
      </View>
      <View style={styles.inputViewContainer(isShowBtn)}>
        <View style={styles.inputArea}>
          <Image source={locationArrow} style={styles.inputLeftImg} />
          <AutoFillGoogleComp
            handleButtonClick={e => startValFun(e)}
            key={0}
            inputPlaceHolder="Enter your location"
            inputVal={startLocation}
            defaultValue={startLocation}
            inputContainerStyle={{
              width: wp('77'),
              marginLeft: wp('1'),
            }}
            textInputStyle={{color: Colors.primaryColor}}
            isEdit={false}
            // onChangeText={e => {}}
          />
        </View>
        <Image source={Line} style={styles.dotbar} />
        <View style={{...styles.inputArea}}>
          <Image source={routeIcon} style={styles.inputLeftImg} />
          <AutoFillGoogleComp
            handleButtonClick={e => endValFun(e)}
            key={1}
            inputContainerStyle={{width: wp('77'), marginLeft: wp('1')}}
            inputPlaceHolder="Enter your destination"
            inputVal={endLocation}
            defaultValue={endLocation}
            // onChangeText={e => {}}
            onChangeText={e => chageDes('endLocation', e)}
            isEdit={
              !Boolean(
                hasOneMonthPassed(userData?.start_trial_at) &&
                  userData?.identifier == null,
              ) ?? !isTrackingStart
            }
          />
        </View>
        {isShowBtn &&
          !isTrackingStart &&
          endLocation != null &&
          endLocation != '' && (
            <ThemeButton
              title={'Start your journey'}
              style={styles.startBtn}
              onPress={startYourTracking}
            />
          )}
        {isTrackingStart && (
          <ThemeButton
            title={'Stop Tracking'}
            style={styles.startBtn}
            onPress={stopTracking}
          />
        )}
      </View>
    </View>
  );
};

export default InputView;
