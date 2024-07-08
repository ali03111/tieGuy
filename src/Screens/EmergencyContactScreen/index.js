import {View, Text, FlatList, Image, StyleSheet} from 'react-native';
import React, {memo, useCallback} from 'react';
import {HeaderComponent} from '../../Components/HeaderComponent';
import KeyBoardWrapper from '../../Components/KeyBoardWrapper';
import {hp, wp} from '../../Config/responsive';
import {Touchable} from '../../Components/Touchable';
import {keyExtractor} from '../../Utils';
import {addNewBtn, callIcon, divider, phone, threeDots} from '../../Assets';
import {CircleImage} from '../../Components/CircleImage';
import {TextComponent} from '../../Components/TextComponent';
import AddContactModal from './addContactModal';
import {styles} from './styles';
import useEmergencyContactScreen from './useEmergencyContactScreen';

const EmergencyContactScreen = ({navigation}) => {
  const {
    getValues,
    handleSubmit,
    reset,
    onSaveContact,
    toggleModal,
    control,
    errors,
    errorMessage,
    modalState,
  } = useEmergencyContactScreen();

  const renderItem = useCallback(() => {
    return (
      <View style={styles.contactImg}>
        <CircleImage
          image={
            'https://images.pexels.com/photos/15940451/pexels-photo-15940451/free-photo-of-clouds-over-beach.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load'
          }
          uri={true}
        />
        <View style={styles.midleTextView}>
          <TextComponent text={'Brother'} styles={styles.contactName} />
          <View style={styles.numberView}>
            <Image
              source={phone}
              resizeMode="contain"
              style={{width: wp('5')}}
            />
            <TextComponent text={'012-3456-7890'} />
          </View>
        </View>
        <Touchable
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
        </Touchable>
      </View>
    );
  });

  return (
    <View style={{flexGrow: 1}}>
      <HeaderComponent
        headerTitle={'Emergency Contacts'}
        isBack
        goBack={() => navigation.goBack()}
      />
      <FlatList
        data={[1, 2, 3, 4, 5, 6, 7, 8, 9]}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <Touchable style={styles.addNewBtn} onPress={toggleModal}>
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
          // userData={{name: 'fsdfsdf', phone: 'skdvnklsdnvsd'}}
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
