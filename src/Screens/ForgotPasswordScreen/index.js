import React, {memo} from 'react';
import {View, Text, ImageBackground} from 'react-native';
import {styles} from './styles';
import {arrowBack, email, LoginBg, sms} from '../../Assets';
import useForgotPassword from './useForgotPasswordScreen';
import {TextComponent} from '../../Components/TextComponent';
import {InputComponent} from '../../Components/InputComponent';
import {hp} from '../../Config/responsive';
import ThemeButton from '../../Components/ThemeButton';
import {HeaderComponent} from '../../Components/HeaderComponent';

const ForgotPasswordScreen = ({navigation}) => {
  const {
    goBack,
    handleSubmit,
    errors,
    reset,
    control,
    getValues,
    forgotPassword,
  } = useForgotPassword(navigation);

  return (
    <ImageBackground source={LoginBg} style={styles.ImgBg}>
      <TextComponent text={'Forgot Password'} styles={styles.heading} />
      <TextComponent
        text={
          "Provide your account's email for which you want to reset your password."
        }
        isWhite
        styles={styles.createAcc}
      />
      <InputComponent
        {...{
          name: 'email',
          handleSubmit,
          errors,
          reset,
          control,
          getValues,
          placeholder: 'Email',
          isImage: sms,
          defaultValue: '',
          viewStyle: styles.inputStyle,
        }}
      />
      <ThemeButton
        onPress={handleSubmit(forgotPassword)}
        title={'Send'}
        btnStyle={styles.buttonStyle}
        style={{marginTop: hp('35')}}
      />
    </ImageBackground>
  );
};

export default memo(ForgotPasswordScreen);
