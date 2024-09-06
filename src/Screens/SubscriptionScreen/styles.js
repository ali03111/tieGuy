import {hp, wp} from '../../Config/responsive';
import {Colors} from '../../Theme/Variables';

const {StyleSheet} = require('react-native');

export const styles = StyleSheet.create({
  heading: {
    textAlign: 'center',
    fontSize: hp('3'),
    fontWeight: 'bold',
    marginBottom: hp('2'),
    // marginTop
  },
  subView: {
    width: wp('90'),
    alignSelf: 'center',
    borderRadius: 20,
    backgroundColor: 'white',
    height: hp('35'),
    // overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.58,
    shadowRadius: 5,
    elevation: 20,
    // paddingBottom: hp('10'),
  },
  bgImage: {
    flex: 1,
    aspectRatio: 1,
    paddingHorizontal: wp('2'),
    position: 'absolute',
    width: wp('50'),
    height: hp('35'),
    borderRadius: 20,
  },
  priceView: {flex: 1, paddingLeft: wp('2'), position: 'relative'},
  textView: {
    flexDirection: 'row',
    width: wp('83'),
    justifyContent: 'space-between',
    marginTop: hp('2'),
  },
  bottomTextView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: hp('0.8'),
  },
  chooseBtn: {
    marginBottom: hp('1'),
    width: wp('85'),
    alignSelf: 'center',
  },
  logInWith: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: hp('2.5'),
    textAlign: 'center',
    alignItems: 'center',
  },
  logInBorder: {
    borderBottomWidth: 1,
    height: 0,
    flex: 0.1,
    backgroundColor: 'black',
  },
  logInText: {
    flex: 1,
    fontSize: hp('2'),
    color: Colors.black,
    paddingHorizontal: wp('4'),
    justifyContent: 'center',
    textAlign: 'center',
  },
});
