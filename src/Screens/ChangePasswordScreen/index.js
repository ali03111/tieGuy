import React, {memo} from 'react';
import {StatusBar, View} from 'react-native';
import {Colors} from '../../Theme/Variables';
import {TextComponent} from '../../Components/TextComponent';
import {hp, wp} from '../../Config/responsive';
import {InputComponent} from '../../Components/InputComponent';
import {styles} from './styles';
import useChangePasswordScreen from './useChangePasswordScreen';
import {lock, locksetting} from '../../Assets';
import ThemeButton from '../../Components/ThemeButton';
import KeyBoardWrapper from '../../Components/KeyBoardWrapper';
import {HeaderComponent} from '../../Components/HeaderComponent';

const ChangePasswordScreen = ({navigation}) => {
  const {handleSubmit, errors, reset, control, getValues, changePassword} =
    useChangePasswordScreen(navigation);

  return (
    <View
      style={{
        flex: 1,
        position: 'relative',
        // paddingBottom: hp('10'),
      }}
      bounce={false}>
      {/* <StatusBar backgroundColor={Colors.themeRed} barStyle={'light-content'} /> */}
      <HeaderComponent
        headerTitle={'Change Password'}
        goBack={() => navigation.goBack()}
        isBack
      />
      <KeyBoardWrapper>
        <TextComponent text={'Create New Password'} styles={styles.heading} />
        <TextComponent
          text={
            'Your new password must be different from your previous password.'
          }
          styles={styles.des}
          numberOfLines={2}
        />
        <View style={styles.centerView}>
          <View>
            <TextComponent
              text={'Current Password'}
              fade={true}
              styles={{color: 'gray'}}
            />
            <InputComponent
              {...{
                name: 'password',
                handleSubmit,
                errors,
                reset,
                control,
                getValues,
                placeholder: 'Current Password',
                isImage: locksetting,
                defaultValue: '',
                isSecure: true,
                inputIconStyle: styles.lockstyle,
                tintColor: 'gray',
                viewStyle: styles.inputView,
                errorsTextStyle: {color: 'red', width: wp('80')},
                textStyle: {color: 'black'},
                plColor: 'gray',
              }}
            />
          </View>
          <View style={{marginTop: hp('5')}}>
            <TextComponent
              text={'New Password'}
              fade={true}
              styles={{color: 'gray'}}
            />
            <InputComponent
              {...{
                name: 'new_password',
                handleSubmit,
                errors,
                reset,
                control,
                getValues,
                placeholder: 'New Password',
                isImage: locksetting,
                defaultValue: '',
                isSecure: true,
                inputIconStyle: styles.lockstyle,
                tintColor: 'gray',
                viewStyle: styles.inputView,
                errorsTextStyle: {color: 'red', width: wp('80')},
                plColor: 'gray',
                textStyle: {color: 'black'},
              }}
            />
          </View>
          <View style={{marginTop: hp('2')}}>
            <TextComponent
              text={'Re-type New Password'}
              fade={true}
              styles={{color: 'gray'}}
            />
            <InputComponent
              {...{
                name: 'confirm_password',
                handleSubmit,
                errors,
                reset,
                control,
                getValues,
                placeholder: 'Re-type New Password',
                isImage: locksetting,
                defaultValue: '',
                isSecure: true,
                inputIconStyle: styles.lockstyle,
                tintColor: 'gray',
                viewStyle: styles.inputView,
                errorsTextStyle: {color: 'red', width: wp('80')},
                plColor: 'gray',
                textStyle: {color: 'black'},
              }}
            />
          </View>
          <ThemeButton
            title={'Change'}
            onPress={handleSubmit(changePassword)}
            style={styles.btn}
          />
        </View>
      </KeyBoardWrapper>
    </View>
  );
};

export default memo(ChangePasswordScreen);
