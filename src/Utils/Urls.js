const getCredentials = () => {
  if (__DEV__)
    return {
      baseURL: 'https://virtualrealitycreators.com/green-boom/api',
      imageURL: 'https://virtualrealitycreators.com/green-boom/',
    };
  else {
    console.log = () => {};
    return {
      baseURL: 'https://virtualrealitycreators.com/green-boom/api',
      imageURL: 'https://virtualrealitycreators.com/green-boom/',
    };
  }
};

export const {baseURL, imageURL} = getCredentials();

export const apendUrl = url => {
  return baseURL + url;
};
export const imageUrl = url => {
  console.log(url, 'sdfksdfl;jlsdkj');
  return url ? imageURL + url : '';
  // : 'https://res.cloudinary.com/dd6tdswt5/image/upload/v1684830799/UserImages/mhysa2zj0sbmvnw69b35.jpg';
};

export const registerUrl = '/register';
export const loginUrl = '/login-user';
export const logoutUrl = 'auth/logout';
export const getAgoraTokenUrl = 'getAccessToken/';
export const sendType = 'customer/send-type';
export const tabButtonType = 'customer/training-media/';
export const msdSheets = 'customer/msdsSheet-list/';
export const catalogBroucher = 'customer/catalogBrouchers-list/';
export const updateUser = '/customer/update-user/';
export const salesPitch = '/customer/all-perfectSale/';
export const productListApi = '/customer/product-list/';
export const singleProduct = '/customer/product-data/';
export const orderKit = '/customer/order-kit-list/';
export const kitForm = '/customer/add-order-kit/';
export const welcomeVideo = '/customer/welcome-video/';
export const faqHtml = '/customer/faqs-list/';
