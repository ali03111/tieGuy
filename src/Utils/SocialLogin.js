import auth from '@react-native-firebase/auth';

/**
 * The function `PhoneNumberLogin` asynchronously handles the button press for signing in with a phone
 * number using Firebase authentication.
 * @returns The `PhoneNumberLogin` function is returning the `confirm` object which is obtained from
 * the `signInWithPhoneNumber` method.
 */
export const PhoneNumberLogin = async phoneNumber => {
  // Handle the button press
  try {
    const {confirm} = await auth().signInWithPhoneNumber(phoneNumber);
    return confirm;
  } catch (error) {
    console.log('eror', error);
  }
};

/**
 * The function `verifyCode` takes a confirmation function and a code as parameters, then calls the
 * confirmation function with the code and logs 'Invalid code' if an error occurs.
 */
export const verifyCode = async ({confirm, code}) => {
  try {
    await confirm(code);
  } catch (error) {
    console.log('Invalid code.');
  }
};

/**
 * The function `emailSignUp` is an asynchronous function that creates a new user account with the
 * provided email and password using Firebase authentication.
 * @returns The function `emailSignUp` is returning the data received after creating a new user account
 * with the provided email and password using the `createUserWithEmailAndPassword` method from the
 * `auth()` object.
 */
export const emailSignUp = async ({email, password}) => {
  console.log('dffs', email, password);
  const data = await auth().createUserWithEmailAndPassword(email, password);
  return data;
};

/**
 * The `emailLogin` function uses Firebase authentication to sign in a user with their email and
 * password.
 * @returns The `emailLogin` function is returning the data received after signing in with the provided
 * email and password using Firebase authentication.
 */
export const emailLogin = async ({email, password}) => {
  const data = await auth().signInWithEmailAndPassword(email, password);
  return data;
};

export const forgotPasswordServices = async email =>
  auth().sendPasswordResetEmail(email);
