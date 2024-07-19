import {firebase} from '@react-native-firebase/auth';
import {errorMessage, successMessage} from '../../Config/NotificationMessage';
import useFormHook from '../../Hooks/UseFormHooks';
import useReduxStore from '../../Hooks/UseReduxStore';
import {loadingFalse, loadingTrue} from '../../Redux/Action/isloadingAction';
import Schemas from '../../Utils/Validation';

const useChangePasswordScreen = ({navigate, goBack}) => {
  const {handleSubmit, errors, reset, control, getValues} = useFormHook(
    Schemas.newPassword,
  );

  const {dispatch} = useReduxStore();

  const changePassword = async currentPassword => {
    dispatch(loadingTrue());
    const {password, new_password, confirm_password} = currentPassword;
    console.log(password, new_password, confirm_password, 'asasadasd');
    var user = firebase.auth().currentUser;
    try {
      const reauthenticate = password => {
        // Pass only the password as an argument
        var crd = firebase.auth.EmailAuthProvider.credential(
          user.email,
          password,
        );
        console.log('credential:', crd);
        return user.reauthenticateWithCredential(crd);
      };
      await reauthenticate(password); // Pass only the password
      if (password != new_password) {
        await user.updatePassword(confirm_password);
        successMessage('Your password has been changed');
        goBack();
      } else errorMessage('New password must be different');
    } catch (error) {
      console.log('error:', error);
      errorMessage('Current password is wrong');
    } finally {
      dispatch(loadingFalse());
    }
  };

  return {
    handleSubmit,
    errors,
    reset,
    control,
    getValues,
    changePassword,
  };
};

export default useChangePasswordScreen;
