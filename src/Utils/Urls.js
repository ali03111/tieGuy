const getCredentials = () => {
  if (__DEV__)
    return {
      baseURL: 'https://tieguy.app/tieGuy-bakend/api',
      imageURL: 'https://tieguy.app/tieGuy-bakend/storage/',
    };
  else {
    console.log = () => {};
    return {
      baseURL: 'https://tieguy.app/tieGuy-bakend/api',
      imageURL: 'https://tieguy.app/tieGuy-bakend/storage/',
    };
  }
};

export const {baseURL, imageURL} = getCredentials();

export const apendUrl = url => {
  return baseURL + url;
};
export const imageUrl = url => {
  return url ? imageURL + url : '';
  // : 'https://res.cloudinary.com/dd6tdswt5/image/upload/v1684830799/UserImages/mhysa2zj0sbmvnw69b35.jpg';
};

export const aboutUrl = 'https://trackpal.co/about_us';
export const privacyUrl = 'https://trackpal.co/privacy_policy';
export const termsUrl = 'https://trackpal.co/terms_and_conditions';

export const MapAPIKey = 'AIzaSyAF-COUBSLnPj1qp_7dgQ0IYV3XiwJwJ4M'; // tieGUY
// export const MapAPIKey = 'AIzaSyAu-nEBbiOahfUyeMc8Lc1gTTKfete_wnQ';

export const registerUrl = '/signup';
export const loginUrl = '/login';
export const allContactsUrl = '/contacts';
export const addContactsUrl = '/add-contact';
export const updateContactUrl = '/update-contact';
export const deleteContactUrl = '/delete-contact';
export const VerifyUserUrl = '/verify';
export const updateProfileUrl = '/update_profile';
export const AfterSubBuyUrl = '/validate-receipt';
export const StartTrialUrl = '/trial-start';

export const DeleteAccUrl = '/user/delete';
export const logoutUrl = 'auth/logout';
