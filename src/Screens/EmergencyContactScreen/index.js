import {View, Text, FlatList, Image, StyleSheet, Alert} from 'react-native';
import React, {memo, useCallback} from 'react';
import {HeaderComponent} from '../../Components/HeaderComponent';
import KeyBoardWrapper from '../../Components/KeyBoardWrapper';
import {hp, wp} from '../../Config/responsive';
import {Touchable} from '../../Components/Touchable';
import {keyExtractor} from '../../Utils';
import {
  addNewBtn,
  callIcon,
  divider,
  editIcon,
  phone,
  threeDots,
  trashIcon,
} from '../../Assets';
import {CircleImage} from '../../Components/CircleImage';
import {TextComponent} from '../../Components/TextComponent';
import AddContactModal from './addContactModal';
import {styles} from './styles';
import useEmergencyContactScreen from './useEmergencyContactScreen';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from 'react-native-popup-menu';
import {contactArry} from '../../Utils/localDB';

const EmergencyContactScreen = ({navigation}) => {
  const {
    getValues,
    handleSubmit,
    reset,
    onSaveContact,
    toggleModal,
    onOpenModal,
    setContactData,
    contactData,
    control,
    errors,
    errorMessage,
    modalState,
    allContacts,
    addedContacts,
  } = useEmergencyContactScreen();

  const renderItem = useCallback(({item, index}) => {
    return (
      <View style={styles.contactImg} key={index}>
        <CircleImage image={item?.image?.uri} uri={true} />
        <View style={styles.midleTextView}>
          <TextComponent text={item?.name} styles={styles.contactName} />
          <View style={styles.numberView}>
            <Image
              source={phone}
              resizeMode="contain"
              style={{width: wp('5')}}
            />
            <TextComponent text={item?.phone} />
          </View>
        </View>
        <Menu>
          <MenuTrigger
            children={
              <Touchable
                style={{
                  marginLeft: wp('7'),
                }}
                disabled>
                <Image
                  source={threeDots}
                  resizeMode="contain"
                  style={{
                    width: wp('6'),
                  }}
                />
              </Touchable>
            }
          />
          <MenuOptions optionsContainerStyle={styles.mainMenu}>
            <MenuOption
              onSelect={() => onOpenModal(item)}
              style={styles.menuOption}>
              <Image
                source={editIcon}
                resizeMode="contain"
                style={styles.menuImg}
              />
              <TextComponent text={'Edit'} />
            </MenuOption>
            <MenuOption
              onSelect={() => Alert.alert(`Remove`)}
              style={styles.menuOption}>
              <Image
                source={trashIcon}
                resizeMode="contain"
                style={styles.menuImg}
              />
              <TextComponent text={'Remove '} styles={{color: 'red'}} />
            </MenuOption>
          </MenuOptions>
        </Menu>
        {/* <Touchable
          style={{
            marginLeft: wp('7'),
          }}>
          <Image
            source={threeDots}
            resizeMode="contain"
            style={{
              width: wp('6'),
            }}
          />
        </Touchable> */}
      </View>
    );
  }, []);

  return (
    <View style={{flexGrow: 1}}>
      <HeaderComponent
        headerTitle={'Emergency Contacts'}
        isBack
        goBack={() => navigation.goBack()}
      />
      <FlatList
        data={[...allContacts, ...addedContacts]}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <Touchable
              style={styles.addNewBtn}
              onPress={() => {
                setContactData({
                  name: '',
                  phone: '',
                  img: '',
                });
                toggleModal();
              }}>
              <Image
                source={addNewBtn}
                resizeMode="contain"
                style={styles.addBtnImg}
              />
            </Touchable>
            <View style={styles.divider} />
          </>
        }
        renderItem={renderItem}
        ItemSeparatorComponent={<View style={styles.divider} />}
        contentContainerStyle={styles.flatListCont}
      />
      {modalState && (
        <AddContactModal
          userData={contactData}
          onSaveContact={onSaveContact}
          errorMessage={errorMessage}
          toggleModal={toggleModal}
          modalState={modalState}
        />
      )}
    </View>
  );
};

export default memo(EmergencyContactScreen);
