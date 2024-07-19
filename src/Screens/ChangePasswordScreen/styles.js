import {StyleSheet} from 'react-native';
import {hp, wp} from '../../Config/responsive';
import {Colors} from '../../Theme/Variables';

export const styles = StyleSheet.create({
  heading: {
    textAlign: 'center',
    fontSize: hp('3'),
    marginTop: hp('8'),
    fontWeight: 'bold',
    color: Colors.primaryColor,
  },
  des: {
    width: wp('90'),
    textAlign: 'center',
    alignSelf: 'center',
    marginTop: hp('1'),
  },
  centerView: {
    width: wp('93'),
    alignSelf: 'center',
    borderRadius: 10,
    paddingVertical: hp('3'),
    alignItems: 'center',
    marginTop: hp('5'),
    marginBottom: hp('10'),
  },
  btn: {width: wp('85'), marginTop: hp('5')},
  lockstyle: {
    flex: 0.5,
  },
  inputView: {
    flexDirection: 'row',
    width: wp('85'),
    alignSelf: 'center',
    borderRadius: 10,
    borderWidth: 1,
    height: hp('7'),
    marginTop: hp('1'),
    alignItems: 'center',
    borderColor: Colors.grayBorder,
    paddingLeft: wp('2'),
    backgroundColor: 'transparent',
    color: 'black',
  },
});
