import React, {memo, useState} from 'react';
import {View, Text, Image, ScrollView, ImageBackground} from 'react-native';
import {TextComponent} from '../../Components/TextComponent';
import {styles} from './styles';
import ThemeButton from '../../Components/ThemeButton';
import {
  apple,
 
  facebook,
  google,
  lock,
  locksetting,
 
  sms,
  tickemp,
  tickfill,
} from '../../Assets';
import {InputComponent} from '../../Components/InputComponent';
import {Controller} from 'react-hook-form';
import useLogin from './useLoginScreen';
import {Touchable} from '../../Components/Touchable';
import KeyBoardWrapper from '../../Components/KeyBoardWrapper';
import {LoginBg} from '../../Assets';
import {hp, wp} from '../../Config/responsive';
import { Colors } from '../../Theme/Variables';

const LoginScreen = ({navigation}) => {
  // const [check, setCheck] = useState(!isCheck);
  const [check, setCheck] = useState();
  const handleClick = () => setCheck(!check);

  const {
    handleSubmit,
    errors,
    reset,
    control,
    getValues,
    onPress,
    loginUser,
    appleIdlogin,
    googleLoginFunc,
    facebookLoginFunc,
    rememberValue,
    remember,
  } = useLogin(navigation);
  return (
    <ImageBackground source={LoginBg} style={styles.ImgBg}>
      <KeyBoardWrapper
        styles={styles.logInMain}
        showsVerticalScrollIndicator={false}>
       
        <View style={styles.loginBottom}>
        <View style={styles.loginTop}>
          <TextComponent text={'Log In'} styles={styles.signInText} />
        </View>
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
            }}
          />
          <InputComponent
            {...{
              name: 'password',
              handleSubmit,
              errors,
              reset,
              control,
              getValues,
              placeholder: 'Password',
              isImage: lock,
              defaultValue: '',
              isSecure: true,
              isImage: locksetting,
              inputIconStyle: styles.lockstyle,
            }}
          />

          <View style={{paddingTop: hp('3')}}>
            <ThemeButton onPress={handleSubmit(loginUser)} title={'Log In'} />
          </View>

          <View style={styles.rememberSec}>
            <View style={styles.checkContainer}>
               <Touchable style={styles.checkContainer} onPress={handleClick}>
                <Image
                  source={check ? tickfill : tickemp}
                  style={{
                    resizeMode: 'contain',
                    // tintColor: Colors.white,
                    width: wp('5.5')
                  }}
                />
              </Touchable>
                <TextComponent text={'Remember me'} styles={styles.remStyle}/>
              </View>
            <TextComponent
              text={'Forgot Password?'}
              styles={styles.forgetText}
              onPress={() => navigation.navigate('ForgetPasswordScreen')}
            />
          </View>

          <View style={styles.barMain}>
            <View style={styles.barLine}></View>
            <TextComponent text={'Or Log In with'} styles={styles.barText} />
            <View style={styles.barLine}></View>
          </View>
          <View style={styles.social}>
            <Touchable style={styles.socialIcons}>
              <Image
                source={google}
                style={styles.socialImage}
                resizeMode="contain"
              />
            </Touchable>
            <Touchable style={styles.socialIcons}>
              <Image
                source={apple}
                style={styles.socialImage}
                resizeMode="contain"
              />
            </Touchable>
            <Touchable style={styles.socialIcons}>
              <Image
                source={facebook}
                style={styles.socialImage}
                resizeMode="contain"
              />
            </Touchable>
          </View>

          <View style={styles.dontHave}>
            <TextComponent
              text={'Don’t have an account?'}
              styles={styles.dontHaveText}
            />
            <Touchable onPress={onPress}>
              <Text style={styles.signUpText}>Sign Up</Text>
            </Touchable>
          </View>

        </View>
      </KeyBoardWrapper>
    </ImageBackground>
  );
};
export default memo(LoginScreen);
