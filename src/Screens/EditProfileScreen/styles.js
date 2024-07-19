import {Dimensions, StyleSheet} from 'react-native';
import {hp, wp} from '../../Config/responsive';
import {Colors} from '../../Theme/Variables';

export const styles = StyleSheet.create({
  editProfileMain: {
    marginVertical: hp('6'),
  },
  whiteCircle: {
    height: hp('16'),
    width: wp('32'),
    alignSelf: 'center',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileView: {
    width: Dimensions.get('window').width * 0.37,
    height: Dimensions.get('window').width * 0.37,
  },
  addIcon: {
    position: 'absolute',
    left: wp('15'),
    height: hp('2'),
    top: hp('9.5'),
  },
  inputView: {
    flexDirection: 'row',
    width: wp('90'),
    alignSelf: 'center',
    borderRadius: 10,
    borderWidth: 1,
    height: hp('6'),
    marginTop: hp('1'),
    alignItems: 'center',
    borderColor: Colors.grayBorder,
    paddingLeft: wp('2'),
    backgroundColor: 'transparent',
    color: 'black',
  },
  btn: {width: wp('90'), marginTop: hp('5'), alignSelf: 'center'},
  inputMainView: {width: wp('90'), alignSelf: 'center', marginTop: hp('2')},
});
