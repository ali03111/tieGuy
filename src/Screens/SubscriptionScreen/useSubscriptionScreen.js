import React, {useEffect, useState} from 'react';
import {Alert, Platform} from 'react-native';
import useReduxStore from '../../Hooks/UseReduxStore';
import API from '../../Utils/helperFunc';
import {AfterSubBuyUrl, StartTrialUrl} from '../../Utils/Urls';
import {errorMessage, successMessage} from '../../Config/NotificationMessage';
import {loadingFalse, loadingTrue} from '../../Redux/Action/isloadingAction';
import Purchases from 'react-native-purchases';
import {useMutation} from '@tanstack/react-query';
import {allSubID} from '../../Utils/localDB';
import {types} from '../../Redux/types';

const SKU = Platform.select({
  android: ['monthly_18012024', 'yearly_18012024'],
  ios: ['monthly_18012024', 'yearly_18012024'],
});

function useSubscriptionScreen({navigate, goBack}) {
  const [products, setProducts] = useState([]);

  const {getState, dispatch} = useReduxStore();
  const {userData} = getState('Auth');

  const {mutate} = useMutation({
    mutationFn: body => API.post(AfterSubBuyUrl, body),
    onSuccess: async ({ok, data}) => {
      if (ok) {
        dispatch(loadingFalse());
        dispatch({
          type: types.UpdateProfile,
          payload: {...data, planName: allSubID[data?.identifier]},
        });
        successMessage('User subscribed successfully');
        if (data?.start_trial_at) goBack();
      } else {
        dispatch(loadingFalse());
        errorMessage(data?.message ?? data?.error ?? 'Something went wrong');
      }
    },
  });

  const {mutateAsync} = useMutation({
    mutationFn: () => {
      const formattedDate = new Date().toISOString().replace('Z', '.000000Z');
      return API.post(StartTrialUrl, {trial_start_at: formattedDate});
    },
    onSuccess: async ({ok, data}) => {
      if (ok) {
        dispatch(loadingFalse());
        successMessage('User subscribed successfully');
        dispatch({type: types.UpdateProfile, payload: data});
      } else {
        dispatch(loadingFalse());
        errorMessage(data?.message ?? data?.error ?? 'Something went wrong');
      }
    },
  });
  const buySubscription = async product => {
    const formattedDate = new Date().toISOString().replace('Z', '.000000Z');
    dispatch(loadingTrue());

    try {
      console.log('Available Purchases methods:', Object.keys(Purchases));
      console.log('Product:', JSON.stringify(product, null, 2));

      // Try purchaseProduct which works across more versions
      const result = await Purchases.purchaseProduct(
        product?.productIdentifier ?? product?.identifier,
      );

      const customerInfo = result.customerInfo;
      console.log('CustomerInfo:', JSON.stringify(customerInfo, null, 2));

      if (customerInfo?.originalAppUserId != null) {
        const activeEntitlement =
          customerInfo.entitlements?.active?.['AppStorePlans'];

        mutate({
          customer_id: customerInfo.originalAppUserId,
          identifier:
            activeEntitlement?.productIdentifier ??
            product?.productIdentifier ??
            product?.identifier,
          start_trial_at: formattedDate,
        });
      }
    } catch (error) {
      if (!error?.userCancelled) {
        errorMessage('Purchase failed or was canceled');
        console.error('Purchase error:', error);
      }
    } finally {
      dispatch(loadingFalse());
    }
  };
  const getProductsFromStore = async () => {
    dispatch(loadingTrue());
    try {
      const allProducts = await Purchases.getProducts(SKU);
      console.log(
        'allProductsallProductsallProductsallProductsallProducts',
        allProducts,
      );
      const yearlyPackage = allProducts?.find(
        res => res.identifier === 'yearly_18012024',
      );
      const monthlyPackage = allProducts?.find(
        res => res.identifier === 'monthly_18012024',
      );
      setProducts([yearlyPackage, monthlyPackage].filter(Boolean));
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      dispatch(loadingFalse());
    }
  };

  useEffect(() => {
    getProductsFromStore();
  }, []);

  return {
    startTrial: false,
    products,
    buySubscription,
    getProductsFromStore,
    startFreeTrial: () => mutateAsync(),
    userData,
  };
}

export default useSubscriptionScreen;
