import React, {memo, useCallback} from 'react';
import {View, Text, Image, ScrollView, FlatList} from 'react-native';
import {TextComponent} from '../../Components/TextComponent';
import {styles} from './styles';
import useSettingScreen from './useSettingScreen';
import {allSubID, catData, settingData} from '../../Utils/localDB';
import {arrowrightsmall, downloadIcon, user} from '../../Assets';
import {hp} from '../../Config/responsive';
import {HeaderComponent} from '../../Components/HeaderComponent';
import {Touchable} from '../../Components/Touchable';
import Icon from 'react-native-vector-icons/Feather';
import {AlertDesign} from '../../Components/AlertDesign';
import BlurImage from '../../Components/BlurImage';
import {imageUrl} from '../../Utils/Urls';
import {hasOneMonthPassed} from '../../Services/GlobalFunctions';

const SettingScreen = ({navigation}) => {
  const {
    onCancel,
    onConfirm,
    tabScreen,
    alert,
    deleteAlert,
    logoutAlert,
    toggleAlert,
    userData,
  } = useSettingScreen(navigation);
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
      <HeaderComponent
        headerTitle={'Setting'}
        goBack={() => navigation.goBack()}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: hp('7'), paddingTop: hp('2')}}>
        <View style={styles.catMain}>
          {/* <CircleImage
          uri={true}
          image={imageUrl(userData?.profile_image)}
          styles={styles.profileImg}
        /> */}
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <BlurImage
              blurhash={'LKK1wP_3yYIU4.jsWrt7_NRjMdt7'}
              radius={75}
              isURI={true}
              styles={styles.ProfileImage}
              uri={imageUrl(userData?.profile_image)}
            />
          </View>
          <TextComponent text={userData?.first_name} styles={styles.userName} />
          <TextComponent
            text={
              userData?.identifier
                ? allSubID[userData?.identifier]
                : !hasOneMonthPassed(userData?.start_trial_at) &&
                  userData?.revenuecat_customer_id != null
                ? 'One Month Free Trial'
                : hasOneMonthPassed(userData?.start_trial_at)
                ? 'Free trial ended'
                : 'One Month Free Trial'
            }
            styles={styles.trailText}
            onPress={() =>
              userData?.identifier == null &&
              navigation.navigate('AfterSubscriptionScreen')
            }
          />

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
            isVisible={
              (deleteAlert == true && deleteAlert) ||
              (logoutAlert == true && logoutAlert)
            }
            message={
              (logoutAlert && 'Are you sure you want to logout?') ||
              (deleteAlert &&
                'Are you sure that you want to delete your account?')
            }
            title={'Warning'}
            confirmText={'Yes, I want to'}
            onConfirm={() =>
              onConfirm(
                (logoutAlert && 'logoutAlert') ||
                  (deleteAlert && 'deleteAlert'),
              )
            }
            onCancel={() =>
              toggleAlert(
                (logoutAlert && 'logoutAlert') ||
                  (deleteAlert && 'deleteAlert'),
              )
            }
          />
        </View>
      </ScrollView>
    </>
  );
};
export default memo(SettingScreen);
