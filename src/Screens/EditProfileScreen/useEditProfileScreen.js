import {Platform, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import useReduxStore from '../../Hooks/UseReduxStore';
import {useMutation} from '@tanstack/react-query';
import {formDataFunc} from '../../Utils/helperFunc';
import {updateProfileUrl} from '../../Utils/Urls';
import useFormHook from '../../Hooks/UseFormHooks';
import Schemas from '../../Utils/Validation';
import {types} from '../../Redux/types';
import {errorMessage, successMessage} from '../../Config/NotificationMessage';
import {loadingFalse} from '../../Redux/Action/isloadingAction';
import ImageCropPicker from 'react-native-image-crop-picker';

export default function useEditProfileScreen() {
  const {dispatch, getState} = useReduxStore();
  const {userData} = getState('Auth');
  const [profileData, setProfileData] = useState(null);
  const {handleSubmit, errors, reset, control, getValues} = useFormHook(
    Schemas.editProfile,
  );

  const {mutate} = useMutation({
    mutationFn: data => {
      return formDataFunc(updateProfileUrl, data, 'profile_image');
    },
    onSuccess: ({ok, data}) => {
      if (ok) {
        dispatch({
          type: types.UpdateProfile,
          payload: data.user,
        });
        dispatch(loadingFalse());
        successMessage('Your profile updated sucessfully!');
      }
      dispatch(loadingFalse());
    },
    onError: ({message}) => {
      dispatch(loadingFalse());
      errorMessage(message);
    },
  });

  const onSave = ({first_name, last_name}) => {
    mutate({first_name, last_name, profile_image: profileData});
  };

  //GET IMAGE From Mobile
  const uploadFromGalary = async () => {
    const {
      height,
      width,
      size,
      path,
      filename,
      sourceURL,
      localIdentifier,
      mime,
    } = await ImageCropPicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    });
    const uri = Platform.OS === 'ios' ? sourceURL : path;
    const fileName = filename || 'photo.jpg';
    setProfileData({
      uri,
      name: fileName,
      type: mime,
    });
  };

  return {
    userData,
    uploadFromGalary,
    onSave,
    profileData,
    handleSubmit,
    errors,
    reset,
    control,
    getValues,
    userData,
  };
}
