import React, {memo, useCallback} from 'react';
import {View, Text, Image, ScrollView, FlatList} from 'react-native';
import {TextComponent} from '../../Components/TextComponent';
import {styles} from './styles';
import useSettingScreen from './useSettingScreen';
import {catData, settingData} from '../../Utils/localDB';
import {arrowrightsmall, downloadIcon} from '../../Assets';
import {hp} from '../../Config/responsive';
import {HeaderComponent} from '../../Components/HeaderComponent';
import {Touchable} from '../../Components/Touchable';
import Icon from 'react-native-vector-icons/Feather';
import {AlertDesign} from '../../Components/AlertDesign';

const SettingScreen = ({navigation}) => {
  const {onCancel, onConfirm, tabScreen, alert} = useSettingScreen(navigation);
  const renderItem = useCallback(({item, index}) => {
    return (
      <Touchable style={styles.cardBtn} onPress={() => tabScreen(item)}>
        <Image source={item?.image} style={styles.iconStyle} />
        <TextComponent text={item?.title} styles={styles.titleStyle} />
        <Icon
          name="chevron-right"
          size={25}
          color={'black'}
          style={styles.arrowRight}
        />
      </Touchable>
    );
  });
  return (
    <>
      <HeaderComponent title={'Settings'} goBack={() => navigation.goBack()} />
      <ScrollView>
        <View style={styles.catMain}>
          <FlatList
            refreshing={false}
            data={settingData}
            renderItem={renderItem}
            contentContainerStyle={{
              // alignItems: 'center',
              marginTop: hp('2'),
            }}
          />
          <AlertDesign
            isVisible={alert}
            onConfirm={onConfirm}
            onCancel={onCancel}
            title={'Log Out?'}
            message={'Are you sure, you want to log out?'}
            confirmText={'Yes, I want to'}
          />
        </View>
      </ScrollView>
    </>
  );
};
export default memo(SettingScreen);
