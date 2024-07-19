import {View, Text, ImageBackground, Image, TextInput} from 'react-native';
import React, {memo} from 'react';
import {HeaderComponent} from '../../Components/HeaderComponent';
import {CircleImage} from '../../Components/CircleImage';
import {Touchable} from '../../Components/Touchable';
import {styles} from './styles';
import {addProfileImage} from '../../Assets';
import {imageUrl} from '../../Utils/Urls';
import useEditProfileScreen from './useEditProfileScreen';
import {hp, wp} from '../../Config/responsive';
import {TextComponent} from '../../Components/TextComponent';
import {Colors} from '../../Theme/Variables';
import ThemeButton from '../../Components/ThemeButton';
import {InputComponent} from '../../Components/InputComponent';
import {formatString} from '../../Services/GlobalFunctions';

const EditProfileScreen = ({navigation}) => {
  const {
    userData,
    onSave,
    uploadFromGalary,
    profileData,
    handleSubmit,
    errors,
    reset,
    control,
    getValues,
  } = useEditProfileScreen();

  return (
    <View style={{flex: 1}}>
      <HeaderComponent
        headerTitle={'Edit Profile'}
        goBack={() => navigation.goBack()}
        isBack
      />
      <View style={styles.editProfileMain}>
        <View style={styles.whiteCircle}>
          <CircleImage
            image={profileData?.uri ?? imageUrl(userData?.profile_image)}
            styles={styles.profileView}
            uri={true}
          />
          <Touchable style={styles.addIcon} onPress={uploadFromGalary}>
            <Image
              source={addProfileImage}
              resizeMode="contain"
              style={{height: hp('6')}}
            />
          </Touchable>
        </View>
      </View>
      <View style={{...styles.inputMainView, marginTop: 0}}>
        <TextComponent
          text={formatString('first_name')}
          styles={{fontSize: hp('1.8')}}
        />
        <InputComponent
          {...{
            name: 'first_name',
            handleSubmit,
            errors,
            reset,
            control,
            getValues,
            defaultValue: userData?.first_name,
            viewStyle: styles.inputView,
            textStyle: {color: 'black'},
            errorsTextStyle: {color: 'red'},
          }}
        />
      </View>
      <View style={styles.inputMainView}>
        <TextComponent
          text={formatString('last_name')}
          styles={{fontSize: hp('1.8')}}
        />
        <InputComponent
          {...{
            name: 'last_name',
            handleSubmit,
            errors,
            reset,
            control,
            getValues,
            defaultValue: userData?.last_name,
            viewStyle: styles.inputView,
            textStyle: {color: 'black'},
            errorsTextStyle: {color: 'red'},
          }}
        />
      </View>
      <View style={styles.inputMainView}>
        <TextComponent
          text={formatString('email')}
          styles={{fontSize: hp('1.8')}}
        />
        <InputComponent
          {...{
            name: 'email',
            handleSubmit,
            errors,
            reset,
            control,
            getValues,
            defaultValue: userData?.email,
            viewStyle: styles.inputView,
            textStyle: {color: 'black'},
            editable: false,
            errorsTextStyle: {color: 'red'},
          }}
        />
      </View>
      <ThemeButton
        title={'Save'}
        style={styles.btn}
        onPress={handleSubmit(onSave)}
      />
    </View>
  );
};

export default memo(EditProfileScreen);
