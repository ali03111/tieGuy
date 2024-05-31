import React, {memo, useCallback} from 'react';
import {
  View,
  FlatList,
  Dimensions,
  Image,
  ScrollView,
  ImageBackground,
} from 'react-native';
import useOnboardScreen from './useOnboardScreen';
import {styles} from './styles';
import {keyExtractor} from '../../Utils';
import {hp, wp} from '../../Config/responsive';
import {TextComponent} from '../../Components/TextComponent';
import ThemeButton from '../../Components/ThemeButton';
import {Touchable} from '../../Components/Touchable';
import {arrow} from '../../Assets';

const OnboardScreen = ({navigation}) => {
  const {onBoardingData, currentIndex, onSnapToItem, goNext, flatListRef} =
    useOnboardScreen(navigation);
  const renderItem = useCallback(
    ({item, index}) => {
      return (
        // currentIndex == index && (
        <ImageBackground
          style={styles.bannerImg}
          // resizeMode="contain"
          source={item?.image}>
          <View style={styles.centerMainView}>
            {/* <Image
              source={item?.splashImage}
              resizeMode="contain"
              style={styles.splashImg}
            /> */}
            <TextComponent text={item?.heading} styles={styles.hdStyle} />
            <TextComponent text={item?.description} styles={styles.descStyle} />
            {/* <ThemeButton title={'next'} onPress={goNext} /> */}
          </View>
        </ImageBackground>
      );
      // );
    },
    [currentIndex],
  );
  const renderItemDots = useCallback(
    ({item, index}) => {
      return <View style={styles.dot(currentIndex, index)} />;
    },
    [currentIndex],
  );
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        flex: 1,
        position: 'relative',
        // width: wp('100'),
        // height: hp('100'),
        // paddingBottom: hp('10'),
      }}>
      <FlatList
        refreshing={false}
        ref={flatListRef}
        data={onBoardingData}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
        horizontal
        scrollEnabled={true}
        onMomentumScrollEnd={onSnapToItem}
        keyExtractor={keyExtractor}
        pagingEnabled={true}
        contentContainerStyle={{
          flexDirection: 'row',
          paddingBottom: 0,
        }}
        style={{paddingBottom: 0}}
      />
      <View style={styles.bottomContainer}>
        {/* <FlatList
        refreshing={false}
        data={[0, 1]}
        renderItem={renderItemDots}
        alwaysBounceVertical
        showsHorizontalScrollIndicator={false}
        horizontal
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.dotList}
        style={{alignSelf: 'center'}}
      /> */}

        {/* {currentIndex == 1 ? (
        // <Animatable.View animation={'bounceIn'}>
        <ButtonWithIcon
          title={'Get Start'}
          style={styles.getStart}
          onPress={getStart}
        />
      ) : (
        // </Animatable.View>
        <ButtonWithIcon
          title={'Next'}
          style={styles.getStart}
          onPress={goNext}
        />
      )} */}
        <FlatList
          data={onBoardingData} // Use the same data for the dots
          renderItem={renderItemDots}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dotList}
        />

        <Touchable style={styles.btnArrow} onPress={goNext}>
          <TextComponent text={'Next'} styles={styles.arrowText} />
          <Image source={arrow} resizeMode="contain" style={{width: wp('5')}} />
        </Touchable>
      </View>
    </ScrollView>
  );
};

export default memo(OnboardScreen);
