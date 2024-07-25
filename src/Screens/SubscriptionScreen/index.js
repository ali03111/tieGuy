import React, {memo} from 'react';
import {
  Image,
  ImageBackground,
  Platform,
  ScrollView,
  Text,
  View,
} from 'react-native';
import CustomHeader from '../../Components/Header';
import {arrowBack, monthlyPkStar, tickSquare, triangle} from '../../Assets';
import GradientText from '../../Components/GradientText';
import {styles} from './styles';
import {hp, wp} from '../../Config/responsive';
import {TextComponent} from '../../Components/TextComponent';
import ThemeButton from '../../Components/ThemeButton';
import useSubscriptionScreen from './useSubscriptionScreen';
import {EmptyViewComp} from '../../Components/EmptyViewComp';

const details = [
  'Track where your loved ones are - keep them safe.',
  'Track each other across every mile by location sharing.',
  'Stay safe, stay connected! Share your real-time location with just a tap.',
];

function SubscriptionScreen({navigation}) {
  const {products, buySubscription, fetchData, startTrial, userData} =
    useSubscriptionScreen(navigation);
  return (
    <View style={{flex: 1}}>
      <CustomHeader
        headerTitle={'Subscription Plan'}
        backText={'Back'}
        arrowBackIcon={arrowBack}
        goBack={() => navigation.goBack()}
        isBack={userData?.trial_start_at}
      />
      {products.length > 0 ? (
        <>
          <TextComponent text={'Choose your Plan'} styles={styles.heading} />
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              paddingTop: hp('2'),
              paddingBottom: hp('5'),
            }}>
            <View style={styles.subView}>
              <Image
                source={triangle}
                style={styles.bgImage}
                resizeMode="cover"
              />
              <View style={styles.priceView}>
                <View style={styles.textView}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <GradientText
                      GradientAlignment={0.6}
                      style={{fontWeight: 'bold', fontSize: hp('3')}}>
                      18.00
                    </GradientText>
                    <TextComponent text={`/${'Yearly'}`} />
                  </View>
                  <Image
                    source={monthlyPkStar}
                    resizeMode="contain"
                    style={{width: wp('17'), height: hp('8')}}
                  />
                </View>
                {details?.map(res => {
                  return (
                    <View style={styles.bottomTextView}>
                      <Image
                        source={tickSquare}
                        resizeMode="contain"
                        style={{width: wp('5'), height: hp('2')}}
                      />
                      <TextComponent
                        text={res}
                        styles={{fontSize: hp('1.5'), width: wp('83')}}
                        numberOfLines={2}
                      />
                    </View>
                  );
                })}
              </View>
              <ThemeButton title={'Choose Plan'} btnStyle={styles.chooseBtn} />
            </View>
            {!userData?.trial_start_at && (
              <>
                <View style={styles.logInWith}>
                  <Text style={styles.logInBorder}></Text>
                  <Text style={styles.logInText}>
                    or Want to start your one month free trial?
                  </Text>
                  <Text style={styles.logInBorder}></Text>
                </View>
                <ThemeButton
                  title={'Start your free Trial'}
                  btnStyle={styles.chooseBtn}
                />
              </>
            )}
          </ScrollView>
        </>
      ) : null
      // <EmptyViewComp onRefresh={fetchData} />
      }
    </View>
  );
}
export default memo(SubscriptionScreen);
