import {StyleSheet} from 'react-native';
import {hp, wp} from '../../Config/responsive';
import {Colors} from '../../Theme/Variables';

export const styles = StyleSheet.create({
  addNewBtn: {
    height: hp('6'),
    alignItem: 'center',
    marginVertical: hp('1.5'),
  },
  addBtnImg: {flex: 1, width: wp('50'), left: wp('-8')},
  divider: {
    borderBottomColor: 'black',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  flatListCont: {
    // flexGrow: 1,
    width: wp('90'),
    alignSelf: 'center',
    paddingBottom: hp('15'),
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
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: wp('100'),
    height: hp('100'),
    opacity: 0.9,
  },
  modalData: {
    // height: tripType ? hp('40') : hp('30'),
    backgroundColor: Colors.white,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    shadowColor: '#000000',
    shadowOffset: {
      width: 2,
      height: 10,
    },
    shadowOpacity: 3,
    shadowRadius: 7.68,
    elevation: 20,
    width: wp('100'),
    paddingHorizontal: wp('5'),
    paddingBottom: hp('5'),
    // height: hp('40'),
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
  },
  mainView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  underModal: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  closeBtn: {
    alignSelf: 'flex-end',
    marginTop: hp('2'),
  },
  closeImg: {
    width: wp('8'),
    height: hp('4'),
  },
  emergencyText: {
    textAlign: 'center',
    marginBottom: hp('2'),
    fontWeight: 'bold',
    fontSize: hp('2.5'),
  },
  uploadBtn: {
    width: wp('90'),
    height: hp('14'),
    alignSelf: 'center',
    borderRadius: 10,
    borderColor: Colors.grayBorder,
    borderWidth: 1,
    marginTop: hp('1'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  upIcon: {width: wp('10'), height: hp('5')},
  errorMessage: {
    color: Colors.themeRed,
    fontSize: hp('1.5'),
    marginTop: hp('1'),
  },
  menuOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: hp('0.5'),
  },
  menuImg: {height: hp('3'), width: wp('6'), marginRight: wp('2')},
  mainMenu: {
    borderRadius: 10,
    overflow: 'hidden',
    paddingLeft: wp('2'),
    paddingVertical: hp('1'),
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.58,
    shadowRadius: 5,
  },
  uploadedImg: {
    width: wp('90'),
    height: hp('14'),
    overflow: 'hidden',
    borderRadius: 10,
  },
});
