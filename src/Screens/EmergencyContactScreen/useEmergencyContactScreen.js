import {useState} from 'react';
import useFormHook from '../../Hooks/UseFormHooks';
import Schemas from '../../Utils/Validation';

const useEmergencyContactScreen = () => {
  const {handleSubmit, errors, reset, control, getValues} = useFormHook(
    Schemas.logIn,
  );

  const [errorMessage, setErrorMessage] = useState({
    name: '',
    phone: '',
  });

  const [modal, setModal] = useState(false);

  const toggleModal = () => {
    setErrorMessage({
      name: null,
      phone: null,
    });
    setModal(!modal);
  };

  const regex = /^[A-Za-z ]*$/;

  const onSaveContact = ({name, phone, image}) => {
    if (name == null || name == '' || !regex.test(name)) {
      setErrorMessage(prev => ({
        ...prev,
        name: `Please enter${regex.test(name) ? ' your name' : ' valid name'}`,
      }));
    } else if (phone == null || phone == '') {
      setErrorMessage(prev => ({name: null, phone: `Please enter you number`}));
    } else {
      console.log('slkjdbvlkjsbdklvbsdlkbvklsdbvsd', name, phone);
      setErrorMessage({
        name: null,
        phone: null,
      });
      toggleModal();
    }
  };

  return {
    handleSubmit,
    errors,
    reset,
    control,
    getValues,
    onSaveContact,
    errorMessage,
    toggleModal,
    modalState: modal,
  };
};

export default useEmergencyContactScreen;
