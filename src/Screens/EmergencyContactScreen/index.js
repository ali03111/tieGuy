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

const EmergencyContactScreen = ({navigation}) => {
  const renderItem = useCallback(() => {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: hp('1.8'),
        }}>
        <CircleImage
          image={
            'https://images.pexels.com/photos/15940451/pexels-photo-15940451/free-photo-of-clouds-over-beach.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load'
          }
          uri={true}
        />
        <View
          style={{
            width: wp('65'),
            paddingLeft: wp('2'),
            alignContent: 'center',
            height: hp('6'),
          }}>
          <TextComponent
            text={'Brother'}
            styles={{fontWeight: 'bold', height: hp('2')}}
          />
          <View
            style={{
              width: wp('65'),
              flexDirection: 'row',
              alignItems: 'center',
            }}>
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
        data={[1, 2, 3, 4, 5, 6, 7]}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <Touchable
              style={{
                height: hp('6'),
                alignItem: 'center',
                marginVertical: hp('1.5'),
                //   top: hp('3.5'),
                //   backgroundColor: 'red',
              }}>
              <Image
                source={addNewBtn}
                resizeMode="contain"
                style={{flex: 1, width: wp('50'), left: wp('-8')}}
              />
            </Touchable>
            <View
              style={{
                borderBottomColor: 'black',
                borderBottomWidth: StyleSheet.hairlineWidth,
              }}
            />
          </>
        }
        renderItem={renderItem}
        ItemSeparatorComponent={
          <View
            style={{
              borderBottomColor: 'black',
              borderBottomWidth: StyleSheet.hairlineWidth,
            }}
          />
        }
        contentContainerStyle={{
          width: wp('90'),
          alignSelf: 'center',
        }}
      />
    </View>
  );
};

export default memo(EmergencyContactScreen);
