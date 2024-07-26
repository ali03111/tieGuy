import React, {useEffect, useState} from 'react';
import {Alert, Platform} from 'react-native';
import useReduxStore from '../../Hooks/UseReduxStore';
import API from '../../Utils/helperFunc';
import {
  AfterSubProAndroidUrl,
  AfterSubProUrl,
  StartTrialUrl,
} from '../../Utils/Urls';
import {errorMessage, successMessage} from '../../Config/NotificationMessage';
import {loadingFalse, loadingTrue} from '../../Redux/Action/isloadingAction';
import {types} from '../../Redux/types';
import Purchases from 'react-native-purchases';

// const SKU = ['21436209'];
// const SKU = ['monthly_18012024'];
const SKU = Platform.select({
  android: ['monthly_18012024', 'yearly_18012024'],
  ios: ['monthly_18012024', 'yearly_18012024'],
});

function useSubscriptionScreen({navigate, goBack}) {
  const {getState} = useReduxStore();

  const {userData} = getState('Auth');

  /**
   * The function `getDataRenewCat` retrieves available subscription packages for a given revenuecat
   * customer ID.
   * @returns The function `getDataRenewCat` returns a promise that resolves to an object with the
   * properties `ok` and `datas`. The `ok` property indicates whether the operation was successful or
   * not, and the `datas` property contains an array with two elements: `yearlyPackages` and
   * `monthlyPackages`.
   */
  const getDataRenewCat = async revenuecat_customer_id => {
    return new Promise(async (resolve, reject) => {
      try {
        const offerings = await Purchases.getOfferings();
        console.log('packages', offerings);
        const allProducts = offerings.current.availablePackages;
        console.log('allProducts', allProducts);
        const yearlyPackages = allProducts.filter(
          res => res.product.subscriptionPeriod == 'P1Y',
        )[0];
        const monthlyPackages = allProducts.filter(
          res => res.product.subscriptionPeriod == 'P1M',
        )[0];
        console.log('======>>>>>', yearlyPackages, monthlyPackages);
        resolve({ok: true, datas: [yearlyPackages, monthlyPackages]});
      } catch (e) {
        reject({ok: false, datas: e});
      }
    });
  };

  /**
   * The function "getCurrencySymbol" takes a price as input and returns the currency symbol by
   * removing all digits, commas, and periods from the input string.
   * @param price - The parameter "price" is a string representing a price value.
   * @returns the currency symbol from the given price.
   **/
  function getCurrencySymbol(price) {
    return price.replace(/[0-9,.]/g, '');
  }

  /**
   * The function calculates the discounted monthly price and returns it as a formatted string with the
   * currency symbol.
   * @param price - The `price` parameter represents the original price of a product or service.
   * @param priceString - The `priceString` parameter is a string that represents the currency symbol
   * used for the price.
   * @returns a string that represents the discounted monthly price, formatted with the currency symbol
   * from the priceString parameter.
   **/
  const getDiscountPrice = (price, priceString) => {
    const numMonths = 12;
    const discountedMonthlyPrice = price / numMonths;
    return `${getCurrencySymbol(priceString)}${discountedMonthlyPrice.toFixed(
      2,
    )}`;
  };

  /** The above code is written in JavaScript and is using the useEffect hook from React. **/
  useEffect(async () => {
    await getDataRenewCat();
    Purchases.addCustomerInfoUpdateListener(info => {
      const {activeSubscriptions} = info;
      console.log('========>>>>>', activeSubscriptions);
    });
  }, []);

  return {
    products: [],
    buySubscription: () => {},
    fetchData: [],
    startTrial: false,
    userData,
  };
}
export default useSubscriptionScreen;
