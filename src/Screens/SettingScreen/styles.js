import {Dimensions, StyleSheet} from 'react-native';
import {hp, wp} from '../../Config/responsive';
import {Colors} from '../../Theme/Variables';

export const styles = StyleSheet.create({
  profileArea: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(45, 45, 45, 0.1)',
    marginBottom: hp('2.5'),
  },
  userName: {
    textAlign: 'center',
    marginTop: hp('2'),
    fontSize: hp('3'),
    color: Colors.primaryColor,
    fontWeight: '600',
    marginBottom: hp('.5'),
  },
  trailText: {
    alignSelf: 'center',
    marginBottom: hp('1'),
    paddingVertical: hp('1'),
    backgroundColor: Colors.primaryColor,
    paddingHorizontal: hp('2'),
    borderRadius: 10,
    overflow: 'hidden',
    color: 'white',
  },

  cardBtn: {
    flex: 1,
    flexDirection: 'row',
    // flexWrap: 'wrap',
    marginHorizontal: wp('4'),
    marginBottom: hp('2'),
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: wp('2.5'),
    paddingVertical: wp('2.5'),
    borderRadius: 10,
  },
  iconStyle: {
    width: wp('12'),
    height: hp('6'),
    // marginBottom: hp('2'),
    resizeMode: 'contain',
  },
  catMain: {
    marginTop: hp('1'),
  },
  titleStyle: {
    width: wp('69'),
    paddingHorizontal: wp('3'),
    fontSize: hp('2'),
    fontWeight: '500',
    color: Colors.black,
  },
  descStyle: {
    fontSize: hp('1.7'),
    fontWeight: '300',
    color: Colors.textGray,
  },
  arrowRight: {
    width: wp('6'),
    height: hp('3'),
    // backgroundColor: 'red',
  },
  proMain: {
    marginTop: hp('5'),
  },
  ProfileImage: {
    // width: wp('20'),
    height: hp('15'),
    aspectRatio: 1,
  },
  profileEditImg: {
    alignSelf: 'center',
    borderRadius: Math.round(
      Dimensions.get('window').width + Dimensions.get('window').height,
    ),
    width: Dimensions.get('window').width * 0.3,
    height: Dimensions.get('window').width * 0.3,
  },
  userProfileImg: {
    backgroundColor: Colors.white,
  },
  addImageIcon: {
    alignSelf: 'center',
    width: wp('14'),
    height: hp('8'),
    resizeMode: 'contain',
  },
});
