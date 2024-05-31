import React, {useCallback, useEffect} from 'react';
import {
  BackHandler,
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {hp, wp} from '../Config/responsive';
import {Colors} from '../Theme/Variables';
import {TextComponent} from './TextComponent';
// import {goBack} from '../Utils';
import {backIcon, searchIcon} from '../Assets';
import {Touchable} from './Touchable';
import TabButton from './TabButton';

export const HeaderComponent = ({
  onPress,
  title,
  search,
  searchFunction,
  isCategory,
  categoryData,
  headerShow,
  activeBtn,
  goBack,
}) => {
  const renderItem = useCallback(({item, index}) => {
    return (
      <View>
        <TabButton
          onPress={() => onPress(item)}
          style={styles.tabs(Boolean(activeBtn == item.id))}
          title={item.title}
        />
      </View>
    );
  });

  useEffect(() => {
    const backAction = () => {
      goBack(); // Call your goBack function when the back button is pressed
      return true; // Prevent default behavior (exit the app)
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove(); // Remove event listener on component unmount
  }, [goBack]);

  return (
    <View style={{...styles.headerTop, ...headerShow}}>
      <View style={styles.headerInner}>
        <Touchable onPress={goBack}>
          <Image
            source={backIcon}
            style={styles.backBtn}
            resizeMode="contain"
          />
        </Touchable>
        <TextComponent text={title} numberOfLines={1} styles={styles.heading} />
        <Touchable onPress={searchFunction}>
          <Image
            source={search ? searchIcon : ''}
            style={styles.searchBtn}
            resizeMode="contain"
          />
        </Touchable>
      </View>
      <View style={styles.btnMain}>
        {isCategory && (
          <FlatList
            refreshing={false}
            data={categoryData}
            renderItem={renderItem}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              alignItems: 'center',
              // marginTop: hp('2.5'),
            }}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerTop: {
    backgroundColor: Colors.headerBg,
    borderRadius: 15,
    borderTopStartRadius: 0,
    borderTopEndRadius: 0,
  },
  headerInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: wp('5'),
    paddingTop: Platform.OS == 'ios' ? hp('7') : hp('4'),
    paddingBottom: hp('3'),
    // verticalAlign: 'middle',
  },
  heading: {
    color: Colors.white,
    fontSize: hp('2.5'),
  },
  backBtn: {
    width: wp('6'),
    height: hp('3.5'),
  },
  searchBtn: {
    width: wp('5'),
    height: hp('3.5'),
  },
  tabs: isActive => ({
    // width: '110%',
    marginRight: wp('2.2'),
    marginBottom: hp('2.5'),
    backgroundColor: isActive
      ? Colors.primaryColor
      : 'rgba(255, 255, 255, 0.1)',
  }),
  btnMain: {
    marginLeft: wp('5'),
  },
});
