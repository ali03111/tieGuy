import {View, Text, Modal, Image, Platform, TextInput} from 'react-native';
import React, {useState} from 'react';
import {styles} from './styles';
import {blurImg, closeIcon, uploadBtn} from '../../Assets';
import {hp, wp} from '../../Config/responsive';
import {TextComponent} from '../../Components/TextComponent';
import {InputComponent} from '../../Components/InputComponent';
import {Colors} from '../../Theme/Variables';
import {Touchable} from '../../Components/Touchable';
import ThemeButton from '../../Components/ThemeButton';
import ImageCropPicker from 'react-native-image-crop-picker';

const AddContactModal = ({
  userData,
  onSaveContact,
  errorMessage,
  toggleModal,
  modalState,
}) => {
  const [name, setName] = useState(userData?.name ?? null);
  const [phone, setPhone] = useState(userData?.phone ?? null);
  const [image, setImage] = useState(userData?.image ?? null);

  const getImageFromGallery = async () => {
    const {height, width, size, path, filename, sourceURL} =
      await ImageCropPicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
      });
    console.log(
      's,jdbvjksdbjkvbsdkjvbjksdbvjksdbjvbsdkjbvsd',
      sourceURL,
      height,
      width,
      size,
      path,
      filename,
    );
  };

  return (
    <View style={styles.mainView}>
      <Modal
        isVisible={modalState}
        animationInTiming={100}
        animationOutTiming={100}
        useNativeDriver
        avoidKeyboard={true}
        hideModalContentWhileAnimating
        onBackButtonPress={toggleModal}
        animationType="fade"
        style={styles.bottomModal}>
        <View style={styles.underModal}>
          <Image style={styles.absolute} source={blurImg} />
          <View style={styles.modalData}>
            <Touchable onPress={toggleModal} style={styles.closeBtn}>
              <Image
                source={closeIcon}
                resizeMode="contain"
                style={styles.closeImg}
              />
            </Touchable>
            <TextComponent
              text={'Add Emergency Contacts'}
              styles={styles.emergencyText}
            />
            <TextComponent text={'Name'} styles={{fontSize: hp('1.8')}} />
            <View style={styles.inputView}>
              <TextInput
                placeholderTextColor={Colors.lightGray}
                style={{flex: 1, color: 'black'}}
                value={name}
                onChangeText={t => setName(t)}
              />
            </View>
            {errorMessage.name != null && errorMessage.name != '' && (
              <TextComponent
                text={errorMessage.name}
                styles={styles.errorMessage}
              />
            )}
            <TextComponent
              text={'Phone'}
              styles={{fontSize: hp('1.8'), marginTop: hp('2')}}
            />
            <View style={styles.inputView}>
              <TextInput
                placeholderTextColor={Colors.lightGray}
                style={{flex: 1, color: 'black'}}
                value={phone}
                onChangeText={t => setPhone(t)}
                keyboardType="number-pad"
              />
            </View>
            {errorMessage.phone != null && errorMessage.phone != '' && (
              <TextComponent
                text={errorMessage.phone}
                styles={styles.errorMessage}
              />
            )}
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TextComponent
                text={'Upload Photo'}
                styles={{fontSize: hp('1.8'), marginTop: hp('2')}}
              />
              <TextComponent
                text={' (Optional)'}
                styles={{fontSize: hp('1.8'), marginTop: hp('2')}}
                fade={true}
              />
            </View>
            <Touchable onPress={getImageFromGallery} style={styles.uploadBtn}>
              <Image
                source={uploadBtn}
                resizeMode="contain"
                style={styles.upIcon}
              />
              <TextComponent
                text={'Upload Photo'}
                styles={{color: Colors.themeOrg, fontSize: hp('1.5')}}
              />
            </Touchable>
            <ThemeButton
              title={'Add Contact'}
              style={{marginTop: hp('2')}}
              onPress={() => onSaveContact({name, phone, image})}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AddContactModal;
