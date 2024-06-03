import {StyleSheet} from 'react-native';
import {hp, wp} from '../../Config/responsive';
import {Colors} from '../../Theme/Variables';

export const styles = StyleSheet.create({
  homeMain: {
    paddingBottom: hp('10'),
  },
  staticMapImg: {
    marginTop: hp('-15'),
    // zIndex: -2,
    height: hp('70'),
    width: wp('100'),
    marginBottom: hp('5'),
    alignSelf: 'center',
    // overflow: 'hidden',
  },
  inputViewContainer: {
    width: wp('95'),
    borderRadius: 20,
    paddingVertical: hp('3'),
    backgroundColor: 'white',
    alignSelf: 'center',
    position: 'absolute',
    top: hp('45'),
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.58,
    shadowRadius: 5,
  },
  inputArea: {
    flexDirection: 'row',
    // alignItems: 'center',
    // paddingTop: hp('6'),
    // backgroundColor: 'green',
  },
  inputLeftImg: {
    width: wp('8'),
    height: hp('5'),
    resizeMode: 'contain',
    marginHorizontal: wp('2'),
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
  dotbar: {
    width: wp('12'),
    height: hp('3'),
    resizeMode: 'contain',
    // backgroundColor: 'red',
  },
  startBtn: {
    width: wp('87'),
    alignSelf: 'center',
    marginTop: hp('2'),
    height: hp('6'),
  },
});
