import {StyleSheet} from 'react-native';
import {hp, wp} from '../../Config/responsive';
import {Colors} from '../../Theme/Variables';

export const styles = StyleSheet.create({
  homeMain: {
    flex: 1,
  },
  staticMapImg: {
    marginTop: hp('-15'),
    // zIndex: -2,
    height: hp('75'),
    width: wp('100'),
    marginBottom: hp('5'),
    alignSelf: 'center',
    // overflow: 'hidden',
  },
  inputArea: {
    flexDirection: 'row',
    // alignItems: 'center',
    // paddingTop: hp('6'),
    // backgroundColor: 'green',
  },
  inputLeftImg: {
    width: wp('10'),
    height: hp('5'),
    resizeMode: 'contain',
  },
  input: {
    borderColor: Colors.grayBorder,
    border: 1,
    height: hp('6'),
    marginVertical: hp('2'),
    borderWidth: 1,
    borderRadius: 7,
    // paddingHorizontal: wp('3'),
    flex: 1,
    marginHorizontal: wp('3'),
  },
});
