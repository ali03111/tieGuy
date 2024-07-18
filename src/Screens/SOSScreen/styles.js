import {Dimensions, StyleSheet} from 'react-native';
import {hp, wp} from '../../Config/responsive';
import {Colors} from '../../Theme/Variables';

const {width, height} = Dimensions.get('window');

export const styles = StyleSheet.create({
  homeMain: {
    paddingBottom: hp('10'),
  },
  staticMapImg: {
    // marginTop: hp('-15'),
    // zIndex: -2,
    height: height / 3,
    width: wp('100'),
    // marginBottom: hp('5'),
    alignSelf: 'center',
    // overflow: 'hidden',
  },
  heading: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: hp('3.5'),
    marginVertical: hp('1'),
  },
  contactView: {
    width: wp('95'),
    borderRadius: 10,
    paddingVertical: hp('2'),
    paddingHorizontal: wp('2'),
    alignSelf: 'center',
    backgroundColor: 'white',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.58,
    shadowRadius: 5,
    marginVertical: hp('1'),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contactImg: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp('1.8'),
  },
  midleTextView: {
    width: wp('65'),
    paddingLeft: wp('2'),
    alignContent: 'center',
    height: hp('6'),
  },
  contactName: {fontWeight: 'bold', height: hp('3')},
  numberView: {
    width: wp('65'),
    flexDirection: 'row',
    alignItems: 'center',
    height: hp('3'),
  },
});
