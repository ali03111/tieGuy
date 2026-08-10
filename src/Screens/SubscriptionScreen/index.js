import React, {memo} from 'react';
import {
  Image,
  ImageBackground,
  Linking,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {arrowBack, monthlyPkStar, tickSquare, triangle} from '../../Assets';
import {styles} from './styles';
import {hp, wp} from '../../Config/responsive';
import {TextComponent} from '../../Components/TextComponent';
import ThemeButton from '../../Components/ThemeButton';
import useSubscriptionScreen from './useSubscriptionScreen';
import {EmptyViewComp} from '../../Components/EmptyViewComp';
import {HeaderComponent} from '../../Components/HeaderComponent';
import {removeDecimals} from '../../Services/GlobalFunctions';

// ─── Apple-required legal URLs ───────────────────────────────────────────────
const PRIVACY_URL = 'https://tieguy.app/privacy_policy';
const TERMS_URL = 'https://tieguy.app/terms_and_conditions';

const details = [
  'Track where your loved ones are - keep them safe.',
  'Track each other across every mile by location sharing.',
  'Stay safe, stay connected! Share your real-time location with just a tap.',
];

// ─── Helper: extract trial info from RevenueCat product ──────────────────────
function getTrialText(product) {
  try {
    const intro =
      product?.introductoryPrice ??
      product?.introPrice ??
      product?.discounts?.[0];

    if (!intro) return null;

    const cycles = intro?.numberOfPeriods ?? intro?.cycles ?? 1;
    const unit =
      intro?.subscriptionPeriod?.unit ?? intro?.periodUnit ?? intro?.unit ?? '';
    const count =
      intro?.subscriptionPeriod?.numberOfUnits ??
      intro?.periodNumberOfUnits ??
      intro?.numberOfUnits ??
      1;

    let periodLabel = '';
    if (unit === 'DAY' || unit === 'day') periodLabel = `${count}-day`;
    else if (unit === 'WEEK' || unit === 'week') periodLabel = `${count}-week`;
    else if (unit === 'MONTH' || unit === 'month')
      periodLabel = `${count}-month`;
    else if (unit === 'YEAR' || unit === 'year') periodLabel = `${count}-year`;

    const price = product?.priceString ?? '';
    const titleLower = (product?.title ?? '').toLowerCase();
    const period = titleLower.includes('year')
      ? 'year'
      : titleLower.includes('month')
      ? 'month'
      : 'period';

    if (periodLabel) {
      return `${periodLabel} free trial, then ${price}/${period}. Cancel anytime.`;
    }
    return `Free trial, then ${price}/${period}. Cancel anytime.`;
  } catch {
    return null;
  }
}

function SubscriptionScreen({navigation}) {
  const {
    products,
    buySubscription,
    fetchData,
    startTrial,
    userData,
    startFreeTrial,
    getProductsFromStore,
  } = useSubscriptionScreen(navigation);

  return (
    <View style={{flex: 1}}>
      <HeaderComponent
        headerTitle={'Subscription Plan'}
        backText={'Back'}
        arrowBackIcon={arrowBack}
        goBack={() => navigation.goBack()}
        isBack={userData?.start_trial_at}
      />
      {products.length > 0 ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            paddingTop: hp('2'),
            paddingBottom: hp('5'),
          }}>
          <TextComponent text={'Choose your Plan'} styles={styles.heading} />

          {products.map(res => {
            const trialText = getTrialText(res);
            return (
              <View style={{marginBottom: hp('2'), paddingHorizontal: wp('3')}}>
                <View style={styles.subView}>
                  <Image
                    source={triangle}
                    style={styles.bgImage}
                    resizeMode="cover"
                  />
                  <View style={styles.priceView}>
                    <View style={styles.textView}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <TextComponent
                          text={res?.priceString}
                          // text={removeDecimals(res?.priceString)}
                          styles={{fontWeight: 'bold', fontSize: hp('3')}}
                        />
                        <TextComponent text={` /${res?.title}`} />
                      </View>
                      <Image
                        source={monthlyPkStar}
                        resizeMode="contain"
                        resizeMethod="resize"
                        style={{
                          width: wp('17'),
                          height: hp('8'),
                        }}
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

                  {/* ── Apple-required: trial + billing info ── */}
                  {trialText && (
                    <Text
                      style={{
                        fontSize: hp('1.4'),
                        color: '#555555',
                        textAlign: 'center',
                        paddingHorizontal: wp('4'),
                        marginBottom: hp('0.5'),
                      }}>
                      {trialText}
                    </Text>
                  )}

                  <ThemeButton
                    title={'Choose Plan'}
                    style={styles.chooseBtn}
                    onPress={() => buySubscription(res)}
                  />
                </View>
              </View>
            );
          })}

          {/* ── Apple-required: Privacy Policy & Terms of Use links ── */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: hp('1'),
              flexWrap: 'wrap',
              paddingHorizontal: wp('4'),
            }}>
            <TouchableOpacity onPress={() => Linking.openURL(PRIVACY_URL)}>
              <Text
                style={{
                  fontSize: hp('1.5'),
                  color: '#007AFF',
                  textDecorationLine: 'underline',
                }}>
                Privacy Policy
              </Text>
            </TouchableOpacity>
            <Text
              style={{
                fontSize: hp('1.5'),
                color: '#555555',
                marginHorizontal: wp('2'),
              }}>
              •
            </Text>
            <TouchableOpacity onPress={() => Linking.openURL(TERMS_URL)}>
              <Text
                style={{
                  fontSize: hp('1.5'),
                  color: '#007AFF',
                  textDecorationLine: 'underline',
                }}>
                Terms of Use
              </Text>
            </TouchableOpacity>
          </View>

          {/* ── Apple-required: subscription auto-renewal disclosure ── */}
          <Text
            style={{
              fontSize: hp('1.3'),
              color: '#888888',
              textAlign: 'center',
              paddingHorizontal: wp('6'),
              marginTop: hp('1'),
            }}>
            Subscriptions automatically renew unless auto-renew is turned off at
            least 24 hours before the end of the current period. Manage
            subscriptions in your App Store account settings.
          </Text>

          {/* {userData?.start_trial_at == null && (
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
                style={styles.chooseBtn}
                onPress={startFreeTrial}
              />
            </>
          )} */}
        </ScrollView>
      ) : (
        <EmptyViewComp onRefresh={getProductsFromStore} />
      )}
    </View>
  );
}
export default memo(SubscriptionScreen);
